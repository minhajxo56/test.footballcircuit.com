<?php

namespace App\Http\Requests;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        $userRoleName = $this->user()->role->name;
        $allowedRolesQuery = Role::query();

        // Admin is completely unassignable
        $allowedRolesQuery->where('name', '!=', 'Admin');

        if ($userRoleName === 'CEO') {
            $allowedRolesQuery->whereNotIn('name', ['CEO']);
        } elseif ($userRoleName === 'HR') {
            $allowedRolesQuery->whereNotIn('name', ['CEO', 'HR']);
        }

        $allowedRoleIds = $allowedRolesQuery->pluck('id')->toArray();

        return [
            'first_name'    => ['required', 'string', 'max:255'],
            'last_name'     => ['required', 'string', 'max:255'],
            'email'         => 'required|email|unique:users,email,' . $this->route('user')->id,
            'phone'         => ['nullable', 'string', 'max:20'],
            'department_id' => ['required', 'exists:departments,id'],
            'role_id'       => ['required', Rule::in($allowedRoleIds)],
            'status'        => ['required', 'in:active,probation,inactive'],
            'joining_date'  => ['required', 'date'],
            'action_type'   => ['required', 'in:draft,send'],
        ];
    }

    public function messages(): array
    {
        return [
            'role_id.in' => 'You do not have permission to assign this system role.',
        ];
    }
}