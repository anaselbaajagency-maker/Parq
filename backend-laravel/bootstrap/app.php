<?php

use App\Exceptions\InsufficientBalanceException;
use App\Services\SentryReporter;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append([
            \App\Http\Middleware\RequestContextMiddleware::class,
            \App\Http\Middleware\SecurityHeadersMiddleware::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminRoleMiddleware::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'maintenance.access' => \App\Http\Middleware\MaintenanceAccessMiddleware::class,
        ]);

        $middleware->redirectGuestsTo(fn (\Illuminate\Http\Request $request) => $request->is('api/*') ? null : route('login'));
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                ], 401);
            }
        });

        $exceptions->report(function (\Throwable $exception) {
            if ($exception instanceof ValidationException || $exception instanceof InsufficientBalanceException) {
                return;
            }

            if ($exception instanceof HttpExceptionInterface && $exception->getStatusCode() < 500) {
                return;
            }

            $request = app()->bound('request') ? request() : null;

            app(SentryReporter::class)->captureException($exception, [
                'request_id' => $request?->attributes->get('request_id'),
                'method' => $request?->method(),
                'url' => $request?->fullUrl(),
                'user_id' => $request?->user()?->id,
            ]);
        });

        $exceptions->respond(function (Response $response) {
            if (! app()->bound('request')) {
                return $response;
            }

            $request = request();
            $requestIdHeader = (string) config('security.request_id_header', 'X-Request-ID');
            $requestId = $request->attributes->get('request_id');

            if ($requestId) {
                $response->headers->set($requestIdHeader, (string) $requestId);
            }

            return $response;
        });
    })->create();
