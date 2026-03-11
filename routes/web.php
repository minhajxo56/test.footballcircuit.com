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
use App\Http\Controllers\DepartmentController;

use App\Http\Middleware\EnsurePasswordIsChanged;
use App\Http\Controllers\Auth\ForcePasswordChangeController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth'])->group(function () {
    
    // Password Update Routes (Must be accessible while must_change_password is true)
    Route::get('/force-password-change', [ForcePasswordChangeController::class, 'create'])->name('password.force-change');
    Route::post('/force-password-change', [ForcePasswordChangeController::class, 'store'])->name('password.force-update');

    // All routes locked behind EnsurePasswordIsChanged
    Route::middleware([EnsurePasswordIsChanged::class])->group(function () {
        
        // =========================================================
        // 1. ALL USERS (Including Interns)
        // =========================================================
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/my-schedule', [ScheduleController::class, 'mySchedule'])->name('schedule.my-schedule');

        // =========================================================
        // 2. EMPLOYEES & ABOVE (Interns blocked)
        // =========================================================
        Route::middleware('role:employee,team_in_charge,hr,ceo,admin')->group(function () {
            Route::get('/my-applications', [UserApplicationController::class, 'myApplications'])->name('my-applications');
            
            // Standard resources (Policies handle which methods they can actually use)
            Route::resource('applications', UserApplicationController::class);
            
            Route::get('/letters/compose', [LetterController::class, 'create'])->name('letters.compose');
            Route::post('/letters/{letter}/acknowledge', [LetterController::class, 'acknowledge'])->name('letters.acknowledge');
            Route::resource('letters', LetterController::class);
            Route::patch('/letters/{letter}/cancel', [LetterController::class, 'cancel'])->name('letters.cancel');
        });

        // =========================================================
        // 3. MANAGEMENT (Team In-Charge & Above)
        // =========================================================
        Route::middleware('role:team_in_charge,hr,ceo,admin')->group(function () {
            Route::post('/applications/{application}/escalate', [UserApplicationController::class, 'escalate'])->name('applications.escalate');
            Route::post('/applications/{application}/resolve', [UserApplicationController::class, 'resolve'])->name('applications.resolve');
            
            Route::post('/schedules/publish', [ScheduleController::class, 'store'])->name('schedules.publish');
            Route::resource('schedules', ScheduleController::class);
        });

        // =========================================================
        // 4. UPPER MANAGEMENT (HR, CEO, Admin)
        // =========================================================
        Route::middleware('role:hr,ceo,admin')->group(function () {
            Route::resource('users', UserController::class);
            Route::resource('holidays', HolidayController::class);
            Route::resource('tours', TourController::class);
        });

        // =========================================================
        // 5. ADMIN ONLY
        // =========================================================
        Route::middleware('role:admin')->group(function () {
            Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
        });

        Route::resource('departments', DepartmentController::class)->except(['show']);
    
    // Assign managers to a department
    Route::get('departments/{department}/assign-managers', [DepartmentController::class, 'assignManagers'])->name('departments.assign-managers');
    Route::post('departments/{department}/managers', [DepartmentController::class, 'syncManagers'])->name('departments.sync-managers');

    });
});

require __DIR__.'/settings.php';