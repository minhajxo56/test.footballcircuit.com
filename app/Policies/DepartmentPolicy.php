<?php

namespace App\Policies;

use App\Models\Department;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DepartmentPolicy
{
    /**
     * Determine if the user can view the list of departments.
     */
    public function viewAny(User $user): bool
    {
        // Only Admin or HR should see the department management list
        return in_array($user->role->name, ['Super_Admin', 'Admin', 'HR']);
    }

    /**
     * Determine if the user can create models.
     */
    public function create(User $user): bool
    {
        return in_array($user->role->name, ['Super_Admin', 'Admin', 'HR']);
    }

    /**
     * Determine if the user can update the model.
     */
    public function update(User $user, Department $department): bool
    {
        return in_array($user->role->name, ['Super_Admin', 'Admin', 'HR']);
    }

    /**
     * Determine if the user can delete the model.
     */
    public function delete(User $user, Department $department): bool
    {
        return in_array($user->role->name, ['Super_Admin', 'Admin']);
    }

    /**
     * Determine if the user can assign Team_In_Charge to the department.
     */
    public function assignManagers(User $user, Department $department): bool
    {
        // Only high-level roles can designate who the Team In Charge is
        return in_array($user->role->name, ['Super_Admin', 'Admin', 'HR']);
    }
}