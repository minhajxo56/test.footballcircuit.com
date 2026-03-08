<?php
namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = ActivityLog::with('user')
            ->latest()
            ->paginate(20);

        return Inertia::render('ActivityLogs/Index', [
            'logs' => $logs
        ]);
    }
}