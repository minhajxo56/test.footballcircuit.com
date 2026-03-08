<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Department;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Roles
        |--------------------------------------------------------------------------
        */

        $roles = [
            'Admin',
            'CEO',
            'HR',
            'Team_In_Charge',
            'Employee',
            'Intern'
        ];

        $roleMap = [];

        foreach ($roles as $role) {
            $roleMap[$role] = Role::firstOrCreate([
                'name' => $role
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Departments
        |--------------------------------------------------------------------------
        */

        $departments = [
            'News',
            'Video',
            'Design',
            'Development',
            'HR & Admin',
            'Camera',
            'Reporting',
            'Office Management',
            'Marketing'
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate([
                'name' => $dept
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Admin User
        |--------------------------------------------------------------------------
        */

        $user = User::firstOrCreate(
            ['email' => 'admin@cricfrenzy.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
                'role_id' => $roleMap['Admin']->id,
                'status' => 'active'
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Admin Employee Profile
        |--------------------------------------------------------------------------
        */

        Employee::firstOrCreate(
            ['user_id' => $user->id],
            [
                'first_name' => 'System',
                'last_name' => 'Admin',
                'department_id' => null,
                'employee_code' => 'EMP-0001',
                'joining_date' => now()->format('Y-m-d')
            ]
        );
    }
}