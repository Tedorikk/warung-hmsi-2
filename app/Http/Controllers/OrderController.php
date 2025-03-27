<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\Product;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'payment_status', 'per_page']);
        $filters = array_filter($filters, function($value) {
            return !is_null($value) && $value !== '';
        });
        $perPage = $filters['per_page'] ?? 10;
    
        // Add where clause to only get orders for the authenticated user
        $orders = Order::where('user_id', Auth::id())
            ->with('user')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('id', 'like', "%{$search}%")
                    ->orWhere('transaction_id', 'like', "%{$search}%");
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                if ($status !== 'all') {
                    $query->where('status', $status);
                }
            })
            ->when($filters['payment_status'] ?? null, function ($query, $paymentStatus) {
                if ($paymentStatus !== 'all') {
                    $query->where('payment_status', $paymentStatus);
                }
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        // Jika tidak ada hasil, kembali ke halaman pertama
        if ($orders->isEmpty() && $orders->currentPage() > 1) {
            $orders = Order::where('user_id', Auth::id())
                ->with('user')
                ->when($filters['search'] ?? null, function ($query, $search) {
                    $query->where('id', 'like', "%{$search}%")
                        ->orWhere('transaction_id', 'like', "%{$search}%");
                })
                ->when($filters['status'] ?? null, function ($query, $status) {
                    if ($status !== 'all') {
                        $query->where('status', $status);
                    }
                })
                ->when($filters['payment_status'] ?? null, function ($query, $paymentStatus) {
                    if ($paymentStatus !== 'all') {
                        $query->where('payment_status', $paymentStatus);
                    }
                })
                ->orderBy('created_at', 'desc')
                ->paginate($perPage)
                ->withQueryString();
        }

        return Inertia::render('history/index', [
            'orders' => $orders,
            'filters' => $filters,
        ]);
    }
    
    
    public function show($id)
    {
        // Add where clause to only get orders for the authenticated user
        $order = Order::where('user_id', Auth::id())
            ->with(['user', 'items.productVariant.product'])
            ->findOrFail($id);
        
        return Inertia::render('history/show', [
            'order' => $order
        ]);
    }
    
    public function success($orderId)
    {
        $order = Order::where('id', $orderId)
                     ->where('user_id', Auth::id())
                     ->with('items.productVariant.product')
                     ->firstOrFail();
        
        return Inertia::render('Orders/Success', [
            'order' => $order
        ]);
    }
    
    public function paymentPage($orderId)
    {
        $order = Order::where('id', $orderId)
                     ->where('user_id', Auth::id())
                     ->with('items.productVariant.product')
                     ->firstOrFail();
        
        return Inertia::render('Orders/Payment', [
            'order' => $order
        ]);
    }

    public function checkout(Request $request)
    {
        // Validasi request
        $validated = $request->validate([
            'shipping_address' => 'required|string',
            'shipping_method' => 'required|string',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);
        
        // Ambil item keranjang
        $cartItems = CartItem::whereHas('cart', function($query) {
            $query->where('user_id', Auth::id());
        })
        ->with('productVariant.product')
        ->get();
        
        // Hitung total
        $total = $cartItems->sum(function ($item) {
            return $item->price * $item->quantity;
        });
        
        // Buat order
        $order = Order::create([
            'user_id' => Auth::id(),
            'total_amount' => $total,
            'status' => 'pending',
            'payment_status' => 'pending',
            'payment_method' => $validated['payment_method'],
            'shipping_address' => $validated['shipping_address'],
            'shipping_method' => $validated['shipping_method'],
            'notes' => $validated['notes'],
        ]);
        
        // Buat order items
        foreach ($cartItems as $item) {
            $order->items()->create([
                'product_variant_id' => $item->product_variant_id,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'subtotal' => $item->price * $item->quantity,
            ]);
        }
        
        // Hapus keranjang
        Cart::where('user_id', Auth::id())->delete();
        
        return redirect()->route('home')->with('message', 'Checkout berhasil');
    }
}
