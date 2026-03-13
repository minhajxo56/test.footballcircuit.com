<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Shift;
use App\Models\Tour;
use App\Models\Schedule;
use App\Models\Department;
use App\Models\ActivityLog;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Schedule::class);

        $user = $request->user()->load('role', 'employee');
        $roleName = $user->role->name;
        
        // Define who gets full access and filtering
        $isUpperManagement = in_array($roleName, ['Super_Admin', 'Admin', 'HR', 'CEO']);

        $deptQuery = Department::select('id', 'name', 'type')->where('is_active', true);
        $teamQuery = User::with(['employee.department', 'role'])->whereHas('employee');

        if (!$isUpperManagement && $roleName === 'Team_In_Charge') {
            // Fetch only departments they manage via the pivot table
            $managedDeptIds = $user->managedDepartments()->pluck('departments.id')->toArray();
            $deptQuery->whereIn('id', $managedDeptIds);
            
            // Team In Charge only sees employees in their managed departments, PLUS themselves
            $teamQuery->where(function ($query) use ($managedDeptIds, $user) {
                $query->whereHas('employee', function ($subQuery) use ($managedDeptIds) {
                    $subQuery->whereIn('department_id', $managedDeptIds);
                })->orWhere('users.id', $user->id);
            });
        }

        $departments = $deptQuery->get();
        
        $teamMembers = $teamQuery->get()->map(function($u) {
            // Parse the SET column ('office,field') from DB into a real array
            $dbTypes = isset($u->employee->department->type) 
                ? explode(',', $u->employee->department->type) 
                : ['office'];

            return [
                'id' => $u->id,
                'name' => "{$u->employee->first_name} {$u->employee->last_name}",
                'email' => $u->email,
                'role' => $u->role->name ?? 'Employee',
                'department_id' => $u->employee->department_id,
                'type' => $dbTypes, // Now an array: ['office'], ['field'], or ['office', 'field']
            ];
        });

        $userIds = $teamMembers->pluck('id')->toArray();
        $startDate = Carbon::today();
        $endDate = Carbon::today()->addDays(7);
        $assignments = [];

        $shifts = Shift::whereIn('user_id', $userIds)->whereBetween('date', [$startDate, $endDate])->get();
        
        foreach ($shifts as $shift) {
            $key = "{$shift->user_id}-{$shift->date->format('Y-m-d')}";
            if ($shift->is_day_off) {
                $assignments[$key] = ['type' => 'off'];
            } else {
                $assignments[$key] ??= ['type' => 'office', 'shifts' => []];
                $assignments[$key]['shifts'][] = [
                    'start' => Carbon::parse($shift->start_time)->format('H:i'),
                    'end' => Carbon::parse($shift->end_time)->format('H:i'),
                ];
            }
        }

        $tours = Tour::with('users')
            ->whereHas('users', fn($q) => $q->whereIn('users.id', $userIds))
            ->where('start_date', '<=', $endDate)
            ->where('end_date', '>=', $startDate)
            ->get();

        foreach ($tours as $tour) {
            foreach ($tour->users->whereIn('id', $userIds) as $tu) {
                $period = CarbonPeriod::create(max(Carbon::parse($tour->start_date), $startDate), min(Carbon::parse($tour->end_date), $endDate));
                foreach ($period as $date) {
                    $key = "{$tu->id}-{$date->format('Y-m-d')}";
                    if (!isset($assignments[$key]) || $assignments[$key]['type'] !== 'field') {
                        $assignments[$key] = ['type' => 'field', 'tasks' => []];
                    }
                    $assignments[$key]['tasks'][] = [
                        'time' => '09:00',
                        'location' => $tour->location ?? 'Field Location',
                        'task' => $tour->name,
                    ];
                }
            }
        }

        return Inertia::render('Scheduling/Planner', [
            'teamMembers' => $teamMembers,
            'departments' => $departments,
            'initialAssignments' => (object)$assignments, 
            'canFilterDepartments' => $isUpperManagement, // Pass this to UI to hide/show the dropdown
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Schedule::class);

        $validated = $request->validate([
            'assignments' => 'nullable|array',
            'action_type' => 'required|in:draft,send'
        ]);

        $assignments = $validated['assignments'] ?? [];
        if (empty($assignments)) return back()->with('success', 'No changes to save.');

        $isPublishing = $validated['action_type'] === 'send';
        $status = $isPublishing ? 'published' : 'draft';
        
        $user = $request->user()->load('role');
        $isUpperManagement = in_array($user->role->name, ['Super_Admin', 'Admin', 'HR', 'CEO']);
        
        $managedDeptIds = $user->role->name === 'Team_In_Charge' 
            ? $user->managedDepartments()->pluck('departments.id')->toArray() 
            : [];

        // 1. Group incoming assignments by user to handle hashing cleanly
        $userAssignments = [];
        foreach ($assignments as $key => $data) {
            if (!isset($data['type']) || $data['type'] === 'unassigned') continue;
            [$userId, $date] = explode('-', $key, 2);
            $userAssignments[$userId][$date] = $data;
        }

        DB::beginTransaction();
        try {
            $affectedScheduleIds = [];
            $usersToNotify = []; // Only holds IDs of users who actually had a change
            $dates = []; // For the email table headers

            foreach ($userAssignments as $userId => $datesData) {
                $targetUser = User::with('employee')->find($userId);
                if (!$targetUser || !$targetUser->employee) continue;

                // Security check
                if (!$isUpperManagement && $user->role->name === 'Team_In_Charge') {
                    if ($targetUser->id !== $user->id && !in_array($targetUser->employee->department_id, $managedDeptIds)) {
                        continue; 
                    }
                }

                $deptId = $targetUser->employee->department_id;
                
                // Track dates for the email table later
                foreach(array_keys($datesData) as $d) {
                    $dates[] = $d;
                }

                $firstDate = array_key_first($datesData);
                $weekStart = Carbon::parse($firstDate)->startOfWeek()->format('Y-m-d');
                $weekEnd = Carbon::parse($firstDate)->endOfWeek()->format('Y-m-d');

                $schedule = Schedule::firstOrCreate([
                    'department_id' => $deptId,
                    'start_date' => $weekStart,
                    'end_date' => $weekEnd,
                ], ['creator_id' => $user->id, 'status' => $status]);

                $affectedScheduleIds[] = $schedule->id;

                if ($isPublishing && $schedule->status !== 'published') {
                    $schedule->update(['status' => 'published']);
                }

                // Delete old records
                Shift::where('user_id', $userId)->whereBetween('date', [$weekStart, $weekEnd])->delete();
                Tour::whereHas('users', fn($q) => $q->where('users.id', $userId))
                    ->where('start_date', '<=', $weekEnd)->where('end_date', '>=', $weekStart)
                    ->get()->each(function($ut) use ($userId) {
                        $ut->users()->detach($userId);
                        if ($ut->users()->count() === 0 && $ut->start_date == $ut->end_date) $ut->delete();
                    });

                // Create new records
                foreach ($datesData as $date => $data) {
                    if ($data['type'] === 'off') {
                        Shift::create(['schedule_id' => $schedule->id, 'user_id' => $userId, 'date' => $date, 'start_time' => '00:00:00', 'end_time' => '00:00:00', 'is_day_off' => true]);
                    } elseif ($data['type'] === 'office') {
                        foreach ($data['shifts'] as $sd) {
                            Shift::create(['schedule_id' => $schedule->id, 'user_id' => $userId, 'date' => $date, 'start_time' => $sd['start'], 'end_time' => $sd['end'], 'is_day_off' => false]);
                        }
                    } elseif ($data['type'] === 'field') {
                        foreach ($data['tasks'] as $td) {
                            $tour = Tour::create(['name' => $td['task'] ?: 'Field Assignment', 'location' => $td['location'] ?: 'External Location', 'start_date' => $date, 'end_date' => $date, 'status' => $status === 'published' ? 'approved' : 'pending']);
                            $tour->users()->attach($userId);
                        }
                    }
                }

                // --- THE HASHING & DEDUPLICATION LOGIC ---
                if ($isPublishing) {
                    ksort($datesData); // Sort to ensure the JSON string is always in the same order
                    $hash = hash('sha256', json_encode($datesData));

                    $existingTracker = DB::table('schedule_hashes')
                        ->where('user_id', $userId)
                        ->where('week_start', $weekStart)
                        ->first();

                    // If no hash exists, or the hash is different, flag for notification!
                    if (!$existingTracker || $existingTracker->hash !== $hash) {
                        $usersToNotify[] = $userId;
                        
                        DB::table('schedule_hashes')->updateOrInsert(
                            ['user_id' => $userId, 'week_start' => $weekStart],
                            ['hash' => $hash, 'updated_at' => now()]
                        );
                    }
                }
            }

            foreach (array_unique($affectedScheduleIds) as $scheduleId) {
                $this->logActivity($isPublishing ? 'schedule_published' : 'schedule_draft_saved', Schedule::find($scheduleId), $request->ip());
            }

            DB::commit();

            // SEND EMAIL LOGIC (Targeted and delayed)
            if ($isPublishing && !empty($usersToNotify)) {
                
                $scheduledUsers = User::with('employee')->whereIn('id', $usersToNotify)->get();
                $uniqueDates = collect($dates)->unique()->sort()->values()->toArray();
                $humanStartDate = Carbon::parse($uniqueDates[0] ?? now())->format('F j, Y');

                // Generate rows ONLY for users who actually had a change
                $rows = [];
                foreach ($usersToNotify as $uid) {
                    $targetUser = $scheduledUsers->firstWhere('id', $uid);
                    $empName = $targetUser->employee->first_name . ' ' . $targetUser->employee->last_name;

                    foreach ($uniqueDates as $date) {
                        $data = $userAssignments[$uid][$date] ?? null;
                        
                        if (!$data || $data['type'] === 'unassigned') {
                            $rows[$empName][$date] = '-';
                            continue;
                        }

                        if ($data['type'] === 'off') {
                            $rows[$empName][$date] = 'Off';
                        } elseif ($data['type'] === 'office') {
                            $rows[$empName][$date] = collect($data['shifts'])
                                ->map(fn($s) => $s['start'] . '-' . $s['end'])
                                ->join(', ');
                        } elseif ($data['type'] === 'field') {
                            $rows[$empName][$date] = collect($data['tasks'])
                                ->map(fn($t) => '📍 ' . ($t['location'] ?: 'Field'))
                                ->join('<br>');
                        }
                    }
                }

                $scheduleData = [
                    'dates' => $uniqueDates,
                    'rows' => $rows,
                ];

                // Send the notification to the filtered users
                \Illuminate\Support\Facades\Notification::send(
                    $scheduledUsers, 
                    (new \App\Notifications\SchedulePublished($scheduleData, $user->name, $humanStartDate))
                        ->delay(now()->addMinutes(3)) // 3-minute grace period
                );
            }

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Database Error: ' . $e->getMessage()]);
        }

        return redirect()->back()->with('success', 'Schedule saved successfully.');
    }

    public function mySchedule(Request $request)
    {
        $user = $request->user()->load('employee.department', 'role');
        
        $startDate = Carbon::today();
        $endDate = Carbon::today()->addDays(6)->endOfDay();
        
        $shifts = Shift::where('user_id', $user->id)->whereBetween('date', [$startDate, $endDate])->get();
        $tours = Tour::whereHas('users', fn($q) => $q->where('users.id', $user->id))->where('start_date', '<=', $endDate)->where('end_date', '>=', $startDate)->get();
    
        $mySchedule = [];
    
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dateString = $date->format('Y-m-d');
            
            $dayData = ['id' => $i + 1, 'date' => $dateString, 'dayName' => $date->format('l'), 'type' => 'off'];
    
            $tour = $tours->first(fn($t) => $dateString >= Carbon::parse($t->start_date)->format('Y-m-d') && $dateString <= Carbon::parse($t->end_date)->format('Y-m-d'));
            
            if ($tour) {
                $dayData['type'] = 'field';
                $dayData['fieldTasks'] = [['time' => '09:00', 'location' => $tour->location, 'task' => $tour->name]];
            } else {
                $dayShifts = $shifts->filter(fn($shift) => Carbon::parse($shift->date)->format('Y-m-d') === $dateString);
                
                if ($dayShifts->isNotEmpty()) {
                    if ($dayShifts->first()->is_day_off) {
                        $dayData['type'] = 'off';
                    } else {
                        $dayData['type'] = 'office';
                        $dayData['officeShifts'] = [];
                        
                        foreach($dayShifts as $s) {
                            $dayData['officeShifts'][] = ['start' => Carbon::parse($s->start_time)->format('H:i'), 'end' => Carbon::parse($s->end_time)->format('H:i')];
                        }
                    }
                }
            }
            $mySchedule[] = $dayData;
        }
        
        return Inertia::render('Scheduling/ViewRoster', ['mySchedule' => $mySchedule]);
    }

    private function logActivity(string $action, Schedule $schedule, string $ip)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model_type' => Schedule::class,
            'model_id' => $schedule->id,
            'old_data' => null,
            'new_data' => $schedule->toArray(),
            'ip_address' => $ip,
        ]);
    }
}