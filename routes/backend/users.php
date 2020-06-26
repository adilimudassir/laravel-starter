<?php

use Backend\Http\Controllers\UserController;

Route::group(['prefix' => 'users', 'as' => 'users.'], function () {
    Route::get('', [UserController::class, 'index'])->name('index');
    Route::get('/create', [UserController::class, 'create'])->name('create');
    Route::post('/store', [UserController::class, 'store'])->name('store');
    Route::get('/show/{id}', [UserController::class, 'show'])->name('show');
    Route::get('/edit/{id}', [UserController::class, 'edit'])->name('edit');
    Route::patch('/update/{id}', [UserController::class, 'update'])->name('update');
    Route::delete('/destroy/{id}', [UserController::class, 'destroy'])->name('delete');
});