<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Traits\LogsActivity;

class Letter extends Model {
    use SoftDeletes, LogsActivity;

    protected $fillable = [
        'issued_by', 
        'type', 
        'subject', 
        'content', 
        'validity_type', 
        'validity_value'
    ];

    // The HR/Manager who wrote the letter
    public function issuer(): BelongsTo {
        return $this->belongsTo(User::class, 'issued_by');
    }

    // The employees receiving the letter
    public function recipients(): BelongsToMany {
        return $this->belongsToMany(User::class, 'letter_user')
                    ->withPivot('read_at')
                    ->withTimestamps();
    }
}