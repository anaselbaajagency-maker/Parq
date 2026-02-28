<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
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
    }
}
