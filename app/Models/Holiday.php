<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
class Holiday extends Model {
    protected $fillable = ['name', 'date'];
    protected $casts = ['date' => 'date'];
    public function excludedUsers(): BelongsToMany {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}