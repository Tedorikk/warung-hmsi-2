<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Middleware\RedirectIfNotAdmin;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Rute khusus admin
Route::middleware(['auth', 'verified', RedirectIfNotAdmin::class])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    // Products Categories
    Route::resource('product-categories', ProductCategoryController::class)->except(['show']);
    // Products
    Route::resource('products', ProductController::class);
    // Product Variants
    Route::resource('product-variants', ProductVariantController::class)->except(['show']);
    // Orders
    Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index'])->name('admin.orders.index');
    Route::get('/orders/create', [App\Http\Controllers\Admin\OrderController::class, 'create'])->name('admin.orders.create');
    Route::post('/orders', [App\Http\Controllers\Admin\OrderController::class, 'store'])->name('admin.orders.store');
    Route::get('/orders/{id}', [App\Http\Controllers\Admin\OrderController::class, 'show'])->name('admin.orders.show');
    Route::patch('/orders/{id}', [App\Http\Controllers\Admin\OrderController::class, 'update'])->name('admin.orders.update');
    Route::delete('/orders/{id}', [App\Http\Controllers\Admin\OrderController::class, 'destroy'])->name('admin.orders.destroy');
});

// Rute untuk semua pengguna terautentikasi
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    
    // Tambahkan rute show products untuk semua user
    Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'addToCart'])->name('cart.add');
    Route::patch('/cart/{id}', [CartController::class, 'updateCartItem'])->name('cart.update');
    Route::delete('/cart/{id}', [CartController::class, 'removeFromCart'])->name('cart.remove');
    Route::post('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');
    Route::post('/checkout', [OrderController::class, 'checkout'])->name('checkout.process');

    Route::get('/history', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/history/{id}', [OrderController::class, 'show'])->name('orders.show');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
