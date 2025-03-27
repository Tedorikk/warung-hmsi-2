import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, ShoppingCartIcon, PackageIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Analytics, TopSellingProduct } from '@/interfaces/analytics';
import { Order } from '@/interfaces/order';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    analytics: Analytics;
}

export default function Dashboard({ analytics }: DashboardProps) {
    const { sales, orders, products, salesOverTime, topSellingProducts, recentOrders } = analytics;
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Sales Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                            <div className={`rounded-full p-1 ${sales.growth >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                {sales.growth >= 0 ? (
                                    <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                ) : (
                                    <ArrowDownIcon className="h-4 w-4 text-red-600" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rp {sales.total.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {sales.growth >= 0 ? '+' : ''}{sales.growth}% from last month
                            </p>
                        </CardContent>
                    </Card>
                    
                    {/* Orders Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{orders.total}</div>
                            <div className="mt-2 flex items-center space-x-2">
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                    {orders.pending} Pending
                                </Badge>
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                    {orders.completed} Completed
                                </Badge>
                                <Badge variant="outline" className="bg-red-100 text-red-800">
                                    {orders.cancelled} Cancelled
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Products Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Products</CardTitle>
                            <PackageIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{products.total}</div>
                            <div className="mt-2">
                                <div className="flex justify-between text-xs">
                                    <span>Active: {products.active}</span>
                                    <span>Low Stock: {products.lowStock}</span>
                                </div>
                                <Progress value={(products.active / products.total) * 100} className="mt-1" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Sales Chart */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Sales Overview</CardTitle>
                            <CardDescription>Monthly sales for the last 6 months</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={salesOverTime.labels.map((month: string, index: number) => ({
                                        name: month,
                                        total: salesOverTime.data[index]
                                    }))}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Sales']}
                                    />
                                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    
                    {/* Top Selling Products */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                            <CardDescription>Products with highest sales</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Sales</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topSellingProducts.map((product: TopSellingProduct) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell className="text-right">{product.total_quantity}</TableCell>
                                            <TableCell className="text-right">
                                                Rp {product.total_sales.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest 5 orders placed on your store</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map((order: Order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>{order.user?.name}</TableCell>
                                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <OrderStatusBadge status={order.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            Rp {order.total_amount.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

// Komponen helper untuk menampilkan badge status order
interface OrderStatusBadgeProps {
    status: string;
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    // Gunakan as untuk type assertion
    const getVariant = (status: string) => {
        switch (status) {
            case 'completed':
                return 'outline' as const;
            case 'pending':
                return 'outline' as const;
            default:
                return 'destructive' as const;
        }
    };

    const getClassName = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-red-100 text-red-800';
        }
    };

    return (
        <Badge 
            variant={getVariant(status)}
            className={getClassName(status)}
        >
            {status}
        </Badge>
    );
}
