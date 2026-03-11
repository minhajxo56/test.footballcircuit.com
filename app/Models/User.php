<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, LogsActivity;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'status',
        'must_change_password', 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'must_change_password' => 'boolean',
        ];
    }

    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class);
    }
    
    // Optional: If you have a Role model
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    // Add this relationship
    public function managedDepartments()
    {
        return $this->belongsToMany(Department::class, 'department_manager')
                    ->withTimestamps();
    }
}