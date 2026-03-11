<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Employee;
use App\Models\Role;
use App\Models\Department;
use App\Models\ActivityLog;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Notifications\NewUserCredentials;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);
        
        $users = User::with(['employee.department', 'role'])->orderBy('id', 'desc')->paginate(10);
        
        return Inertia::render('Users/Index', ['users' => $users]);
    }

    private function getAssignableRoles()
    {
        $currentUserRole = auth()->user()->role->name;
        
        // No one can ever assign an Admin role
        $query = Role::where('name', '!=', 'Admin');

        if ($currentUserRole === 'CEO') {
            // CEO cannot assign CEO
            $query->whereNotIn('name', ['CEO']);
        } elseif ($currentUserRole === 'HR') {
            // HR cannot assign CEO or HR
            $query->whereNotIn('name', ['CEO', 'HR']);
        }

        return $query->select('id', 'name')->get();
    }

    public function create()
    {
        $this->authorize('create', User::class);
        
        return Inertia::render('Users/Form', [
            'roles' => $this->getAssignableRoles(),
            'departments' => Department::select('id', 'name')->get(),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $this->authorize('create', User::class);
        
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated, $request) {
            
            // Generate a secure one-time password
            $generatedPassword = Str::password(16, true, true, false, false);

            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'password' => Hash::make($generatedPassword),
                'role_id' => $validated['role_id'],
                'status' => $validated['status'],
                'must_change_password' => true,
            ]);

            $employee = Employee::create([
                'user_id' => $user->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'] ?? null,
                'department_id' => $validated['department_id'],
                'joining_date' => $validated['joining_date'],
            ]);

            $employee->update([
                'employee_code' => $this->generateEmployeeCode($employee->department_id, $employee->id)
            ]);

            ActivityLog::create([
                'user_id' => Auth::id() ?? $user->id,
                'action' => $validated['action_type'] === 'draft' ? 'employee_draft_created' : 'employee_created_and_sent',
                'model_type' => User::class,
                'model_id' => $user->id,
                'old_data' => null,
                'new_data' => $user->load('employee')->toArray(),
                'ip_address' => $request->ip(),
            ]);

            if ($validated['action_type'] === 'send') {
                $user->notify(new NewUserCredentials($generatedPassword));
            }
            
            return $user;
        });

        return redirect()->route('users.edit', $user->id);
    }

    private function generateEmployeeCode($departmentId, $id): string
    {
        $map = [1 => 'NEWS', 2 => 'VID', 3 => 'GFX', 4 => 'REP', 5 => 'CAM', 6 => 'OFF', 7 => 'HR'];
        return ($map[$departmentId] ?? 'EMP') . '-' . str_pad($id, 3, '0', STR_PAD_LEFT);
    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);
        
        $user->load('employee');

        return Inertia::render('Users/Form', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'status' => $user->status,
                'first_name' => $user->employee?->first_name ?? '',
                'last_name' => $user->employee?->last_name ?? '',
                'phone' => $user->employee?->phone ?? '',
                'department_id' => $user->employee?->department_id ?? '',
                'joining_date' => $user->employee?->joining_date ? $user->employee->joining_date->format('Y-m-d') : '',
            ],
            'roles' => $this->getAssignableRoles(),
            'departments' => Department::select('id', 'name')->get(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('update', $user);
        
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $user, $request) {
            $oldData = $user->load('employee')->toArray();

            $userData = [
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'role_id' => $validated['role_id'],
                'status' => $validated['status'],
            ];

            $user->update($userData);

            $user->employee()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'phone' => $validated['phone'] ?? null,
                    'department_id' => $validated['department_id'],
                    'joining_date' => $validated['joining_date'],
                ]
            );

            if ($request->input('action_type') === 'send') {
                $user->notify(new NewUserCredentials($generatedPassword));
            }

            ActivityLog::create([
                'user_id' => Auth::id(),                
                'action' => $request->input('action_type') === 'draft' ? 'employee_draft_updated' : 'employee_updated_and_sent',
                'model_type' => User::class,
                'model_id' => $user->id,
                'old_data' => $oldData,
                'new_data' => $user->fresh('employee')->toArray(),
                'ip_address' => $request->ip(),
            ]);
        });

        return redirect()->back();
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        
        $oldData = $user->load('employee')->toArray();
        $user->delete();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'employee_deleted',
            'model_type' => User::class,
            'model_id' => $user->id,
            'old_data' => $oldData,
            'new_data' => null,
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Employee removed successfully.');
    }
}