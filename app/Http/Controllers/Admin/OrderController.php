<?php

namespace App\Http\Controllers\Admin;

use App\Models\Order;
use App\Models\User;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'payment_status', 'per_page']);
        $filters = array_filter($filters, function($value) {
            return !is_null($value) && $value !== '';
        });
        $perPage = $filters['per_page'] ?? 10;
    
        $orders = Order::with('user')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('id', 'like', "%{$search}%")
                    ->orWhere('transaction_id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
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
            $orders = Order::with('user')
                ->when($filters['search'] ?? null, function ($query, $search) {
                    $query->where('id', 'like', "%{$search}%")
                        ->orWhere('transaction_id', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
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

    
        return Inertia::render('orders/index', [
            'orders' => $orders,
            'filters' => $filters,
        ]);
    }
    
    
    public function show($id)
    {
        $order = Order::with(['user', 'items.productVariant.product'])
            ->findOrFail($id);
        
        return Inertia::render('orders/show', [
            'order' => $order
        ]);
    }
    
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|string',
            'payment_status' => 'required|string',
            'notes' => 'nullable|string',
        ]);
        
        $order->update($validated);
        
        return redirect()->back()->with('success', 'Order updated successfully');
    }
}
