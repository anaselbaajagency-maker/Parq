<?php

return [
    'cache' => [
        'enabled' => env('PERF_CACHE_ENABLED', true),
        'store' => env('PERF_CACHE_STORE'),
        'public_ttl_seconds' => (int) env('PERF_PUBLIC_CACHE_TTL_SECONDS', 60),
        'stale_while_revalidate_seconds' => (int) env('PERF_STALE_WHILE_REVALIDATE_SECONDS', 30),
    ],

    'query_profiler' => [
        'enabled' => env('DB_QUERY_PROFILING_ENABLED', false),
        'threshold_ms' => (int) env('DB_SLOW_QUERY_THRESHOLD_MS', 300),
    ],

    'pagination' => [
        'max_per_page' => (int) env('PERF_MAX_PER_PAGE', 50),
        'default_per_page' => (int) env('PERF_DEFAULT_PER_PAGE', 15),
        'cursor_param' => env('PERF_CURSOR_PARAM', 'pagination'),
        'cursor_value' => env('PERF_CURSOR_VALUE', 'cursor'),
    ],

    'queues' => [
        'media' => env('PERF_MEDIA_QUEUE', 'media'),
    ],
];
