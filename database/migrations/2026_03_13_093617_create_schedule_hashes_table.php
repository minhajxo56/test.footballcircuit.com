<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('schedule_hashes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('week_start');
            $table->string('hash');
            $table->timestamps();
            
            // A user can only have one hash per week
            $table->unique(['user_id', 'week_start']); 
        });
    }

    public function down(): void {
        Schema::dropIfExists('schedule_hashes');
    }
};