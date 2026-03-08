<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('user_applications', function (Blueprint $table) {
            $table->id();            
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('type')->index();
            $table->string('title');
            $table->text('details');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('attachment_path')->nullable();
            $table->string('status')->default('pending')->index();
            $table->foreignId('escalated_to_role')->nullable()->constrained('roles')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('user_applications');
    }
};