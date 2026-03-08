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
        $user = $request->user();
        
        $applications = UserApplication::with(['user.employee', 'escalatedRole'])
            ->where(function($query) use ($user) {
                $query->whereNull('escalated_to_role')
                      ->orWhere('escalated_to_role', $user->role_id);
            })
            ->latest()
            ->get();

        return Inertia::render('Applications/Index', [
            'applications' => $applications
        ]); 
    }

    public function myApplications(Request $request) 
    { 
        $applications = UserApplication::with(['approver', 'escalatedRole'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
         
        return Inertia::render('Applications/MyApps', [
            'applications' => $applications
        ]); 
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'details' => 'required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'action_type' => 'required|in:draft,send',
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('applications', 'public');
        }

        $application = UserApplication::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'details' => $validated['details'],
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'attachment_path' => $attachmentPath,
            'status' => $validated['action_type'] === 'draft' ? 'draft' : 'pending',
        ]);

        ActivityLog::create([
            'user_id' => Auth::id() ?? $request->user()->id,
            'action' => $validated['action_type'] === 'draft' ? 'application_draft_created' : 'application_submitted',
            'model_type' => UserApplication::class,
            'model_id' => $application->id,
            'old_data' => null,
            'new_data' => $application->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return redirect()->route('applications.edit', $application->id);
    }

    public function create() 
    { 
        return Inertia::render('Applications/Form'); 
    }

    public function edit(Request $request, $id) 
    { 
        $application = UserApplication::where('user_id', $request->user()->id)->findOrFail($id);

        return Inertia::render('Applications/Form', [
            'application' => $application
        ]); 
    }

    public function update(Request $request, $id)
    {
        $application = UserApplication::where('user_id', $request->user()->id)->findOrFail($id);

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

        ActivityLog::create([
            'user_id' => Auth::id() ?? $request->user()->id,
            'action' => $validated['action_type'] === 'draft' ? 'application_draft_updated' : 'application_submitted',
            'model_type' => UserApplication::class,
            'model_id' => $application->id,
            'old_data' => $oldData,
            'new_data' => $application->fresh()->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back();
    }

    public function show(UserApplication $application)
    {
        $application->load(['user.employee.department', 'approver', 'escalatedRole']);
        
        return Inertia::render('Applications/Show', [
            'application' => $application
        ]);
    }

    public function resolve(Request $request, UserApplication $application)
    {
        $validated = $request->validate([
            'action' => 'required|in:approve,reject',
            'reason' => 'nullable|string'
        ]);

        $oldData = $application->toArray();

        $application->update([
            'status' => $validated['action'] === 'approve' ? 'approved' : 'rejected',
            'approved_by' => $request->user()->id,
            'escalated_to_role' => null, 
        ]);

        ActivityLog::create([
            'user_id' => Auth::id() ?? $request->user()->id,
            'action' => 'application_resolved',
            'model_type' => UserApplication::class,
            'model_id' => $application->id,
            'old_data' => $oldData,
            'new_data' => $application->fresh()->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Application ' . $validated['action'] . 'd successfully.');
    }

    public function escalate(Request $request, UserApplication $application)
    {
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($validated['role_id']);
        $oldData = $application->toArray();

        $application->update([
            'status' => 'escalated',
            'escalated_to_role' => $role->id,
        ]);

        ActivityLog::create([
            'user_id' => Auth::id() ?? $request->user()->id,
            'action' => 'application_escalated',
            'model_type' => UserApplication::class,
            'model_id' => $application->id,
            'old_data' => $oldData,
            'new_data' => $application->fresh()->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Application escalated to {$role->name} successfully.");
    }
    
    public function destroy(Request $request, UserApplication $application)
    {
        if ($application->user_id !== $request->user()->id && $request->user()->role->name !== 'Admin') {
            abort(403, 'Unauthorized action.');
        }

        if (!in_array($application->status, ['pending', 'draft'])) {
            return back()->with('error', 'You cannot delete an application that has already been processed.');
        }

        if ($application->attachment_path) {
            Storage::disk('public')->delete($application->attachment_path);
        }

        $oldData = $application->toArray();
        $application->delete();

        ActivityLog::create([
            'user_id' => Auth::id() ?? $request->user()->id,
            'action' => 'application_deleted',
            'model_type' => UserApplication::class,
            'model_id' => $application->id,
            'old_data' => $oldData,
            'new_data' => null,
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Application cancelled successfully.');
    }
}