<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user() || ! $request->user()->role) {
            abort(403, 'Unauthorized access - No role assigned.');
        }

        // Get the user's role name from the database (e.g., "Team In-Charge", "Admin")
        $userRole = strtolower($request->user()->role->name);
        
        // Normalize the database role name to match the route definitions
        // "Team In-Charge" becomes "team_in_charge"
        $normalizedUserRole = str_replace([' ', '-'], '_', $userRole);

        if (! in_array($normalizedUserRole, $roles) && ! in_array($userRole, $roles)) {
            abort(403, 'Unauthorized action - Your role does not have permission.');
        }

        return $next($request);
    }
}