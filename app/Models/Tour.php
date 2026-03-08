<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Traits\LogsActivity;

class Tour extends Model {
    use SoftDeletes, LogsActivity;
    protected $fillable = ['name', 'location', 'start_date', 'end_date', 'status'];
    protected $casts = ['start_date' => 'date', 'end_date' => 'date'];
    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}