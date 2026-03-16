<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// Auth Routes
$routes->match(['get', 'post'], 'login', 'Auth::login');
$routes->match(['get', 'post'], 'register', 'Auth::register');
$routes->get('logout', 'Auth::logout');

// Listings Routes
$routes->get('annonces', 'Listing::index');
$routes->get('annonce/(:any)', 'Listing::show/$1');

// Dashboard Routes
$routes->get('tableau-de-bord', 'Dashboard::index');
$routes->get('profil', 'Dashboard::profile');

// Admin Routes
$routes->group('admin', function($routes) {
    $routes->get('/', 'AdminDashboard::index');
});

// Language Route
$routes->get('lang/(:segment)', 'Language::index/$1');
