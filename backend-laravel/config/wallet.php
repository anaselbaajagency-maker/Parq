<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Wallet Currency Label
    |--------------------------------------------------------------------------
    |
    | The display name for the wallet currency used in the platform.
    |
    */
    'currency_label' => env('WALLET_CURRENCY_LABEL', 'SOLD DIRHAM'),

    /*
    |--------------------------------------------------------------------------
    | Conversion Rate
    |--------------------------------------------------------------------------
    |
    | The conversion rate between SOLD DIRHAM and MAD (Moroccan Dirham).
    | 1 SOLD DIRHAM = X MAD
    |
    */
    'conversion_rate' => env('WALLET_CONVERSION_RATE', 1),

    /*
    |--------------------------------------------------------------------------
    | Registration Bonus
    |--------------------------------------------------------------------------
    |
    | The amount of credits given to new users upon registration.
    |
    */
    'registration_bonus' => env('WALLET_REGISTRATION_BONUS', 100),

    /*
    |--------------------------------------------------------------------------
    | Default Daily Cost
    |--------------------------------------------------------------------------
    |
    | The default daily cost for listings if category doesn't specify one.
    |
    */
    'default_daily_cost' => env('WALLET_DEFAULT_DAILY_COST', 5),

    /*
    |--------------------------------------------------------------------------
    | Minimum Top-Up Amount
    |--------------------------------------------------------------------------
    |
    | The minimum amount a user can top up.
    |
    */
    'minimum_topup' => env('WALLET_MINIMUM_TOPUP', 50),

    /*
    |--------------------------------------------------------------------------
    | Maximum Top-Up Amount
    |--------------------------------------------------------------------------
    |
    | The maximum amount a user can top up in a single transaction.
    |
    */
    'maximum_topup' => env('WALLET_MAXIMUM_TOPUP', 10000),

    /*
    |--------------------------------------------------------------------------
    | Transaction Types
    |--------------------------------------------------------------------------
    |
    | Valid transaction types for wallet transactions.
    |
    */
    'transaction_types' => [
        'bonus' => 'Bonus',
        'topup_manual' => 'Manual Top-Up',
        'online_payment' => 'Online Payment',
        'deduction' => 'Deduction',
        'coupon' => 'Coupon',
        'admin_credit' => 'Admin Credit',
    ],

    /*
    |--------------------------------------------------------------------------
    | Transaction Sources
    |--------------------------------------------------------------------------
    |
    | Valid sources for wallet transactions.
    |
    */
    'transaction_sources' => [
        'system' => 'System',
        'bank_transfer' => 'Bank Transfer',
        'cmi' => 'CMI',
        'payzone' => 'Payzone',
        'cashplus' => 'Cash Plus',
        'admin' => 'Admin',
    ],

    /*
    |--------------------------------------------------------------------------
    | Payment Gateways Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Moroccan payment gateways.
    |
    */
    'payment_gateways' => [
        'cmi' => [
            'enabled' => env('CMI_ENABLED', false),
            'merchant_id' => env('CMI_MERCHANT_ID'),
            'store_key' => env('CMI_STORE_KEY'),
            'api_url' => env('CMI_API_URL', 'https://payment.cmi.co.ma/fim/est3Dgate'),
            'callback_url' => env('CMI_CALLBACK_URL'),
            'ok_url' => env('CMI_OK_URL'),
            'fail_url' => env('CMI_FAIL_URL'),
            'sandbox' => env('CMI_SANDBOX', true),
        ],
        'payzone' => [
            'enabled' => env('PAYZONE_ENABLED', false),
            'merchant_id' => env('PAYZONE_MERCHANT_ID'),
            'api_key' => env('PAYZONE_API_KEY'),
            'api_url' => env('PAYZONE_API_URL', 'https://api.payzone.ma'),
            'sandbox' => env('PAYZONE_SANDBOX', true),
        ],
        'cashplus' => [
            'enabled' => env('CASHPLUS_ENABLED', false),
            'partner_id' => env('CASHPLUS_PARTNER_ID'),
            'api_key' => env('CASHPLUS_API_KEY'),
            'api_url' => env('CASHPLUS_API_URL'),
            'sandbox' => env('CASHPLUS_SANDBOX', true),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Bank Transfer Details
    |--------------------------------------------------------------------------
    |
    | Bank account details for manual transfers.
    |
    */
    'bank_transfer' => [
        'bank_name' => env('BANK_NAME', 'Attijariwafa Bank'),
        'account_name' => env('BANK_ACCOUNT_NAME', 'SOLD MARKETPLACE'),
        'account_number' => env('BANK_ACCOUNT_NUMBER'),
        'rib' => env('BANK_RIB'),
    ],
];
