<?php

return [
    'topup_proof_url_ttl_minutes' => env('TOPUP_PROOF_URL_TTL_MINUTES', 60),
    'request_id_header' => env('REQUEST_ID_HEADER', 'X-Request-ID'),
    'settings_cache_ttl_seconds' => (int) env('SETTINGS_CACHE_TTL_SECONDS', 30),
    'maintenance_bypass_header' => env('MAINTENANCE_BYPASS_HEADER', 'X-Maintenance-Bypass'),
    'maintenance_bypass_token' => env('MAINTENANCE_BYPASS_TOKEN', ''),
    'maintenance_exempt_paths' => [
        'api/settings',
        'api/v1/settings',
        'api/login',
        'api/v1/login',
        'api/auth/google-login',
        'api/v1/auth/google-login',
        'api/forgot-password',
        'api/v1/forgot-password',
        'api/auth/otp/*',
        'api/v1/auth/otp/*',
        'api/payments/callback/*',
        'api/v1/payments/callback/*',
        'api/payments/webhook/*',
        'api/v1/payments/webhook/*',
    ],
];
