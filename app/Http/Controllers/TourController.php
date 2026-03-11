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
        $this->authorize('viewAny', Tour::class);
        return Inertia::render('Tours/Index', [
            'tours' => Tour::withCount('users')->latest()->paginate(10)
        ]);
    }

    public function create()
    {
        $this->authorize('create', Tour::class);
        return Inertia::render('Tours/Form', [
            'availableEmployees' => $this->getAvailableEmployees()
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Tour::class);

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
            $tour = Tour::create([
                'name' => $validated['name'],
                'location' => $validated['location'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => $validated['action_type'] === 'draft' ? 'planned' : 'active',
            ]);

            if (!empty($validated['assigned_users'])) {
                $tour->users()->attach($validated['assigned_users']);
            }

            $this->logActivity(
                $validated['action_type'] === 'draft' ? 'tour_draft_created' : 'tour_activated',
                $tour,
                $request->ip()
            );

            return $tour;
        });

        return redirect()->route('tours.edit', $tour->id);
    }

    public function show(Tour $tour)
    {
        $this->authorize('view', $tour);
        $tour->load('users.employee.department');
        return Inertia::render('Tours/Show', ['tour' => $tour]);
    }

    public function edit(Tour $tour)
    {
        $this->authorize('update', $tour);
        $tour->load('users');

        return Inertia::render('Tours/Form', [
            'tour' => $tour,
            'availableEmployees' => $this->getAvailableEmployees()
        ]);
    }

    public function update(Request $request, Tour $tour)
    {
        $this->authorize('update', $tour);
        
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
            
            $status = $validated['status'];
            if (!in_array($status, ['completed', 'cancelled'])) {
                $status = $validated['action_type'] === 'draft' 
                    ? ($tour->status === 'active' ? 'active' : 'planned') 
                    : 'active';
            }

            $tour->update([
                'name' => $validated['name'],
                'location' => $validated['location'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => $status,
            ]);

            $tour->users()->sync($validated['assigned_users'] ?? []);

            $this->logActivity(
                $validated['action_type'] === 'draft' ? 'tour_draft_updated' : 'tour_activated',
                $tour,
                $request->ip(),
                $oldData
            );
        });

        return redirect()->back();
    }

    private function getAvailableEmployees()
    {
        return User::where('status', 'active')
            ->with(['employee.department', 'role'])
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->employee ? "{$user->employee->first_name} {$user->employee->last_name}" : $user->name,
                'dept' => $user->employee?->department?->name ?? 'Unassigned',
                'role' => $user->role?->name ?? 'Unassigned',
            ]);
    }

    private function logActivity(string $action, Tour $tour, string $ip, ?array $oldData = null)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model_type' => Tour::class,
            'model_id' => $tour->id,
            'old_data' => $oldData,
            'new_data' => $tour->fresh('users')->toArray(),
            'ip_address' => $ip,
        ]);
    }
}