<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class UserApplication extends Model {
    use SoftDeletes, LogsActivity;
    protected $fillable = ['user_id', 'type', 'title', 'details', 'start_date', 'end_date', 'attachment_path', 'status', 'escalated_to_role', 'approved_by'];
    protected $casts = ['start_date' => 'date', 'end_date' => 'date'];
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
    public function escalatedRole(): BelongsTo {
        return $this->belongsTo(Role::class, 'escalated_to_role');
    }
    public function approver(): BelongsTo {
        return $this->belongsTo(User::class, 'approved_by');
    }
}