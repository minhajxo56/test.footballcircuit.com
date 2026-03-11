<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Application;

class ApplicationPolicy
{
    // Team In-Charge can only update applications from their own department
    public function update(User $user, Application $application): bool
    {
        if ($user->role->name === 'Team_In_Charge') {
            // Assuming users are linked to departments
            return $user->department_id === $application->user->department_id; 
        }

        return in_array($user->role->name, ['CEO', 'HR']);
    }
}