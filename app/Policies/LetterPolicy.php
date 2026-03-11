<?php

namespace App\Policies;

use App\Models\Letter;
use App\Models\User;

class LetterPolicy
{
    /**
     * Determine whether the user can view any models (the Inbox).
     */
    public function viewAny(User $user): bool
    {
        // Allowed roles are already enforced by RoleMiddleware.
        // Returning true here allows Employees into the controller, 
        // where the controller will filter the letters they see.
        return true;
    }

    /**
     * Determine whether the user can view the specific letter.
     */
    public function view(User $user, Letter $letter): bool
    {
        $role = strtolower(str_replace([' ', '-'], '_', optional($user->role)->name));

        // The user can always view it if they issued it (even if it's a draft)
        if ($letter->issued_by === $user->id) {
            return true;
        }

        // Upper management and HR can see it, as long as it isn't someone else's draft
        if (in_array($role, ['admin', 'hr', 'ceo'])) {
            return $letter->status !== 'draft';
        }

        // The user can view it if they are a recipient AND it has been issued
        return $letter->status === 'issued' && 
               $letter->recipients()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // RoleMiddleware restricts interns. Employees and above can compose.
        return true;
    }

    /**
     * Determine whether the user can update the specific letter.
     */
    public function update(User $user, Letter $letter): bool
    {
        // Only the person who created the letter can edit it
        return $user->id === $letter->issued_by;
    }

    /**
     * Determine whether the user can delete the specific letter.
     */
    public function delete(User $user, Letter $letter): bool
    {
        $role = strtolower(str_replace([' ', '-'], '_', optional($user->role)->name));

        if ($role === 'admin') {
            return true;
        }

        return $user->id === $letter->issued_by;
    }

    /**
     * Determine whether the user can acknowledge the specific letter.
     */
    public function acknowledge(User $user, Letter $letter): bool
    {
        // User can only acknowledge if they are an assigned recipient
        return $letter->recipients()->where('user_id', $user->id)->exists();
    }
}