<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\User;
use App\Models\Tour;
use App\Models\Department;
use App\Models\ActivityLog;
use App\Notifications\OfficialLetterIssued;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class LetterController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Letter::class);
        $user = $request->user();
        
        $roleName = strtolower(str_replace([' ', '-'], '_', optional($user->role)->name));

        $query = Letter::with(['issuer', 'recipients']);

        if (!in_array($roleName, ['admin', 'hr', 'ceo'])) {
            $query->where(function ($q) use ($user) {
                $q->where('issued_by', $user->id)
                  ->orWhere(function ($subQuery) use ($user) {
                      $subQuery->where('status', 'issued')
                               ->whereHas('recipients', fn($sq) => $sq->where('user_id', $user->id));
                  });
            });

            if ($roleName === 'team_in_charge' && $user->employee) {
                $deptId = $user->employee->department_id;
                
                $query->orWhere(function ($q) use ($deptId) {
                    $q->where('status', 'issued')
                      ->where(function ($subQuery) use ($deptId) {
                          $subQuery->whereHas('issuer.employee', fn($sq) => $sq->where('department_id', $deptId))
                                   ->orWhereHas('recipients.employee', fn($sq) => $sq->where('department_id', $deptId));
                      });
                });
            }
        } else {
            $query->where(function ($q) use ($user) {
                $q->where('status', '!=', 'draft')
                  ->orWhere('issued_by', $user->id);
            });
        }

        return Inertia::render('Letters/Index', [
            'letters' => $query->latest()->get()
        ]);
    }

    public function create()
    {
        $this->authorize('create', Letter::class);
        return Inertia::render('Letters/Compose', $this->getFormData());
    }

    public function store(Request $request)
    {
        $this->authorize('create', Letter::class);

        $validated = $request->validate([
            'type' => 'required|string',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'validity_type' => 'required|string',
            'validity_value' => 'nullable|string',
            'recipients' => 'required|array|min:1',
            'action_type' => 'required|in:draft,send',
        ]);

        $letter = DB::transaction(function () use ($validated, $request) {
            $status = $validated['action_type'] === 'draft' ? 'draft' : 'issued';

            $letter = Letter::create(array_merge(
                $request->only(['type', 'subject', 'content', 'validity_type', 'validity_value']),
                [
                    'issued_by' => Auth::id(),
                    'status' => $status
                ]
            ));

            $userIds = $this->resolveRecipients($validated['recipients']);
            if (!empty($userIds)) {
                $letter->recipients()->syncWithoutDetaching($userIds);
            }

            $this->logActivity(
                $status === 'draft' ? 'letter_draft_created' : 'letter_created_and_sent', 
                $letter, 
                $request->ip()
            );

            return $letter;
        });

        // Trigger notifications if the letter is finalized and sent
        if ($validated['action_type'] === 'send') {
            $letter->load(['recipients', 'issuer']);
            Notification::send($letter->recipients, new OfficialLetterIssued($letter));
        }

        return redirect()->route('letters.edit', $letter->id);
    }

    public function edit(Letter $letter)
    {
        $this->authorize('update', $letter);
        
        if ($letter->status !== 'draft') {
            abort(403, 'Only draft letters can be edited.');
        }

        $letter->load('recipients');
        return Inertia::render('Letters/Compose', array_merge(['letter' => $letter], $this->getFormData()));
    }

    public function update(Request $request, Letter $letter)
    {
        $this->authorize('update', $letter);

        if ($letter->status !== 'draft') {
            abort(403, 'Only draft letters can be edited.');
        }

        $validated = $request->validate([
            'type' => 'required|string',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'validity_type' => 'required|string',
            'validity_value' => 'nullable|string',
            'recipients' => 'required|array|min:1',
            'action_type' => 'required|in:draft,send',
        ]);

        DB::transaction(function () use ($validated, $letter, $request) {
            $oldData = $letter->toArray();
            $status = $validated['action_type'] === 'draft' ? 'draft' : 'issued';

            $letter->update(array_merge(
                $request->only(['type', 'subject', 'content', 'validity_type', 'validity_value']),
                ['status' => $status]
            ));
            
            $letter->recipients()->sync($this->resolveRecipients($validated['recipients']));

            $this->logActivity(
                $status === 'draft' ? 'letter_draft_updated' : 'letter_updated_and_sent', 
                $letter, 
                $request->ip(), 
                $oldData
            );
        });

        // Trigger notifications and redirect if finalized
        if ($validated['action_type'] === 'send') {
            $letter->load(['recipients', 'issuer']);
            Notification::send($letter->recipients, new OfficialLetterIssued($letter));
            
            return redirect()->route('letters.show', $letter->id)->with('success', 'Letter issued successfully.');
        }

        return redirect()->back()->with('success', 'Draft updated successfully.');
    }

    public function show(Letter $letter)
    {
        $this->authorize('view', $letter);
        $letter->load(['issuer', 'recipients']);
        return Inertia::render('Letters/Show', [
            'letterId' => $letter->id, 
            'letterDetails' => $letter
        ]);
    }

    public function acknowledge(Request $request, Letter $letter)
    {
        $this->authorize('acknowledge', $letter);
        
        if ($letter->status !== 'issued') {
            abort(403, 'You can only acknowledge issued letters.');
        }
        
        $letter->recipients()->updateExistingPivot(Auth::id(), ['read_at' => now()]);
        
        return back()->with('success', 'Letter acknowledged successfully.');
    }

    public function cancel(Request $request, Letter $letter)
    {
        $this->authorize('update', $letter);

        if (!in_array($letter->status, ['draft', 'issued'])) {
            return back()->with('error', 'This letter cannot be cancelled.');
        }

        DB::transaction(function () use ($letter, $request) {
            $oldData = $letter->toArray();
            
            $letter->update(['status' => 'cancelled']);
            
            $this->logActivity('letter_cancelled', $letter, $request->ip(), $oldData);
        });

        return back()->with('success', 'Letter cancelled successfully.');
    }

    private function getFormData()
    {
        $employees = User::with('employee.department')
            ->whereIn('status', ['active', 'probation'])
            ->get()
            ->map(fn($u) => [
                'id' => $u->id, 
                'name' => $u->name, 
                'dept' => optional(optional($u->employee)->department)->name ?? 'Staff'
            ]);

        $departments = Department::where('is_active', true)
            ->get()
            ->map(fn($d) => [
                'id' => "dept_{$d->id}", 
                'name' => "All {$d->name} Department"
            ]);

        $tours = Tour::where('end_date', '>=', now()->toDateString())
            ->get()
            ->map(fn($t) => [
                'id' => $t->id, 
                'name' => "{$t->name} (" . Carbon::parse($t->start_date)->format('M j') . " - " . Carbon::parse($t->end_date)->format('M j') . ")"
            ]);

        return compact('employees', 'departments', 'tours');
    }

    private function resolveRecipients(array $recipients)
    {
        $userIds = collect($recipients)
            ->filter(fn($i) => is_numeric($i))
            ->map(fn($i) => (int)$i)
            ->toArray();

        $departments = collect($recipients)
            ->reject(fn($i) => is_numeric($i))
            ->map(fn($i) => str_replace('dept_', '', $i))
            ->toArray();

        if (!empty($departments)) {
            $deptUserIds = User::whereHas('employee', fn($q) => $q->whereIn('department_id', $departments))
                ->whereIn('status', ['active', 'probation'])
                ->pluck('id')
                ->toArray();
                
            $userIds = array_unique(array_merge($userIds, $deptUserIds));
        }

        return $userIds;
    }

    private function logActivity(string $action, Letter $letter, string $ip, ?array $oldData = null)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model_type' => Letter::class,
            'model_id' => $letter->id,
            'old_data' => $oldData,
            'new_data' => $letter->fresh('recipients')->toArray(),
            'ip_address' => $ip,
        ]);
    }
}