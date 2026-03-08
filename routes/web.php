<?php

use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserApplicationController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\SystemSettingsController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\LetterController;

use App\Http\Middleware\EnsurePasswordIsChanged;
use App\Http\Controllers\Auth\ForcePasswordChangeController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth'])->group(function () {
    
    // Password Update Routes (Must be accessible while must_change_password is true)
    Route::get('/force-password-change', [ForcePasswordChangeController::class, 'create'])->name('password.force-change');
    Route::post('/force-password-change', [ForcePasswordChangeController::class, 'store'])->name('password.force-update');

    // ALL OTHER ROUTES locked behind EnsurePasswordIsChanged
    Route::middleware([EnsurePasswordIsChanged::class])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // Employee Self-Service
        
        // HR / Admin Modules
        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
        Route::resource('users', UserController::class);
        Route::resource('holidays', HolidayController::class);
        Route::get('/settings', [SystemSettingsController::class, 'index'])->name('settings.index');
        
        // Operational / Manager Modules
        // Employee Self-Service
        // Note: I mapped this to myApplications to avoid conflicting with the resource 'show' method
        Route::get('/my-applications', [UserApplicationController::class, 'myApplications'])->name('my-applications'); 

        // Operational / Manager Modules
        // Standard resource handles index, create, store, show, edit, update, destroy
        Route::resource('applications', UserApplicationController::class);
        
        Route::post('/applications/{application}/escalate', [UserApplicationController::class, 'escalate'])->name('applications.escalate');
        Route::post('/applications/{application}/resolve', [UserApplicationController::class, 'resolve'])->name('applications.resolve');
        Route::get('/my-schedule', [ScheduleController::class, 'mySchedule'])->name('schedule.my-schedule');
        
        // Explicitly define the publish route BEFORE the resource route
        Route::post('/schedules/publish', [ScheduleController::class, 'store'])->name('schedules.publish');
        
        // Schedules standard resource
        Route::resource('schedules', ScheduleController::class);
        
        Route::resource('tours', TourController::class);
        Route::get('/letters/compose', [LetterController::class, 'create'])->name('letters.compose');
        Route::resource('letters', LetterController::class);
        Route::post('/letters/{id}/acknowledge', [LetterController::class, 'acknowledge'])->name('letters.acknowledge');
    });
});

require __DIR__.'/settings.php';

