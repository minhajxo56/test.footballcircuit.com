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
        $user = $request->user();

        $letters = Letter::with(['issuer', 'recipients'])
            ->where('issued_by', $user->id)
            ->orWhereHas('recipients', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->latest()
            ->get();

        return Inertia::render('Letters/Index', [
            'letters' => $letters
        ]); 
    }

    public function create() 
    { 
        $employees = User::with('employee.department')
            ->whereIn('status', ['active', 'probation'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'dept' => optional(optional($user->employee)->department)->name ?? 'Staff',
                ];
            });

        $departments = Department::where('is_active', true)
            ->get()
            ->map(function ($dept) {
                return [
                    'id' => 'dept_' . $dept->id,
                    'name' => 'All ' . $dept->name . ' Department',
                ];
            });

        $tours = Tour::where('end_date', '>=', now()->toDateString())
            ->get()
            ->map(function ($tour) {
                $start = Carbon::parse($tour->start_date)->format('M j');
                $end = Carbon::parse($tour->end_date)->format('M j');
                
                return [
                    'id' => $tour->id,
                    'name' => $tour->name . ' (' . $start . ' - ' . $end . ')',
                ];
            });

        return Inertia::render('Letters/Compose', [
            'employees' => $employees,
            'departments' => $departments,
            'tours' => $tours,
        ]); 
    }

    public function store(Request $request) 
    { 
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
            $letter = Letter::create([
                'issued_by' => $request->user()->id,
                'type' => $validated['type'],
                'subject' => $validated['subject'],
                'content' => $validated['content'],
                'validity_type' => $validated['validity_type'],
                'validity_value' => $validated['validity_value'],
            ]);

            $userIds = collect($validated['recipients'])
                ->filter(fn($item) => is_numeric($item))
                ->map(fn($item) => (int) $item)
                ->toArray();

            $departments = collect($validated['recipients'])
                ->filter(fn($item) => !is_numeric($item))
                ->map(fn($item) => str_replace('dept_', '', $item))
                ->toArray();

            if (!empty($departments)) {
                $deptUserIds = User::whereHas('employee', function($query) use ($departments) {
                    $query->whereIn('department_id', $departments);
                })
                ->whereIn('status', ['active', 'probation'])
                ->pluck('id')
                ->toArray();
                
                $userIds = array_unique(array_merge($userIds, $deptUserIds));
            }

            if (!empty($userIds)) {
                $letter->recipients()->syncWithoutDetaching($userIds);
            }

            ActivityLog::create([
                'user_id' => Auth::id() ?? $request->user()->id,
                'action' => $validated['action_type'] === 'draft' ? 'letter_draft_created' : 'letter_created_and_sent',
                'model_type' => Letter::class,
                'model_id' => $letter->id,
                'old_data' => null,
                'new_data' => $letter->load('recipients')->toArray(),
                'ip_address' => $request->ip(),
            ]);

            return $letter;
        });

        return redirect()->route('letters.edit', $letter->id); 
    }

    public function edit($id)
    {
        $letter = Letter::with('recipients')->findOrFail($id);

        $employees = User::with('employee.department')
            ->whereIn('status', ['active', 'probation'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'dept' => optional(optional($user->employee)->department)->name ?? 'Staff',
                ];
            });

        $departments = Department::where('is_active', true)
            ->get()
            ->map(function ($dept) {
                return [
                    'id' => 'dept_' . $dept->id,
                    'name' => 'All ' . $dept->name . ' Department',
                ];
            });

        $tours = Tour::where('end_date', '>=', now()->toDateString())
            ->get()
            ->map(function ($tour) {
                $start = Carbon::parse($tour->start_date)->format('M j');
                $end = Carbon::parse($tour->end_date)->format('M j');
                
                return [
                    'id' => $tour->id,
                    'name' => $tour->name . ' (' . $start . ' - ' . $end . ')',
                ];
            });

        return Inertia::render('Letters/Compose', [
            'letter' => $letter,
            'employees' => $employees,
            'departments' => $departments,
            'tours' => $tours,
        ]);
    }

    public function update(Request $request, $id)
    {
        $letter = Letter::with('recipients')->findOrFail($id);

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

            $letter->update([
                'type' => $validated['type'],
                'subject' => $validated['subject'],
                'content' => $validated['content'],
                'validity_type' => $validated['validity_type'],
                'validity_value' => $validated['validity_value'],
            ]);

            $userIds = collect($validated['recipients'])
                ->filter(fn($item) => is_numeric($item))
                ->map(fn($item) => (int) $item)
                ->toArray();

            $departments = collect($validated['recipients'])
                ->filter(fn($item) => !is_numeric($item))
                ->map(fn($item) => str_replace('dept_', '', $item))
                ->toArray();

            if (!empty($departments)) {
                $deptUserIds = User::whereHas('employee', function($query) use ($departments) {
                    $query->whereIn('department_id', $departments);
                })
                ->whereIn('status', ['active', 'probation'])
                ->pluck('id')
                ->toArray();
                
                $userIds = array_unique(array_merge($userIds, $deptUserIds));
            }

            $letter->recipients()->sync($userIds);

            ActivityLog::create([
                'user_id' => Auth::id() ?? $request->user()->id,
                'action' => $validated['action_type'] === 'draft' ? 'letter_draft_updated' : 'letter_updated_and_sent',
                'model_type' => Letter::class,
                'model_id' => $letter->id,
                'old_data' => $oldData,
                'new_data' => $letter->fresh('recipients')->toArray(),
                'ip_address' => $request->ip(),
            ]);
        });

        return redirect()->back();
    }

    public function show($id) 
    { 
        $letter = Letter::with(['issuer', 'recipients'])->findOrFail($id);

        return Inertia::render('Letters/Show', [
            'letterId' => $id,
            'letterDetails' => $letter,
        ]);
    }

    public function acknowledge(Request $request, $id)
    {
        $letter = Letter::findOrFail($id);

        $letter->recipients()->updateExistingPivot($request->user()->id, [
            'read_at' => now(),
        ]);

        return back()->with('success', 'Letter acknowledged successfully.');
    }
}