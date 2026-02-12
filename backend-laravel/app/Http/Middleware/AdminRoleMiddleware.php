<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminRoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $request->user()->role || strtoupper($request->user()->role) !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé. Vous devez être administrateur pour accéder à cette ressource.',
            ], 403);
        }

        return $next($request);
    }
}
