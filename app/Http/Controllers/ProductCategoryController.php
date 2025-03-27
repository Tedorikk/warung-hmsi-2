<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\Controller;
use Illuminate\Support\Facades\Log;



class ProductCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10); // Default to 10 items per page
        
        $categories = ProductCategory::query()
            ->withCount('products')
            ->when($search, function($query, $search) {
                return $query->where('name', 'LIKE', "%{$search}%")
                             ->orWhere('slug', 'LIKE', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
        
        return Inertia::render('product-categories/index', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ]
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('product-categories/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:product_categories,slug',
            'description' => 'nullable|string',
        ]);

        ProductCategory::create($request->all());
        return redirect()->route('product-categories.index')->with('success', 'Category created successfully.');
    }

    public function edit($id)
    {
        $category = ProductCategory::findOrFail($id);
        return Inertia::render('product-categories/edit', [
            'category' => $category
        ]);
    }

    public function update(Request $request, ProductCategory $productCategory)
    {
        Log::info('Update method called', [
            'request_data' => $request->all(),
            'product_category_id' => $productCategory->id
        ]);
        // Validasi
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:product_categories,slug,' . $productCategory->id,
            'description' => 'nullable|string',
        ]);
    
        // Update
        $productCategory->update($validated);
    
        // Debug - tambahkan ini untuk melihat apakah method dipanggil
        Log::info('ProductCategory updated', ['id' => $productCategory->id, 'data' => $validated]);
    
        // Response
        return redirect()->route('product-categories.index')->with('success', 'Category edited successfully.');
    }

    public function destroy(ProductCategory $productCategory)
    {
        $productCategory->delete();
        return redirect()->route('product-categories.index')->with('success', 'Category deleted successfully.');
    }
}
