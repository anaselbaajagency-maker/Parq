<?php

use App\Http\Controllers\SecureFileController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'app');

Route::get('/secure/topup-proofs/{topUpRequest}', [SecureFileController::class, 'topUpProof'])
    ->name('secure.topup-proof')
    ->middleware('signed');

Route::view('/{path}', 'app')
    ->where('path', '^(?!api|secure).*$');
