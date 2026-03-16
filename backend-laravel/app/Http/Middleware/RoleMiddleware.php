<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || empty($roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $normalizedUserRole = strtolower((string) $user->role);
        $normalizedAllowedRoles = array_map(static fn ($role) => strtolower((string) $role), $roles);

        if (! in_array($normalizedUserRole, $normalizedAllowedRoles, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied for your role.',
            ], 403);
        }

        return $next($request);
    }
}
