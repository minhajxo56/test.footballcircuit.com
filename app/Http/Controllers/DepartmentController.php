<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class DepartmentController extends Controller 
{
    // 1. Redirect the index to our central Settings Hub
    public function index() 
    { 
        return redirect()->route('settings.index'); 
    }

    // 2. Show the Create Form
    public function create() 
    { 
        return Inertia::render('SystemSettings/Departments/Form'); 
    }

    // 3. Handle Form Submission (Mocked for UI testing)
    public function store(Request $request) 
    { 
        // Later: Save to DB here
        return redirect()->route('settings.index')->with('success', 'Department created.'); 
    }

    // 4. Show the Edit Form with dummy data so you can test the UI
    public function edit($id) 
    { 
        // Dummy data to simulate an edit view
        $dummyDepartment = [
            'id' => $id, 
            'name' => 'News', 
            'manager_id' => 1, 
            'is_active' => true
        ];

        return Inertia::render('SystemSettings/Departments/Form', [
            'department' => $dummyDepartment
        ]); 
    }

    // 5. Handle Update Submission (Mocked for UI testing)
    public function update(Request $request, $id) 
    { 
        // Later: Update DB here
        return redirect()->route('settings.index')->with('success', 'Department updated.'); 
    }

    // 6. Handle Deletion (Mocked for UI testing)
    public function destroy($id) 
    {
        // Later: Delete from DB here
        return redirect()->route('settings.index');
    }
}