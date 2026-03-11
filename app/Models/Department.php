<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class Department extends Model {
    use SoftDeletes, LogsActivity;
    protected $fillable = ['name', 'manager_id', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
    public function employees(): HasMany {
        return $this->hasMany(Employee::class);
    }
    // Add this relationship
    public function managers()
    {
        return $this->belongsToMany(User::class, 'department_manager')
                    ->withTimestamps();
    }
    public function schedules(): HasMany {
        return $this->hasMany(Schedule::class);
    }
}