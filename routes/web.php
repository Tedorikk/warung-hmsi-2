<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Middleware\RedirectIfNotAdmin;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\ProductCategoryController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', RedirectIfNotAdmin::class])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    // Products Categories
    Route::resource('product-categories', ProductCategoryController::class)->except(['show']);
    // Products
    Route::resource('products', ProductController::class)->except(['show']);
    // Product Variants
    Route::resource('product-variants', ProductVariantController::class)->except(['show']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
