<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class ForcePasswordChangeController extends Controller
{
    public function create(Request $request)
    {
        // If they don't need to change it, send them to the dashboard
        if (!$request->user()->must_change_password) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('auth/ForcePasswordChange');
    }

    public function store(Request $request)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
            'must_change_password' => false,
        ]);

        return redirect()->route('dashboard')->with('success', 'Password updated successfully.');
    }
}