<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    // CEO and HR can view and create users
    public function viewAny(User $user): bool {
        return in_array($user->role->name, ['CEO', 'HR']);
    }

    public function create(User $user): bool {
        return in_array($user->role->name, ['CEO', 'HR']);
    }

    // Protect specific roles from being updated by lower tiers
    public function update(User $user, User $model): bool
    {
        if ($user->role->name === 'CEO' && $model->role->name === 'Admin') {
            return false; // CEO cannot edit Admin
        }

        if ($user->role->name === 'HR' && in_array($model->role->name, ['Admin', 'CEO', 'HR'])) {
            return false; // HR cannot edit Admin, CEO, or other HR
        }

        return true;
    }

    public function delete(User $user, User $model): bool
    {
        return $this->update($user, $model); // Same rules apply for deletion
    }
}