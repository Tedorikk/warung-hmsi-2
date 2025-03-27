<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Get featured products (newest 4 products that are active)
        $featuredProducts = Product::with(['category', 'variants'])
            ->where('is_active', true)
            ->latest()
            ->take(4)
            ->get();
            
        // Transform image URLs for featured products
        foreach ($featuredProducts as $product) {
            if ($product->image) {
                $product->image = Storage::url($product->image);
            }
        }
            
        // Get all product categories with count
        $categories = ProductCategory::withCount('products')
            ->get();
            
        // Get products grouped by category for the main section
        $productsByCategory = ProductCategory::with(['products' => function($query) {
                $query->where('is_active', true)
                    ->with('variants')
                    ->take(8);
            }])
            ->get();
        
        // Transform image URLs for products by category
        foreach ($productsByCategory as $category) {
            if ($category->products) {
                foreach ($category->products as $product) {
                    if ($product->image) {
                        $product->image = Storage::url($product->image);
                    }
                }
            }
        }
        
        return Inertia::render('home', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'productsByCategory' => $productsByCategory
        ]);
    }
}
