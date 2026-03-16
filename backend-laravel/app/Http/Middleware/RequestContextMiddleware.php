<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class RequestContextMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $requestIdHeader = (string) config('security.request_id_header', 'X-Request-ID');
        $requestId = (string) ($request->headers->get($requestIdHeader) ?: Str::uuid());
        $startedAt = microtime(true);

        $request->attributes->set('request_id', $requestId);

        Log::withContext([
            'request_id' => $requestId,
            'method' => $request->method(),
            'path' => '/'.ltrim($request->path(), '/'),
            'ip' => $request->ip(),
        ]);

        try {
            $response = $next($request);
        } catch (Throwable $exception) {
            Log::error('http_request_failed', [
                'request_id' => $requestId,
                'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
                'exception' => get_class($exception),
                'message' => $exception->getMessage(),
            ]);

            throw $exception;
        }

        $durationMs = (int) round((microtime(true) - $startedAt) * 1000);
        $response->headers->set($requestIdHeader, $requestId);

        Log::info('http_request_completed', [
            'request_id' => $requestId,
            'status' => $response->getStatusCode(),
            'duration_ms' => $durationMs,
            'user_id' => $request->user()?->id,
        ]);

        return $response;
    }
}
