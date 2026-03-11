<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\User;
use App\Models\Tour;
use App\Models\Department;
use App\Models\ActivityLog;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class LetterController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Letter::class);
        $user = $request->user();

        $query = Letter::with(['issuer', 'recipients'])
            ->where('issued_by', $user->id)
            ->orWhereHas('recipients', fn($q) => $q->where('user_id', $user->id));

        if ($user->role->name === 'Team_In_Charge') {
            $query->orWhereHas('issuer.employee', fn($q) => $q->where('department_id', $user->employee->department_id))
                  ->orWhereHas('recipients.employee', fn($q) => $q->where('department_id', $user->employee->department_id));
        }

        return Inertia::render('Letters/Index', ['letters' => $query->latest()->get()]);
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
            $letter = Letter::create(array_merge(
                $request->only(['type', 'subject', 'content', 'validity_type', 'validity_value']),
                ['issued_by' => Auth::id()]
            ));

            $userIds = $this->resolveRecipients($validated['recipients']);
            if (!empty($userIds)) $letter->recipients()->syncWithoutDetaching($userIds);

            $this->logActivity($validated['action_type'] === 'draft' ? 'letter_draft_created' : 'letter_created_and_sent', $letter, $request->ip());

            return $letter;
        });

        return redirect()->route('letters.edit', $letter->id);
    }

    public function edit(Letter $letter)
    {
        $this->authorize('update', $letter);
        $letter->load('recipients');
        return Inertia::render('Letters/Compose', array_merge(['letter' => $letter], $this->getFormData()));
    }

    public function update(Request $request, Letter $letter)
    {
        $this->authorize('update', $letter);

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

            $letter->update($request->only(['type', 'subject', 'content', 'validity_type', 'validity_value']));
            $letter->recipients()->sync($this->resolveRecipients($validated['recipients']));

            $this->logActivity($validated['action_type'] === 'draft' ? 'letter_draft_updated' : 'letter_updated_and_sent', $letter, $request->ip(), $oldData);
        });

        return redirect()->back();
    }

    public function show(Letter $letter)
    {
        $this->authorize('view', $letter);
        $letter->load(['issuer', 'recipients']);
        return Inertia::render('Letters/Show', ['letterId' => $letter->id, 'letterDetails' => $letter]);
    }

    public function acknowledge(Request $request, Letter $letter)
    {
        $this->authorize('acknowledge', $letter);
        $letter->recipients()->updateExistingPivot(Auth::id(), ['read_at' => now()]);
        return back()->with('success', 'Letter acknowledged successfully.');
    }

    private function getFormData()
    {
        $employees = User::with('employee.department')->whereIn('status', ['active', 'probation'])->get()->map(fn($u) => [
            'id' => $u->id, 'name' => $u->name, 'dept' => optional(optional($u->employee)->department)->name ?? 'Staff'
        ]);

        $departments = Department::where('is_active', true)->get()->map(fn($d) => [
            'id' => "dept_{$d->id}", 'name' => "All {$d->name} Department"
        ]);

        $tours = Tour::where('end_date', '>=', now()->toDateString())->get()->map(fn($t) => [
            'id' => $t->id, 'name' => "{$t->name} (" . Carbon::parse($t->start_date)->format('M j') . " - " . Carbon::parse($t->end_date)->format('M j') . ")"
        ]);

        return compact('employees', 'departments', 'tours');
    }

    private function resolveRecipients(array $recipients)
    {
        $userIds = collect($recipients)->filter('is_numeric')->map(fn($i) => (int)$i)->toArray();
        $departments = collect($recipients)->reject('is_numeric')->map(fn($i) => str_replace('dept_', '', $i))->toArray();

        if (!empty($departments)) {
            $deptUserIds = User::whereHas('employee', fn($q) => $q->whereIn('department_id', $departments))
                ->whereIn('status', ['active', 'probation'])->pluck('id')->toArray();
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