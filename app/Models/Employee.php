<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class Employee extends Model {
    use SoftDeletes, LogsActivity;
    protected $fillable = ['user_id', 'first_name', 'last_name', 'phone', 'employee_code', 'department_id', 'joining_date'];
    protected $casts = ['joining_date' => 'date'];
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
    public function department(): BelongsTo {
        return $this->belongsTo(Department::class);
    }
}