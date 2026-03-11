<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('letters', function (Blueprint $table) {
            $table->id();
            // status enume
            $table->enum('status', ['draft', 'issued', 'cancelled', 'archived'])
                  ->default('draft')
                  ->index();

            $table->foreignId('issued_by')->constrained('users')->cascadeOnDelete();
            $table->string('type')->index(); // Responsibility, Appointment, Warning, General
            $table->string('subject');
            $table->text('content');
            $table->string('validity_type')->default('ongoing'); // ongoing, tomorrow, custom, tour
            $table->string('validity_value')->nullable(); // holds a specific date or tour_id
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('letters');
    }
};