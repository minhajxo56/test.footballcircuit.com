<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivity;

class Schedule extends Model {
    use SoftDeletes, LogsActivity;
    protected $fillable = ['department_id', 'creator_id', 'start_date', 'end_date', 'status'];
    protected $casts = ['start_date' => 'date', 'end_date' => 'date'];
    public function department(): BelongsTo {
        return $this->belongsTo(Department::class);
    }
    public function creator(): BelongsTo {
        return $this->belongsTo(User::class, 'creator_id');
    }
    public function shifts(): HasMany {
        return $this->hasMany(Shift::class);
    }
}