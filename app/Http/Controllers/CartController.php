<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use App\Models\Order;

class CartController extends Controller
{
    public function index(): Response
    {
        $cart = Cart::where('user_id', Auth::id())
                    ->with('items.productVariant.product')
                    ->first();
        
        if ($cart) {
            $cart->items->each(function ($item) {
                if ($item->productVariant && $item->productVariant->product && $item->productVariant->product->image) {
                    $item->productVariant->product->image = Storage::url($item->productVariant->product->image);
                }
            });
        }
    
        return Inertia::render('cart', [
            'cartItems' => $cart ? $cart->items : []
        ]);
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $productVariant = ProductVariant::findOrFail($request->product_variant_id);

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_variant_id', $productVariant->id)
            ->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => $cartItem->quantity + $request->quantity
            ]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_variant_id' => $productVariant->id,
                'quantity' => $request->quantity,
                'price' => $productVariant->price
            ]);
        }

        return redirect()->route('cart.index');
    }

    public function removeFromCart($id)
    {
        $cartItem = CartItem::findOrFail($id);
        
        if ($cartItem->cart->user_id !== Auth::id()) {
            return redirect()->route('cart.index')->withErrors(['error' => 'Unauthorized']);
        }

        $cartItem->delete();

        return redirect()->route('cart.index');
    }

    public function updateCartItem(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::findOrFail($id);

        if ($cartItem->cart->user_id !== Auth::id()) {
            return redirect()->route('cart.index')->withErrors(['error' => 'Unauthorized']);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return redirect()->route('cart.index');
    }

    public function clearCart()
    {
        $cart = Cart::where('user_id', Auth::id())->first();

        if ($cart) {
            $cart->items()->delete();
        }

        return redirect()->route('cart.index');
    }
}
