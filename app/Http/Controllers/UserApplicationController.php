<?php

namespace App\Http\Controllers;

use App\Models\UserApplication;
use App\Models\Role;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class UserApplicationController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', UserApplication::class);

        $user = $request->user();

        $query = UserApplication::with(['user.employee', 'escalatedRole'])
            ->where(function($q) use ($user) {
                $q->whereNull('escalated_to_role')
                  ->orWhere('escalated_to_role', $user->role_id);
            });

        if ($user->role->name === 'Team_In_Charge') {
            $query->whereHas('user.employee', function($q) use ($user) {
                $q->where('department_id', $user->employee->department_id);
            });
        }

        return Inertia::render('Applications/Index', [
            'applications' => $query->latest()->get()
        ]);
    }

    public function myApplications(Request $request)
    {
        return Inertia::render('Applications/MyApps', [
            'applications' => UserApplication::with(['approver', 'escalatedRole'])
                ->where('user_id', $request->user()->id)
                ->latest()
                ->get()
        ]);
    }

    public function create()
    {
        $this->authorize('create', UserApplication::class);
        
        return Inertia::render('Applications/Form');
    }

    public function store(Request $request)
    {
        $this->authorize('create', UserApplication::class);

        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'details' => 'required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'action_type' => 'required|in:draft,send',
        ]);

        $attachmentPath = $request->hasFile('attachment') 
            ? $request->file('attachment')->store('applications', 'public') 
            : null;

        $application = UserApplication::create([
            'user_id' => Auth::id(),
            'type' => $validated['type'],
            'title' => $validated['title'],
            'details' => $validated['details'],
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'attachment_path' => $attachmentPath,
            'status' => $validated['action_type'] === 'draft' ? 'draft' : 'pending',
        ]);

        $this->logActivity(
            $validated['action_type'] === 'draft' ? 'application_draft_created' : 'application_submitted', 
            $application
        );

        return redirect()->route('applications.edit', $application->id);
    }

    public function edit(Request $request, $id)
    {
        $application = UserApplication::where('user_id', Auth::id())->findOrFail($id);
        
        $this->authorize('update', $application);

        return Inertia::render('Applications/Form', [
            'application' => $application
        ]);
    }

    public function update(Request $request, $id)
    {
        $application = UserApplication::where('user_id', Auth::id())->findOrFail($id);
        
        $this->authorize('update', $application);

        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'details' => 'required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'action_type' => 'required|in:draft,send',
        ]);

        $oldData = $application->toArray();
        $attachmentPath = $application->attachment_path;

        if ($request->hasFile('attachment')) {
            if ($attachmentPath) {
                Storage::disk('public')->delete($attachmentPath);
            }
            $attachmentPath = $request->file('attachment')->store('applications', 'public');
        }

        $determinedStatus = $validated['action_type'] === 'draft' 
            ? ($application->status === 'pending' ? 'pending' : 'draft') 
            : 'pending';

        $application->update([
            'type' => $validated['type'],
            'title' => $validated['title'],
            'details' => $validated['details'],
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'attachment_path' => $attachmentPath,
            'status' => $determinedStatus,
        ]);

        $this->logActivity(
            $validated['action_type'] === 'draft' ? 'application_draft_updated' : 'application_submitted', 
            $application, 
            $oldData
        );

        return redirect()->back();
    }

    public function show(UserApplication $application)
    {
        $this->authorize('view', $application);

        $application->load(['user.employee.department', 'approver', 'escalatedRole']);
        
        return Inertia::render('Applications/Show', [
            'application' => $application
        ]);
    }

    public function resolve(Request $request, UserApplication $application)
    {
        $this->authorize('resolve', $application);

        $validated = $request->validate([
            'action' => 'required|in:approve,reject',
            'reason' => 'nullable|string'
        ]);

        $oldData = $application->toArray();

        $application->update([
            'status' => $validated['action'] === 'approve' ? 'approved' : 'rejected',
            'approved_by' => Auth::id(),
            'escalated_to_role' => null, 
        ]);

        $this->logActivity('application_resolved', $application, $oldData);

        return back()->with('success', 'Application ' . $validated['action'] . 'd successfully.');
    }

    public function escalate(Request $request, UserApplication $application)
    {
        $this->authorize('escalate', $application);

        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($validated['role_id']);
        $oldData = $application->toArray();

        $application->update([
            'status' => 'escalated',
            'escalated_to_role' => $role->id,
        ]);

        $this->logActivity('application_escalated', $application, $oldData);

        return back()->with('success', "Application escalated to {$role->name} successfully.");
    }
    
    public function destroy(UserApplication $application)
    {
        $this->authorize('delete', $application);

        if (!in_array($application->status, ['pending', 'draft'])) {
            return back()->with('error', 'You cannot delete an application that has already been processed.');
        }

        if ($application->attachment_path) {
            Storage::disk('public')->delete($application->attachment_path);
        }

        $oldData = $application->toArray();
        $application->delete();

        $this->logActivity('application_deleted', $application, $oldData, true);

        return back()->with('success', 'Application cancelled successfully.');
    }

    private function logActivity(string $action, UserApplication $application, ?array $oldData = null, bool $isDeleted = false)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model_type' => UserApplication::class,
            'model_id' => $application->id,
            'old_data' => $oldData,
            'new_data' => $isDeleted ? null : $application->fresh()->toArray(),
            'ip_address' => request()->ip(),
        ]);
    }
}