<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the departments.
     */
    public function index()
    {
        $this->authorize('viewAny', Department::class);

        // Load departments with their assigned Team In Charge managers
        $departments = Department::with(['managers' => function ($query) {
            $query->select('users.id', 'name', 'email'); // Adjust based on your User model fields
        }])->orderBy('name')->get();

        return Inertia::render('Department/Index', [
            'departments' => $departments,
        ]);
    }

    /**
     * Show the form for creating a new department.
     */
    public function create()
    {
        $this->authorize('create', Department::class);

        return Inertia::render('Department/Form');
    }

    /**
     * Store a newly created department in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Department::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
            // Accepting an array for the SET column ('office', 'field')
            'type' => 'required|array|min:1', 
            'type.*' => 'in:office,field',
            'is_active' => 'boolean',
        ]);

        // Convert the array back to a comma-separated string for the database SET column
        $validated['type'] = implode(',', $validated['type']);
        $validated['is_active'] = $validated['is_active'] ?? true;

        Department::create($validated);

        return redirect()->route('departments.index')->with('success', 'Department created successfully.');
    }

    /**
     * Show the form for editing the specified department.
     */
    public function edit(Department $department)
    {
        $this->authorize('update', $department);

        // Format the SET column back into an array for the frontend form
        $department->type_array = explode(',', $department->type);

        return Inertia::render('Department/Form', [
            'department' => $department,
        ]);
    }

    /**
     * Update the specified department in storage.
     */
    public function update(Request $request, Department $department)
    {
        $this->authorize('update', $department);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $department->id,
            'type' => 'required|array|min:1',
            'type.*' => 'in:office,field',
            'is_active' => 'boolean',
        ]);

        $validated['type'] = implode(',', $validated['type']);

        $department->update($validated);

        return redirect()->route('departments.index')->with('success', 'Department updated successfully.');
    }

    /**
     * Remove the specified department from storage.
     */
    public function destroy(Department $department)
    {
        $this->authorize('delete', $department);

        $department->delete();

        return redirect()->route('departments.index')->with('success', 'Department deleted successfully.');
    }

    /**
     * Show the form to assign managers to a specific department.
     */
    public function assignManagers(Department $department)
    {
        $this->authorize('assignManagers', $department);

        // Fetch users who are eligible to be Team In Charge
        // Adjust the role query based on exactly how your roles are set up
        $eligibleUsers = User::whereHas('role', function ($query) {
            $query->whereIn('name', ['Team_In_Charge', 'Admin', 'Super_Admin']);
        })->get(['id', 'name', 'email']);

        // Get currently assigned manager IDs
        $currentManagerIds = $department->managers()->pluck('users.id')->toArray();

        return Inertia::render('Department/AssignTeamInCharge', [
            'department' => $department,
            'eligibleUsers' => $eligibleUsers,
            'currentManagerIds' => $currentManagerIds,
        ]);
    }

    /**
     * Sync the managers for the specified department.
     */
    public function syncManagers(Request $request, Department $department)
    {
        $this->authorize('assignManagers', $department);

        $validated = $request->validate([
            'manager_ids' => 'present|array',
            'manager_ids.*' => 'exists:users,id',
        ]);

        // The sync method smartly handles attaching new IDs and detaching removed ones
        $department->managers()->sync($validated['manager_ids']);

        return redirect()->route('departments.index')->with('success', 'Team In Charge assignments updated successfully.');
    }
}