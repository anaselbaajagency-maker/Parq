<?php

use App\Http\Controllers\AuthOTPController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

$registerApiRoutes = function (): void {
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware(['auth:sanctum', 'throttle:api-general']);

    Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register'])
        ->middleware('throttle:auth-register');
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login'])
        ->middleware('throttle:auth-login');
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::delete('/account', [\App\Http\Controllers\Api\AccountController::class, 'destroy'])->middleware('auth:sanctum');

    // Google Login endpoint (proxy or impl)
    Route::post('/auth/google-login', [\App\Http\Controllers\AuthController::class, 'googleLogin'])
        ->middleware('throttle:auth-login');
    Route::post('/forgot-password', [\App\Http\Controllers\AuthController::class, 'forgotPassword'])
        ->middleware('throttle:password-reset');

    // OTP Auth Routes
    Route::prefix('auth/otp')->group(function () {
        Route::post('/send', [AuthOTPController::class, 'sendOTP'])->middleware('throttle:otp-send');
        Route::post('/verify', [AuthOTPController::class, 'verifyOTP'])->middleware('throttle:otp-verify');
    });

    // Email Verification Routes
    Route::middleware(['auth:sanctum', 'throttle:api-general'])->group(function () {
        Route::post('/email/verify/send', [\App\Http\Controllers\EmailVerificationController::class, 'send']);
        Route::post('/email/verify/check', [\App\Http\Controllers\EmailVerificationController::class, 'verify']);
    });

    Route::post('listings/{id}/favorite', [\App\Http\Controllers\Api\ListingController::class, 'toggleFavorite'])
        ->middleware(['auth:sanctum', 'throttle:listings-write']);

    Route::get('listings', [\App\Http\Controllers\Api\ListingController::class, 'index'])
        ->middleware('throttle:listings-read');
    Route::get('listings/{listing}', [\App\Http\Controllers\Api\ListingController::class, 'show'])
        ->middleware('throttle:listings-read');

    Route::middleware(['auth:sanctum', 'throttle:listings-write'])->group(function () {
        Route::post('listings', [\App\Http\Controllers\Api\ListingController::class, 'store']);
        Route::match(['put', 'patch'], 'listings/{id}', [\App\Http\Controllers\Api\ListingController::class, 'update']);
        Route::delete('listings/{id}', [\App\Http\Controllers\Api\ListingController::class, 'destroy']);
    });
    Route::post('listings/{id}/view', [\App\Http\Controllers\Api\ListingController::class, 'recordView'])
        ->middleware('throttle:listings-read');
    Route::post('listings/{id}/pause', [\App\Http\Controllers\Api\ListingController::class, 'pause'])
        ->middleware(['auth:sanctum', 'throttle:listings-write']);
    Route::get('categories/homepage', [\App\Http\Controllers\CategoryController::class, 'homepage'])
        ->middleware('throttle:api-general');
    Route::get('categories', [\App\Http\Controllers\CategoryController::class, 'index'])
        ->middleware('throttle:api-general');
    Route::apiResource('cities', \App\Http\Controllers\CityController::class)
        ->middleware('throttle:api-general');
    Route::get('listings/category/{category}', [\App\Http\Controllers\Api\ListingController::class, 'getByCategory'])
        ->middleware('throttle:listings-read');
    Route::get('homepage/listings', [\App\Http\Controllers\Api\ListingController::class, 'homepage'])
        ->middleware('throttle:listings-read');
    Route::get('settings', [\App\Http\Controllers\SettingController::class, 'index'])
        ->middleware('throttle:api-general');
    Route::get('users/{id}/profile', [\App\Http\Controllers\UserController::class, 'getProfile']);
    Route::put('profile', [\App\Http\Controllers\UserController::class, 'updateProfile'])
        ->middleware('auth:sanctum');
    Route::post('profile/avatar', [\App\Http\Controllers\UserController::class, 'updateAvatar'])
        ->middleware('auth:sanctum');
    Route::post('profile/change-password', [\App\Http\Controllers\UserController::class, 'changePassword'])
        ->middleware('auth:sanctum');

    // Two-Factor Authentication Routes (Authenticated)
    Route::prefix('auth/2fa')->middleware('auth:sanctum')->group(function () {
        Route::get('status', [\App\Http\Controllers\TwoFactorAuthController::class, 'status']);
        Route::post('enable', [\App\Http\Controllers\TwoFactorAuthController::class, 'enable']);
        Route::post('confirm', [\App\Http\Controllers\TwoFactorAuthController::class, 'confirm']);
        Route::post('disable', [\App\Http\Controllers\TwoFactorAuthController::class, 'disable']);
    });

    // Session Management Routes (Authenticated)
    Route::prefix('profile/sessions')->middleware('auth:sanctum')->group(function () {
        Route::get('/', [\App\Http\Controllers\SessionController::class, 'index']);
        Route::delete('/{id}', [\App\Http\Controllers\SessionController::class, 'destroy']);
        Route::post('/revoke-others', [\App\Http\Controllers\SessionController::class, 'revokeOthers']);
    });

    // Dashboard Routes (for user dashboard)
    Route::prefix('dashboard')->middleware(['auth:sanctum', 'throttle:api-general'])->group(function () {
        Route::get('stats', [\App\Http\Controllers\DashboardController::class, 'getStats']);
        Route::get('activity', [\App\Http\Controllers\DashboardController::class, 'getActivity']);
        Route::get('performance', [\App\Http\Controllers\DashboardController::class, 'getPerformance']);
    });

    // =============================================
    // WALLET & PAYMENT ROUTES
    // =============================================

    // Public payment callbacks (no auth required)
    Route::prefix('payments')->group(function () {
        Route::get('callback/{method}/success', [\App\Http\Controllers\PaymentController::class, 'callbackSuccess']);
        Route::get('callback/{method}/fail', [\App\Http\Controllers\PaymentController::class, 'callbackFail']);
        Route::post('webhook/{method}', [\App\Http\Controllers\PaymentController::class, 'webhook'])
            ->middleware('throttle:payments-webhook');
    });

    // Authenticated wallet routes
    Route::prefix('wallet')->middleware(['auth:sanctum', 'throttle:wallet-actions'])->group(function () {
        Route::get('balance', [\App\Http\Controllers\WalletController::class, 'balance']);
        Route::get('summary', [\App\Http\Controllers\WalletController::class, 'summary']);
        Route::get('transactions', [\App\Http\Controllers\WalletController::class, 'transactions']);
        Route::get('payment-methods', [\App\Http\Controllers\WalletController::class, 'paymentMethods']);
        Route::get('topup-requests', [\App\Http\Controllers\WalletController::class, 'topupRequests']);

        Route::post('topup', [\App\Http\Controllers\WalletController::class, 'topup']);
        Route::post('topup/{id}/proof', [\App\Http\Controllers\WalletController::class, 'uploadProof']);
        Route::delete('topup-requests/{id}', [\App\Http\Controllers\WalletController::class, 'cancelTopupRequest']);
        Route::post('redeem-coupon', [\App\Http\Controllers\WalletController::class, 'redeemCoupon']);
    });

    // Authenticated payment status
    Route::get('payments/status/{reference}', [\App\Http\Controllers\PaymentController::class, 'status'])
        ->middleware(['auth:sanctum', 'throttle:wallet-actions']);

    // =============================================
    // MESSAGING & NOTIFICATIONS ROUTES
    // =============================================
    Route::middleware(['auth:sanctum', 'throttle:messages-actions'])->group(function () {
        Route::get('messages/unread-count', [\App\Http\Controllers\Api\MessageController::class, 'unreadCount']);
        Route::get('messages', [\App\Http\Controllers\Api\MessageController::class, 'index']);
        Route::get('messages/{userId}', [\App\Http\Controllers\Api\MessageController::class, 'show']);
        Route::post('messages', [\App\Http\Controllers\Api\MessageController::class, 'store']);

        // Notifications
        Route::get('notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
        Route::post('notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
        Route::post('notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    });

    // =============================================
    // ADMIN ROUTES
    // =============================================

    Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin', 'throttle:admin-actions'])->group(function () {
        // Dashboard Stats (Frontend calls /admin/stats)
        Route::get('stats', [\App\Http\Controllers\DashboardController::class, 'getAdminStats']);
        Route::get('activity', [\App\Http\Controllers\DashboardController::class, 'getActivity']);
        Route::get('performance', [\App\Http\Controllers\DashboardController::class, 'getPerformance']);

        // Admin Listings
        Route::get('listings', [\App\Http\Controllers\Api\ListingController::class, 'adminIndex']);
        Route::post('listings/bulk-delete', [\App\Http\Controllers\Api\ListingController::class, 'bulkDestroy']);
        Route::post('listings/{id}/approve', [\App\Http\Controllers\Api\ListingController::class, 'approve']);
        Route::post('listings/{id}/reject', [\App\Http\Controllers\Api\ListingController::class, 'reject']);
        Route::post('listings/{id}/toggle-featured', [\App\Http\Controllers\Api\ListingController::class, 'toggleFeatured']);

        // Admin Users
        Route::post('users/bulk-delete', [\App\Http\Controllers\Admin\AdminUserController::class, 'bulkDestroy']);
        Route::apiResource('users', \App\Http\Controllers\Admin\AdminUserController::class);

        // Admin Cities
        Route::post('cities/bulk-delete', [\App\Http\Controllers\CityController::class, 'bulkDestroy']);
        Route::apiResource('cities', \App\Http\Controllers\CityController::class);

        // Admin Categories
        Route::post('categories/bulk-delete', [\App\Http\Controllers\CategoryController::class, 'bulkDestroy']);
        Route::post('categories/bulk-homepage', [\App\Http\Controllers\CategoryController::class, 'bulkUpdateHomepage']);
        Route::apiResource('categories', \App\Http\Controllers\CategoryController::class);

        Route::post('settings/bulk', [\App\Http\Controllers\SettingController::class, 'bulkUpdate']);

        // =============================================
        // ADMIN WALLET & TOP-UP MANAGEMENT
        // =============================================

        // Top-up requests management
        Route::get('topups', [\App\Http\Controllers\Admin\AdminWalletController::class, 'index']);
        Route::get('topups/pending', [\App\Http\Controllers\Admin\AdminWalletController::class, 'pending']);
        Route::get('topups/stats', [\App\Http\Controllers\Admin\AdminWalletController::class, 'stats']);
        Route::get('topups/{id}', [\App\Http\Controllers\Admin\AdminWalletController::class, 'show']);
        Route::post('topups/{id}/approve', [\App\Http\Controllers\Admin\AdminWalletController::class, 'approve']);
        Route::post('topups/{id}/reject', [\App\Http\Controllers\Admin\AdminWalletController::class, 'reject']);

        // Wallet management
        Route::get('wallets/{userId}', [\App\Http\Controllers\Admin\AdminWalletController::class, 'userWallet']);
        Route::post('wallets/{userId}/credit', [\App\Http\Controllers\Admin\AdminWalletController::class, 'manualCredit']);

        // Coupon management
        Route::get('coupons', [\App\Http\Controllers\Admin\AdminCouponController::class, 'index']);
        Route::post('coupons/bulk-delete', [\App\Http\Controllers\Admin\AdminCouponController::class, 'bulkDestroy']);
        Route::post('coupons', [\App\Http\Controllers\Admin\AdminCouponController::class, 'store']);
        Route::get('coupons/{id}', [\App\Http\Controllers\Admin\AdminCouponController::class, 'show']);
        Route::put('coupons/{id}', [\App\Http\Controllers\Admin\AdminCouponController::class, 'update']);
        Route::delete('coupons/{id}', [\App\Http\Controllers\Admin\AdminCouponController::class, 'destroy']);
        Route::post('coupons/{id}/toggle', [\App\Http\Controllers\Admin\AdminCouponController::class, 'toggle']);

        // Payment Methods
        Route::get('payment-methods', [\App\Http\Controllers\Admin\AdminPaymentMethodController::class, 'index']);
        Route::post('payment-methods/bulk-delete', [\App\Http\Controllers\Admin\AdminPaymentMethodController::class, 'bulkDestroy']);
        Route::post('payment-methods', [\App\Http\Controllers\Admin\AdminPaymentMethodController::class, 'store']);
        Route::put('payment-methods/{id}', [\App\Http\Controllers\Admin\AdminPaymentMethodController::class, 'update']);
        Route::delete('payment-methods/{id}', [\App\Http\Controllers\Admin\AdminPaymentMethodController::class, 'destroy']);
        Route::post('payment-methods/{id}/toggle', [\App\Http\Controllers\Admin\AdminPaymentMethodController::class, 'toggle']);
    });
};

Route::middleware('maintenance.access')->group($registerApiRoutes);

// Versioned API entrypoint for mobile/backward-compatible rollout.
Route::prefix('v1')->name('v1.')->middleware('maintenance.access')->group($registerApiRoutes);
