<?php

use Backend\Http\Controllers\DashboardController;

Route::middleware('access-backend')->group( function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});