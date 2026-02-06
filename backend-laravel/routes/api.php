<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthOTPController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->middleware('auth:sanctum');

// Google Login endpoint (proxy or impl)
Route::post('/auth/google-login', [\App\Http\Controllers\AuthController::class, 'googleLogin']);
Route::post('/forgot-password', [\App\Http\Controllers\AuthController::class, 'forgotPassword']);

// OTP Auth Routes
Route::prefix('auth/otp')->group(function () {
    Route::post('/send', [AuthOTPController::class, 'sendOTP']);
    Route::post('/verify', [AuthOTPController::class, 'verifyOTP']);
});


Route::post('listings/{id}/favorite', [\App\Http\Controllers\Api\ListingController::class, 'toggleFavorite'])->middleware('auth:sanctum');
Route::apiResource('listings', \App\Http\Controllers\Api\ListingController::class);
Route::post('listings/{id}/view', [\App\Http\Controllers\Api\ListingController::class, 'recordView']);
Route::post('listings/{id}/pause', [\App\Http\Controllers\Api\ListingController::class, 'pause'])->middleware('auth:sanctum');
Route::get('categories/homepage', [\App\Http\Controllers\CategoryController::class, 'homepage']);
Route::get('categories', [\App\Http\Controllers\CategoryController::class, 'index']);
Route::apiResource('cities', \App\Http\Controllers\CityController::class);
Route::get('listings/category/{category}', [\App\Http\Controllers\Api\ListingController::class, 'getByCategory']);
Route::get('homepage/listings', [\App\Http\Controllers\Api\ListingController::class, 'homepage']);
Route::get('settings', [\App\Http\Controllers\SettingController::class, 'index']);
Route::get('users/{id}/profile', [\App\Http\Controllers\UserController::class, 'getProfile']);

// Dashboard Routes (for user dashboard)
Route::prefix('dashboard')->middleware('auth:sanctum')->group(function () {
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
    Route::post('webhook/{method}', [\App\Http\Controllers\PaymentController::class, 'webhook']);
});

// Authenticated wallet routes
Route::prefix('wallet')->middleware('auth:sanctum')->group(function () {
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
    ->middleware('auth:sanctum');

// =============================================
// MESSAGING ROUTES
// =============================================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('messages/unread-count', [\App\Http\Controllers\Api\MessageController::class, 'unreadCount']);
    Route::get('messages', [\App\Http\Controllers\Api\MessageController::class, 'index']);
    Route::get('messages/{userId}', [\App\Http\Controllers\Api\MessageController::class, 'show']);
    Route::post('messages', [\App\Http\Controllers\Api\MessageController::class, 'store']);
});

// =============================================
// ADMIN ROUTES
// =============================================

Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // Dashboard Stats (Frontend calls /admin/stats)
    Route::get('stats', [\App\Http\Controllers\DashboardController::class, 'getAdminStats']);
    Route::get('activity', [\App\Http\Controllers\DashboardController::class, 'getActivity']);
    Route::get('performance', [\App\Http\Controllers\DashboardController::class, 'getPerformance']);

    // Admin Listings
    Route::get('listings', [\App\Http\Controllers\Api\ListingController::class, 'adminIndex']);
    Route::post('listings/{id}/approve', [\App\Http\Controllers\Api\ListingController::class, 'approve']);
    Route::post('listings/{id}/reject', [\App\Http\Controllers\Api\ListingController::class, 'reject']);

    Route::post('categories/bulk-homepage', [\App\Http\Controllers\CategoryController::class, 'bulkUpdateHomepage']);
    Route::post('settings/bulk', [\App\Http\Controllers\SettingController::class, 'bulkUpdate']);
    Route::apiResource('categories', \App\Http\Controllers\CategoryController::class);
    Route::apiResource('users', \App\Http\Controllers\Admin\AdminUserController::class);

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
    Route::post('coupons', [\App\Http\Controllers\Admin\AdminCouponController::class, 'store']);
    Route::get('coupons/{id}', [\App\Http\Controllers\Admin\AdminCouponController::class, 'show']);
    Route::put('coupons/{id}', [\App\Http\Controllers\Admin\AdminCouponController::class, 'update']);
    Route::delete('coupons/{id}', [\App\Http\Controllers\Admin\AdminCouponController::class, 'destroy']);
    Route::post('coupons/{id}/toggle', [\App\Http\Controllers\Admin\AdminCouponController::class, 'toggle']);
    
    // Payment Methods
    Route::get('payment-methods', [\App\Http\Controllers\Admin\AdminPaymentMethodController::class, 'index']);
    Route::put('payment-methods/{id}', [\App\Http\Controllers\Admin\AdminPaymentMethodController::class, 'update']);
    Route::post('payment-methods/{id}/toggle', [\App\Http\Controllers\Admin\AdminPaymentMethodController::class, 'toggle']);
});

