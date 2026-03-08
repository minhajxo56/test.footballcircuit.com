<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TourController extends Controller 
{
    public function index() 
    { 
        $tours = Tour::withCount('users')->latest()->paginate(10);
        return Inertia::render('Tours/Index', ['tours' => $tours]); 
    }

    public function create() 
    { 
        $users = User::where('status', 'active')
            ->with(['employee.department', 'role'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->employee ? $user->employee->first_name . ' ' . $user->employee->last_name : $user->name,
                    'dept' => $user->employee?->department?->name ?? 'Unassigned',
                    'role' => $user->role?->name ?? 'Unassigned',
                ];
            });

        return Inertia::render('Tours/Form', [
            'availableEmployees' => $users
        ]); 
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:planned,active,completed,cancelled',
            'assigned_users' => 'nullable|array',
            'assigned_users.*' => 'exists:users,id',
            'action_type' => 'required|in:draft,send',
        ]);

        $tour = DB::transaction(function () use ($validated, $request) {
            $determinedStatus = $validated['action_type'] === 'draft' ? 'planned' : 'active';

            $tour = Tour::create([
                'name' => $validated['name'],
                'location' => $validated['location'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => $determinedStatus,
            ]);

            if (!empty($validated['assigned_users'])) {
                $tour->users()->attach($validated['assigned_users']);
            }

            ActivityLog::create([
                'user_id' => Auth::id() ?? $request->user()->id,
                'action' => $validated['action_type'] === 'draft' ? 'tour_draft_created' : 'tour_activated',
                'model_type' => Tour::class,
                'model_id' => $tour->id,
                'old_data' => null,
                'new_data' => $tour->load('users')->toArray(),
                'ip_address' => $request->ip(),
            ]);

            return $tour;
        });

        return redirect()->route('tours.edit', $tour->id);
    }

    public function show($id) 
    { 
        $tour = Tour::with('users.employee.department')->findOrFail($id);
        return Inertia::render('Tours/Show', ['tour' => $tour]); 
    }

    public function edit($id) 
    { 
        $tour = Tour::with('users')->findOrFail($id);
        
        $users = User::where('status', 'active')
            ->with(['employee.department', 'role'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->employee ? $user->employee->first_name . ' ' . $user->employee->last_name : $user->name,
                    'dept' => $user->employee?->department?->name ?? 'Unassigned',
                    'role' => $user->role?->name ?? 'Unassigned',
                ];
            });

        return Inertia::render('Tours/Form', [
            'tour' => $tour,
            'availableEmployees' => $users
        ]); 
    }

    public function update(Request $request, $id)
    {
        $tour = Tour::with('users')->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:planned,active,completed,cancelled',
            'assigned_users' => 'nullable|array',
            'assigned_users.*' => 'exists:users,id',
            'action_type' => 'required|in:draft,send',
        ]);

        DB::transaction(function () use ($validated, $tour, $request) {
            $oldData = $tour->toArray();
            
            $determinedStatus = $validated['action_type'] === 'draft' 
                ? ($tour->status === 'active' ? 'active' : 'planned') 
                : 'active';

            if ($validated['status'] === 'completed' || $validated['status'] === 'cancelled') {
                $determinedStatus = $validated['status'];
            }

            $tour->update([
                'name' => $validated['name'],
                'location' => $validated['location'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => $determinedStatus,
            ]);

            $tour->users()->sync($validated['assigned_users'] ?? []);

            ActivityLog::create([
                'user_id' => Auth::id() ?? $request->user()->id,
                'action' => $validated['action_type'] === 'draft' ? 'tour_draft_updated' : 'tour_activated',
                'model_type' => Tour::class,
                'model_id' => $tour->id,
                'old_data' => $oldData,
                'new_data' => $tour->fresh('users')->toArray(),
                'ip_address' => $request->ip(),
            ]);
        });

        return redirect()->back();
    }
}