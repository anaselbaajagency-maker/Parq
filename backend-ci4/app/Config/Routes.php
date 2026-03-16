<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', ['namespace' => 'App\Controllers\Api'], function($routes) {
    // Public Routes
    $routes->post('login', 'AuthController::login');
    $routes->post('register', 'AuthController::register');
    $routes->post('auth/google-login', 'AuthController::googleLogin');
    $routes->post('forgot-password', 'AuthController::forgotPassword');
    
    // OTP Routes
    $routes->group('auth/otp', function($routes) {
        $routes->post('send', 'AuthOTPController::sendOTP');
        $routes->post('verify', 'AuthOTPController::verifyOTP');
    });

    // Listings (Public)
    $routes->get('listings', 'ListingController::index');
    $routes->get('listings/(:any)', 'ListingController::show/$1');
    $routes->get('listings/category/(:any)', 'ListingController::getByCategory/$1');
    $routes->get('homepage/listings', 'ListingController::homepage');
    $routes->post('listings/(:any)/view', 'ListingController::recordView/$1');

    // Categories & Cities (Public)
    $routes->get('categories', 'CategoryController::index');
    $routes->get('categories/homepage', 'CategoryController::homepage');
    $routes->get('cities', 'CityController::index');
    $routes->get('settings', 'SettingController::index');

    // Protected Routes
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->get('user', 'AuthController::user');
        $routes->post('logout', 'AuthController::logout');
        $routes->delete('account', 'AccountController::destroy');

        // Listings (Protected)
        $routes->post('listings', 'ListingController::store');
        $routes->match(['put', 'patch'], 'listings/(:num)', 'ListingController::update/$1');
        $routes->delete('listings/(:num)', 'ListingController::destroy/$1');
        $routes->post('listings/(:num)/favorite', 'ListingController::toggleFavorite/$1');
        $routes->post('listings/(:num)/pause', 'ListingController::pause/$1');

        // Dashboard
        $routes->group('dashboard', function($routes) {
            $routes->get('stats', 'DashboardController::getStats');
            $routes->get('activity', 'DashboardController::getActivity');
            $routes->get('performance', 'DashboardController::getPerformance');
        });

        // Wallet
        $routes->group('wallet', function($routes) {
            $routes->get('balance', 'WalletController::balance');
            $routes->get('summary', 'WalletController::summary');
            $routes->get('transactions', 'WalletController::transactions');
            $routes->get('payment-methods', 'WalletController::paymentMethods');
            $routes->get('topup-requests', 'WalletController::topupRequests');
            $routes->post('topup', 'WalletController::topup');
            $routes->post('topup/(:num)/proof', 'WalletController::uploadProof/$1');
            $routes->delete('topup-requests/(:num)', 'WalletController::cancelTopupRequest/$1');
            $routes->post('redeem-coupon', 'WalletController::redeemCoupon');
        });

        // Messages
        $routes->group('messages', function($routes) {
            $routes->get('unread-count', 'MessageController::unreadCount');
            $routes->get('', 'MessageController::index');
            $routes->get('(:num)', 'MessageController::show/$1');
            $routes->post('', 'MessageController::store');
        });

        // Admin Routes
        $routes->group('admin', ['filter' => 'admin'], function($routes) {
            $routes->get('stats', 'DashboardController::getAdminStats');
            $routes->get('listings', 'ListingController::adminIndex');
            $routes->post('listings/(:num)/approve', 'ListingController::approve/$1');
            $routes->post('listings/(:num)/reject', 'ListingController::reject/$1');
            
            $routes->resource('categories', ['controller' => 'CategoryController']);
            $routes->resource('users', ['controller' => 'Admin\AdminUserController']);
            
            $routes->get('topups', 'Admin\AdminWalletController::index');
            $routes->get('topups/pending', 'Admin\AdminWalletController::pending');
            $routes->post('topups/(:num)/approve', 'Admin\AdminWalletController::approve/$1');
            $routes->post('topups/(:num)/reject', 'Admin\AdminWalletController::reject/$1');
        });
    });
});

// V1 Prefix Support
$routes->group('api/v1', function($routes) {
    // Duplicate API routes or use redirect? Let's keep it simple and just group them.
    // For a cleaner solution, we could extract the API routes into a closure or a separate file.
});

