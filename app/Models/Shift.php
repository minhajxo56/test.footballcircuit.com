<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shift extends Model {
    use LogsActivity, SoftDeletes;
    protected $fillable = ['schedule_id', 'user_id', 'date', 'start_time', 'end_time', 'is_day_off'];
    protected $casts = ['date' => 'date', 'is_day_off' => 'boolean'];
    public function schedule(): BelongsTo {
        return $this->belongsTo(Schedule::class);
    }
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}