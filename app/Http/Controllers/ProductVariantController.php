<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductVariantController extends Controller
{
    public function index(Product $product): Response
    {
        $variants = $product->variants;
        return Inertia::render('ProductVariants/Index', compact('product', 'variants'));
    }

    public function create(Product $product): Response
    {
        return Inertia::render('ProductVariants/Create', compact('product'));
    }

    public function store(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $product->variants()->create($request->all());
        return redirect()->route('variants.index', $product->id)->with('success', 'Variant created successfully.');
    }

    public function edit(Product $product, ProductVariant $variant): Response
    {
        return Inertia::render('ProductVariants/Edit', compact('product', 'variant'));
    }

    public function update(Request $request, Product $product, ProductVariant $variant)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $variant->update($request->all());
        return redirect()->route('variants.index', $product->id)->with('success', 'Variant updated successfully.');
    }

    public function destroy(Product $product, ProductVariant $variant)
    {
        $variant->delete();
        return redirect()->route('variants.index', $product->id)->with('success', 'Variant deleted successfully.');
    }
}
