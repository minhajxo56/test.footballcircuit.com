<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', ActivityLog::class);

        return Inertia::render('ActivityLogs/Index', [
            'logs' => ActivityLog::with('user')->latest()->paginate(20)
        ]);
    }
}