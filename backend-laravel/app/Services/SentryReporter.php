<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class SentryReporter
{
    public function captureException(Throwable $exception, array $context = []): void
    {
        if (! (bool) config('services.sentry.enabled', false)) {
            return;
        }

        $dsn = (string) config('services.sentry.backend_dsn', '');
        if ($dsn === '') {
            return;
        }

        $parsedDsn = parse_url($dsn);
        if (! $parsedDsn || empty($parsedDsn['scheme']) || empty($parsedDsn['host']) || empty($parsedDsn['user']) || empty($parsedDsn['path'])) {
            return;
        }

        $projectId = trim((string) $parsedDsn['path'], '/');
        if ($projectId === '') {
            return;
        }

        $baseUrl = $parsedDsn['scheme'].'://'.$parsedDsn['host'];
        if (! empty($parsedDsn['port'])) {
            $baseUrl .= ':'.$parsedDsn['port'];
        }

        $eventId = str_replace('-', '', (string) Str::uuid());
        $endpoint = "{$baseUrl}/api/{$projectId}/store/";
        $sentryAuth = sprintf(
            'Sentry sentry_version=7, sentry_key=%s, sentry_client=parqv2-backend/1.0',
            $parsedDsn['user']
        );

        $payload = [
            'event_id' => $eventId,
            'platform' => 'php',
            'level' => 'error',
            'environment' => app()->environment(),
            'timestamp' => now()->timestamp,
            'server_name' => gethostname() ?: null,
            'exception' => [
                'values' => [[
                    'type' => get_class($exception),
                    'value' => $exception->getMessage(),
                ]],
            ],
            'request' => [
                'url' => $context['url'] ?? null,
                'method' => $context['method'] ?? null,
            ],
            'tags' => [
                'request_id' => $context['request_id'] ?? null,
            ],
            'extra' => [
                'code' => $exception->getCode(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'user_id' => $context['user_id'] ?? null,
            ],
        ];

        try {
            Http::asJson()
                ->withHeaders([
                    'X-Sentry-Auth' => $sentryAuth,
                ])
                ->timeout(max((int) config('services.sentry.timeout', 2), 1))
                ->post($endpoint, $payload)
                ->throw();
        } catch (Throwable) {
            // Never break request flow if Sentry reporting fails.
        }
    }
}
