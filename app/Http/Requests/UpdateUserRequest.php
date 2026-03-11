<?php

namespace App\Http\Requests;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Return true as the UserPolicy handles the "can edit this specific user" logic.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $currentUserRoleName = $this->user()->role->name;
        
        // Retrieve the user ID being updated from the route
        // Assuming your route is defined as /users/{user}
        $userBeingUpdatedId = $this->route('user')->id ?? $this->route('user'); 

        $allowedRolesQuery = Role::query();

        if ($currentUserRoleName === 'CEO') {
            $allowedRolesQuery->where('name', '!=', 'Admin');
        } elseif ($currentUserRoleName === 'HR') {
            $allowedRolesQuery->whereNotIn('name', ['Admin', 'CEO', 'HR']);
        }

        $allowedRoleIds = $allowedRolesQuery->pluck('id')->toArray();

        return [
            'name'          => ['required', 'string', 'max:255'],
            // Ignore the current user's email address for the unique check
            'email'         => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($userBeingUpdatedId)],
            // Password is optional during an update
            'password'      => ['nullable', 'string', 'min:8', 'confirmed'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'role_id'       => ['required', Rule::in($allowedRoleIds)],
        ];
    }

    public function messages(): array
    {
        return [
            'role_id.in' => 'You do not have permission to assign this role.',
        ];
    }
}