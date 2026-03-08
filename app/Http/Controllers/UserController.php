<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Employee;
use App\Models\Role; 
use App\Models\Department; 
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller 
{
    public function index() 
    {
        // Fetch users with their related employee and role data
        $users = User::with(['employee.department', 'role'])->orderBy('id', 'desc')->paginate(10);
        return Inertia::render('Users/Index', ['users' => $users]); 
    }

    public function create() 
    { 
        return Inertia::render('Users/Form', [
            'roles' => Role::select('id', 'name')->get(),
            'departments' => Department::select('id', 'name')->get(),
        ]); 
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id' => 'required|exists:roles,id',
            'department_id' => 'required|exists:departments,id',
            'status' => 'required|in:active,probation,inactive',
            'joining_date' => 'required|date',
            'action_type' => 'required|in:draft,send', // Added from stepper
        ]);

        $user = DB::transaction(function () use ($validated, $request) {
            // 1. Create the User
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role_id' => $validated['role_id'],
                'status' => $validated['status'],
                'must_change_password' => true, 
            ]);

            // 2. Create the linked Employee record
            $employee = Employee::create([
                'user_id' => $user->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'] ?? null,
                'department_id' => $validated['department_id'],
                'joining_date' => $validated['joining_date'],
            ]);

            $employee->employee_code = $this->generateEmployeeCode(
                $employee->department_id,
                $employee->id
            );
            $employee->save();

            // 3. Record Activity Log
            ActivityLog::create([
                'user_id' => Auth::id() ?? $user->id, // Fallback if admin isn't fully authenticated in dev
                'action' => $validated['action_type'] === 'draft' ? 'employee_draft_created' : 'employee_created_and_sent',
                'model_type' => User::class,
                'model_id' => $user->id,
                'old_data' => null,
                'new_data' => $user->load('employee')->toArray(),
                'ip_address' => $request->ip(),
            ]);

            // 4. Dispatch Logic for 'Send'
            if ($validated['action_type'] === 'send') {
                // TODO: Dispatch Welcome/Activation Email Notification here.
                // e.g., Mail::to($user->email)->send(new EmployeeWelcomeMail($user));
            }

            return $user;
        });

        // CRITICAL: Redirect to edit route so the SPA seamlessly enters "Edit Mode"
        // without kicking the user back to the index page. Inertia's `preserveState`
        // on the frontend will catch this and advance the stepper perfectly.
        return redirect()->route('users.edit', $user->id);
    }

    private function generateEmployeeCode($departmentId, $id): string
    {
        $map = [
            1 => 'NEWS',
            2 => 'VID',
            3 => 'GFX',
            4 => 'REP',
            5 => 'CAM',
            6 => 'OFF',
            7 => 'HR',
        ];

        $prefix = $map[$departmentId] ?? 'EMP';

        return $prefix . '-' . str_pad($id, 3, '0', STR_PAD_LEFT);
    }

    public function edit($id) 
    { 
        $user = User::with('employee')->findOrFail($id);

        $userData = [
            'id' => $user->id,
            'email' => $user->email,
            'role_id' => $user->role_id,
            'status' => $user->status,
            'first_name' => $user->employee?->first_name ?? '',
            'last_name' => $user->employee?->last_name ?? '',
            'phone' => $user->employee?->phone ?? '',
            'department_id' => $user->employee?->department_id ?? '',
            'joining_date' => $user->employee?->joining_date ? $user->employee->joining_date->format('Y-m-d') : '',
        ];

        return Inertia::render('Users/Form', [
            'user' => $userData,
            'roles' => Role::select('id', 'name')->get(),
            'departments' => Department::select('id', 'name')->get(),
        ]); 
    }

    public function update(Request $request, $id)
    {
        $user = User::with('employee')->findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'phone' => 'nullable|string|max:20',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role_id' => 'required|exists:roles,id',
            'department_id' => 'required|exists:departments,id',
            'status' => 'required|in:active,probation,inactive',
            'joining_date' => 'required|date',
            'action_type' => 'required|in:draft,send', // Added from stepper
        ]);

        DB::transaction(function () use ($validated, $user, $request) {
            $oldData = $user->toArray();

            // 1. Update User
            $userData = [
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'role_id' => $validated['role_id'],
                'status' => $validated['status'],
            ];

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $user->update($userData);

            // 2. Update Employee
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

            // 3. Record Activity Log
            ActivityLog::create([
                'user_id' => Auth::id() ?? $user->id,
                'action' => $validated['action_type'] === 'draft' ? 'employee_draft_updated' : 'employee_updated_and_sent',
                'model_type' => User::class,
                'model_id' => $user->id,
                'old_data' => $oldData,
                'new_data' => $user->fresh('employee')->toArray(),
                'ip_address' => $request->ip(),
            ]);

            // 4. Dispatch Logic for 'Send'
            if ($validated['action_type'] === 'send') {
                // TODO: Dispatch Welcome/Activation Email Notification here.
            }
        });

        // Simply return back. The frontend state will advance the Step to 2 or 3 appropriately.
        return redirect()->back();
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        $oldData = $user->load('employee')->toArray();
        $user->delete();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'employee_deleted',
            'model_type' => User::class,
            'model_id' => $id, // ID is safe to store even after deletion
            'old_data' => $oldData,
            'new_data' => null,
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Employee removed successfully.');
    }
}