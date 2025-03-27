<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // Get current date and time
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // Sales analytics
        $totalSales = Order::where('status', 'completed')
            ->where('payment_status', 'paid')
            ->sum('total_amount');

        $monthlySales = Order::where('status', 'completed')
            ->where('payment_status', 'paid')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('total_amount');

        $lastMonthSales = Order::where('status', 'completed')
            ->where('payment_status', 'paid')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('total_amount');

        $salesGrowth = $lastMonthSales > 0 
            ? (($monthlySales - $lastMonthSales) / $lastMonthSales) * 100 
            : 100;

        // Order analytics
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $completedOrders = Order::where('status', 'completed')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();

        // Product analytics
        $totalProducts = Product::count();
        $activeProducts = Product::where('is_active', true)->count();
        $inactiveProducts = Product::where('is_active', false)->count();
        $lowStockProducts = Product::whereHas('variants', function ($query) {
            $query->where('stock', '<', 10);
        })->count();

        // User analytics
        $totalUsers = User::count();
        $newUsers = User::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();

        // Category analytics
        $categoriesWithProductCount = ProductCategory::withCount('products')->get();

        // Sales over time (last 6 months)
        $salesOverTime = $this->getSalesOverTime();

        // Top selling products
        $topSellingProducts = $this->getTopSellingProducts();

        // Recent orders
        $recentOrders = Order::with(['user', 'items.productVariant.product'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'analytics' => [
                'sales' => [
                    'total' => $totalSales,
                    'monthly' => $monthlySales,
                    'growth' => round($salesGrowth, 2),
                ],
                'orders' => [
                    'total' => $totalOrders,
                    'pending' => $pendingOrders,
                    'completed' => $completedOrders,
                    'cancelled' => $cancelledOrders,
                ],
                'products' => [
                    'total' => $totalProducts,
                    'active' => $activeProducts,
                    'inactive' => $inactiveProducts,
                    'lowStock' => $lowStockProducts,
                ],
                'users' => [
                    'total' => $totalUsers,
                    'new' => $newUsers,
                ],
                'categories' => $categoriesWithProductCount,
                'salesOverTime' => $salesOverTime,
                'topSellingProducts' => $topSellingProducts,
                'recentOrders' => $recentOrders,
            ]
        ]);
    }

    /**
     * Get sales data over the last 6 months
     */
    private function getSalesOverTime()
    {
        $months = collect([]);
        $salesData = collect([]);

        // Get the last 6 months
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months->push($date->format('M'));

            $startOfMonth = $date->copy()->startOfMonth();
            $endOfMonth = $date->copy()->endOfMonth();

            $monthlySales = Order::where('status', 'completed')
                ->where('payment_status', 'paid')
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->sum('total_amount');

            $salesData->push($monthlySales);
        }

        return [
            'labels' => $months->toArray(),
            'data' => $salesData->toArray(),
        ];
    }

    /**
     * Get top selling products
     */
    private function getTopSellingProducts()
    {
        return DB::table('order_items')
            ->join('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->select(
                'products.id',
                'products.name',
                'products.image',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.subtotal) as total_sales')
            )
            ->groupBy('products.id', 'products.name', 'products.image')
            ->orderBy('total_quantity', 'desc')
            ->take(5)
            ->get();
    }
}
