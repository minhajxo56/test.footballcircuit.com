<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserApplication; // <-- Fixed model import to match Controller

class UserApplicationPolicy
{
    /**
     * Determine whether the user can view the index of applications.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role->name, ['Employee', 'Team_In_Charge', 'HR', 'CEO', 'Admin']);
    }

    /**
     * Determine whether the user can create an application.
     */
    public function create(User $user): bool
    {
        // Everyone except Interns can create applications
        return $user->role->name !== 'Intern';
    }

    /**
     * Determine whether the user can view a specific application.
     */
    /**
     * Determine whether the user can view a specific application.
     */
    public function view(User $user, UserApplication $application): bool
    {
        if ($user->id === $application->user_id) {
            return true;
        }

        if ($user->role->name === 'Team_In_Charge') {
            // Look up the department via the employee relationship!
            return $user->employee->department_id === $application->user->employee->department_id;
        }

        return in_array($user->role->name, ['CEO', 'HR', 'Admin']);
    }

    /**
     * Determine whether the user can update the application.
     */
    public function update(User $user, UserApplication $application): bool
    {
        if ($user->id === $application->user_id) {
            return true;
        }

        if ($user->role->name === 'Team_In_Charge') {
            // Look up the department via the employee relationship!
            $isSameDepartment = $user->employee->department_id === $application->user->employee->department_id;
            $isNotOwnApplication = $user->id !== $application->user_id;
            
            return $isSameDepartment && $isNotOwnApplication; 
        }

        return in_array($user->role->name, ['CEO', 'HR', 'Admin']);
    }

    /**
     * Determine whether the user can delete an application.
     */
    public function delete(User $user, UserApplication $application): bool
    {
        // Usually, only the creator can delete/cancel their own application
        return $user->id === $application->user_id;
    }

    /**
     * Custom actions requested by your Controller
     */
    public function resolve(User $user, UserApplication $application): bool
    {
        // Reuse the update logic for resolutions (must be manager/HR/CEO/Admin)
        // Ensure the user isn't approving their own application!
        if ($user->id === $application->user_id) {
            return false;
        }
        return $this->update($user, $application);
    }

    public function escalate(User $user, UserApplication $application): bool
    {
        if ($user->id === $application->user_id) {
            return false;
        }
        return $this->update($user, $application);
    }
}