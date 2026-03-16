<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiters();
        $this->configureQueryProfiler();
    }

    private function configureRateLimiters(): void
    {
        RateLimiter::for('auth-login', function (Request $request) {
            $email = (string) $request->input('email', 'guest');

            return [
                Limit::perMinute(5)->by($request->ip().'|'.$email),
                Limit::perMinute(30)->by($request->ip()),
            ];
        });

        RateLimiter::for('auth-register', function (Request $request) {
            return [
                Limit::perMinute(5)->by($request->ip()),
            ];
        });

        RateLimiter::for('password-reset', function (Request $request) {
            $email = (string) $request->input('email', 'guest');

            return [
                Limit::perMinute(5)->by($request->ip().'|'.$email),
                Limit::perHour(20)->by($request->ip()),
            ];
        });

        RateLimiter::for('otp-send', function (Request $request) {
            $phone = (string) $request->input('phone', 'unknown');

            return [
                Limit::perMinute(3)->by($request->ip().'|'.$phone),
                Limit::perHour(15)->by($request->ip()),
            ];
        });

        RateLimiter::for('otp-verify', function (Request $request) {
            $phone = (string) $request->input('phone', 'unknown');

            return [
                Limit::perMinute(6)->by($request->ip().'|'.$phone),
                Limit::perHour(40)->by($request->ip()),
            ];
        });

        RateLimiter::for('payments-webhook', function (Request $request) {
            return [
                Limit::perMinute(120)->by($request->ip()),
            ];
        });

        RateLimiter::for('api-general', function (Request $request) {
            return [
                Limit::perMinute(600)->by($request->ip()),
                Limit::perMinute(400)->by($request->user()?->id ? 'user:'.$request->user()->id : 'guest'),
            ];
        });
 
        RateLimiter::for('listings-read', function (Request $request) {
            return [
                Limit::perMinute(400)->by($request->ip()),
                Limit::perMinute(300)->by($request->user()?->id ? 'user:'.$request->user()->id : 'guest'),
            ];
        });

        RateLimiter::for('listings-write', function (Request $request) {
            return [
                Limit::perMinute(60)->by($request->ip()),
                Limit::perMinute(40)->by($request->user()?->id ? 'user:'.$request->user()->id : 'guest'),
            ];
        });

        RateLimiter::for('wallet-actions', function (Request $request) {
            return [
                Limit::perMinute(300)->by($request->ip()),
                Limit::perMinute(200)->by($request->user()?->id ? 'user:'.$request->user()->id : 'guest'),
            ];
        });

        RateLimiter::for('messages-actions', function (Request $request) {
            return [
                Limit::perMinute(90)->by($request->ip()),
                Limit::perMinute(70)->by($request->user()?->id ? 'user:'.$request->user()->id : 'guest'),
            ];
        });

        RateLimiter::for('admin-actions', function (Request $request) {
            return [
                Limit::perMinute(120)->by($request->ip()),
                Limit::perMinute(80)->by($request->user()?->id ? 'admin:'.$request->user()->id : 'guest'),
            ];
        });
    }

    private function configureQueryProfiler(): void
    {
        if (! (bool) config('performance.query_profiler.enabled', false)) {
            return;
        }

        $thresholdMs = max((int) config('performance.query_profiler.threshold_ms', 300), 1);

        DB::listen(function (QueryExecuted $query) use ($thresholdMs): void {
            if ($query->time < $thresholdMs) {
                return;
            }

            Log::warning('slow_query_detected', [
                'sql' => $query->sql,
                'bindings' => $query->bindings,
                'time_ms' => $query->time,
                'connection' => $query->connectionName,
            ]);
        });
    }
}
