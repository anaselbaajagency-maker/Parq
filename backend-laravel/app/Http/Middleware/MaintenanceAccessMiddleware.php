<?php

namespace App\Http\Middleware;

use App\Services\RuntimeSettingService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MaintenanceAccessMiddleware
{
    public function __construct(private RuntimeSettingService $runtimeSettingService) {}

    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->is('api/*')) {
            return $next($request);
        }

        if (! $this->runtimeSettingService->maintenanceModeEnabled()) {
            return $next($request);
        }

        if ($this->isExemptPath($request) || $this->hasValidBypassToken($request) || $this->isAdminUser($request)) {
            return $next($request);
        }

        return response()->json([
            'message' => $this->runtimeSettingService->maintenanceMessage(),
            'maintenance_mode' => true,
            'request_id' => $request->attributes->get('request_id'),
        ], 503);
    }

    private function isExemptPath(Request $request): bool
    {
        $exemptPaths = config('security.maintenance_exempt_paths', []);

        foreach ($exemptPaths as $pattern) {
            if ($request->is($pattern)) {
                return true;
            }
        }

        return false;
    }

    private function hasValidBypassToken(Request $request): bool
    {
        $expectedToken = (string) config('security.maintenance_bypass_token', '');
        if ($expectedToken === '') {
            return false;
        }

        $headerName = (string) config('security.maintenance_bypass_header', 'X-Maintenance-Bypass');
        $providedToken = (string) $request->headers->get($headerName, '');

        return hash_equals($expectedToken, $providedToken);
    }

    private function isAdminUser(Request $request): bool
    {
        $user = $request->user('sanctum');

        if (! $user && $request->bearerToken()) {
            $user = auth('sanctum')->user();
        }

        return $user?->isAdmin() === true;
    }
}
