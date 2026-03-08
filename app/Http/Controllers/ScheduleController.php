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
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index()
    {
        $departments = Department::select('id', 'name')->where('is_active', true)->get();

        $teamMembers = User::with(['employee.department', 'role'])
            ->whereHas('employee')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->employee->first_name . ' ' . $u->employee->last_name,
                    'role' => $u->role->name ?? 'Employee',
                    'department_id' => $u->employee->department_id,
                    'type' => in_array($u->employee->department->name ?? '', ['Video', 'News']) ? 'field' : 'office',
                ];
            });

        $startDate = Carbon::today();
        $endDate = Carbon::today()->addDays(7);
        $assignments = [];

        // 1. Fetch office shifts
        $shifts = Shift::whereBetween('date', [$startDate, $endDate])->get();
        foreach ($shifts as $shift) {
            $key = "{$shift->user_id}-{$shift->date->format('Y-m-d')}";
            
            if ($shift->is_day_off) {
                $assignments[$key] = ['type' => 'off'];
            } else {
                if (!isset($assignments[$key])) {
                    $assignments[$key] = ['type' => 'office', 'shifts' => []];
                }
                $assignments[$key]['shifts'][] = [
                    'start' => Carbon::parse($shift->start_time)->format('H:i'),
                    'end' => Carbon::parse($shift->end_time)->format('H:i'),
                ];
            }
        }

        // 2. Fetch field tasks (Tours)
        $tours = Tour::with('users')
            ->where('start_date', '<=', $endDate)
            ->where('end_date', '>=', $startDate)
            ->get();
            
        foreach ($tours as $tour) {
            foreach ($tour->users as $user) {
                $period = CarbonPeriod::create(
                    max(Carbon::parse($tour->start_date), $startDate),
                    min(Carbon::parse($tour->end_date), $endDate)
                );
                foreach ($period as $date) {
                    $dateString = $date->format('Y-m-d');
                    $key = "{$user->id}-{$dateString}";
                    
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
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'assignments' => 'nullable|array',
            'action_type' => 'required|in:draft,send'
        ]);

        $assignments = $validated['assignments'] ?? [];
        $isPublishing = $validated['action_type'] === 'send';
        $status = $isPublishing ? 'published' : 'draft';
        $creatorId = $request->user()->id;

        if (empty($assignments)) {
            return back()->with('success', 'No changes to save.');
        }

        DB::beginTransaction();
        try {
            $affectedScheduleIds = [];

            foreach ($assignments as $key => $data) {
                if (!isset($data['type']) || $data['type'] === 'unassigned') {
                    continue;
                }

                [$userId, $date] = explode('-', $key, 2);
                $user = User::with('employee')->find($userId);

                if (!$user || !$user->employee) continue;

                $deptId = $user->employee->department_id;

                $scheduleStart = Carbon::parse($date)->startOfWeek()->format('Y-m-d');
                $scheduleEnd = Carbon::parse($date)->endOfWeek()->format('Y-m-d');

                $schedule = Schedule::firstOrCreate([
                    'department_id' => $deptId,
                    'start_date' => $scheduleStart,
                    'end_date' => $scheduleEnd,
                ], [
                    'creator_id' => $creatorId,
                    'status' => $status,
                ]);

                $affectedScheduleIds[] = $schedule->id;

                if ($isPublishing && $schedule->status !== 'published') {
                    $schedule->update(['status' => 'published']);
                }

                Shift::where('user_id', $userId)->where('date', $date)->delete();

                $existingTours = Tour::whereHas('users', function($q) use ($userId) {
                    $q->where('users.id', $userId);
                })->where('start_date', '<=', $date)->where('end_date', '>=', $date)->get();

                foreach($existingTours as $ut) {
                    $ut->users()->detach($userId);
                    if ($ut->users()->count() === 0 && $ut->start_date == $ut->end_date) {
                        $ut->delete();
                    }
                }

                if ($data['type'] === 'off') {
                    Shift::create([
                        'schedule_id' => $schedule->id,
                        'user_id' => $userId,
                        'date' => $date,
                        'start_time' => '00:00:00', 
                        'end_time' => '00:00:00',
                        'is_day_off' => true,
                    ]);
                } elseif ($data['type'] === 'office') {
                    foreach ($data['shifts'] as $shiftData) {
                        Shift::create([
                            'schedule_id' => $schedule->id,
                            'user_id' => $userId,
                            'date' => $date,
                            'start_time' => $shiftData['start'],
                            'end_time' => $shiftData['end'],
                            'is_day_off' => false,
                        ]);
                    }
                } elseif ($data['type'] === 'field') {
                    foreach ($data['tasks'] as $taskData) {
                        $tour = Tour::create([
                            'name' => $taskData['task'] ?: 'Field Assignment',
                            'location' => $taskData['location'] ?: 'External Location',
                            'start_date' => $date,
                            'end_date' => $date,
                            'status' => $status === 'published' ? 'approved' : 'pending',
                        ]);
                        $tour->users()->attach($userId);
                    }
                }
            }

            $affectedScheduleIds = array_unique($affectedScheduleIds);
            
            foreach ($affectedScheduleIds as $scheduleId) {
                $schedule = Schedule::find($scheduleId);
                ActivityLog::create([
                    'user_id' => Auth::id() ?? $creatorId,
                    'action' => $isPublishing ? 'schedule_published' : 'schedule_draft_saved',
                    'model_type' => Schedule::class,
                    'model_id' => $scheduleId,
                    'old_data' => null,
                    'new_data' => $schedule->toArray(),
                    'ip_address' => $request->ip(),
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Database Error: ' . $e->getMessage()]);
        }

        return redirect()->back(); 
    }

    public function mySchedule(Request $request)
    {
        $user = $request->user()->load('employee.department', 'role');
        $startDate = Carbon::today();
        $endDate = Carbon::today()->addDays(6);

        $shifts = Shift::where('user_id', $user->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $tours = Tour::whereHas('users', function($q) use ($user) {
            $q->where('users.id', $user->id);
        })->where('start_date', '<=', $endDate)
          ->where('end_date', '>=', $startDate)
          ->get();

        $mySchedule = [];

        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dateString = $date->format('Y-m-d');
            
            $dayData = [
                'id' => $i + 1,
                'date' => $dateString,
                'dayName' => $date->format('l'),
                'type' => 'off', 
            ];

            $tour = $tours->first(fn($t) => $date->between(Carbon::parse($t->start_date), Carbon::parse($t->end_date)));
            
            if ($tour) {
                $dayData['type'] = 'field';
                $dayData['fieldTasks'] = [[
                    'time' => '09:00', 
                    'location' => $tour->location,
                    'task' => $tour->name,
                ]];
            } else {
                $dayShifts = $shifts->where('date', $dateString);
                
                if ($dayShifts->isNotEmpty()) {
                    if ($dayShifts->first()->is_day_off) {
                        $dayData['type'] = 'off';
                    } else {
                        $dayData['type'] = 'office';
                        $dayData['officeShifts'] = [];
                        
                        foreach($dayShifts as $s) {
                            $dayData['officeShifts'][] = [
                                'start' => Carbon::parse($s->start_time)->format('H:i'),
                                'end' => Carbon::parse($s->end_time)->format('H:i'),
                            ];
                        }
                    }
                }
            }

            $mySchedule[] = $dayData;
        }

        return Inertia::render('Scheduling/ViewRoster', [
            'mySchedule' => $mySchedule,
        ]);
    }
}