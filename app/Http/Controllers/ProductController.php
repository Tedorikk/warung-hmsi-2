<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\ProductCategory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::query()->with('category', 'variants');
        
        // Apply search filter
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        // Apply category filter
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        // Apply active status filter if needed
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        
        $perPage = $request->input('per_page', 10);
        $products = $query->latest()->paginate($perPage)->withQueryString();
        
        // Transform product data to include proper image URL
        $products->getCollection()->transform(function ($product) {
            if ($product->image) {
                $product->image = Storage::url($product->image);
            }
            return $product;
        });
        
        $categories = ProductCategory::all();
        
        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id', 'is_active']),
            'perPage' => $perPage,
        ]);
    }

    public function create(): Response
    {
        $categories = ProductCategory::all();
        return Inertia::render('products/create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'variants' => 'nullable|array',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.stock' => 'required|integer|min:0',
        ]);
    
        $data = $request->except('variants');
    
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $data['image'] = $path;
        }
    
        // Create the product
        $product = Product::create($data);
        
        // Create variants if they exist
        if ($request->has('variants')) {
            foreach ($request->variants as $variantData) {
                $product->variants()->create($variantData);
            }
        }
    
        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        $categories = ProductCategory::all();
        
        // Add image URL for preview
        if ($product->image) {
            $product->image_url = Storage::url($product->image);
        }
        
        // Load variants
        $product->load('variants');
        
        return Inertia::render('products/edit', compact('product', 'categories'));
    }

    public function update(Request $request, Product $product)
    {
        // Debug untuk melihat data yang diterima
        Log::info('Request data:', $request->all());
        
        $request->validate([
            'category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:255',
            'slug' => "required|string|unique:products,slug,{$product->id}",
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'variants' => 'nullable|array',
            'variants.*.id' => 'nullable|exists:product_variants,id',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.stock' => 'required|integer|min:0',
        ]);
    
        $data = $request->except(['_method', 'variants']); // Hapus field _method dan variants
    
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            
            $path = $request->file('image')->store('images', 'public');
            $data['image'] = $path;
        } else {
            // Jika tidak ada file baru, pertahankan gambar lama
            unset($data['image']);
        }
    
        $product->update($data);
        
        // Handle variants
        if ($request->has('variants')) {
            // Get existing variant IDs
            $existingVariantIds = $product->variants->pluck('id')->toArray();
            $updatedVariantIds = collect($request->variants)
                ->pluck('id')
                ->filter()
                ->toArray();
            
            // Delete variants that are not in the updated list
            $variantsToDelete = array_diff($existingVariantIds, $updatedVariantIds);
            if (!empty($variantsToDelete)) {
                $product->variants()->whereIn('id', $variantsToDelete)->delete();
            }
            
            // Update or create variants
            foreach ($request->variants as $variantData) {
                if (isset($variantData['id'])) {
                    // Update existing variant
                    $product->variants()->find($variantData['id'])->update($variantData);
                } else {
                    // Create new variant
                    $product->variants()->create($variantData);
                }
            }
        } else {
            // If no variants are submitted, delete all existing variants
            $product->variants()->delete();
        }
        
        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        // Delete image if exists
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }
        
        $product->variants()->delete();
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }

    public function show(Product $product): Response
    {
        $product->load(['variants', 'category']);
        
        // Add image URL
        if ($product->image) {
            $product->image = Storage::url($product->image);
        }
        
        return Inertia::render('products/show', compact('product'));
    }
}
