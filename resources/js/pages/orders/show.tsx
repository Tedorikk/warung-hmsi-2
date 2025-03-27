// @/Pages/Admin/Orders/Show.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/interfaces/order';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useEffect } from 'react';
import { ArrowLeft, Printer, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ShowProps {
  order: Order;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Orders',
    href: '/orders',
  },
  {
    title: 'Order Details',
    href: '#',
  },
];

export default function Show({ order }: ShowProps) {
  // Debug the order data when component mounts
  useEffect(() => {
    console.log('Full order data:', order);
    console.log('Order items:', order.items);
  }, [order]);
  
  const { data, setData, patch, processing } = useForm({
    status: order.status,
    payment_status: order.payment_status,
    notes: order.notes || '',
  });
  
  const handleStatusChange = (value: string) => {
    setData('status', value);
    patch(`/orders/${order.id}`);
  };
  
  const handlePaymentStatusChange = (value: string) => {
    setData('payment_status', value);
    patch(`/orders/${order.id}`);
  };
  
  const saveNotes = () => {
    patch(`/orders/${order.id}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'shipped':
        return <Badge variant="default">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="secondary">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const printOrder = () => {
    window.print();
  };
  
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Order #${order.id}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-6 md:min-h-min">
          <div className="flex flex-col space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => router.visit('/orders')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Order #{order.id}</h1>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={printOrder}
                  variant="outline"
                >
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Info */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Order Status</label>
                        <Select 
                          value={data.status} 
                          onValueChange={handleStatusChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Payment Status</label>
                        <Select 
                          value={data.payment_status} 
                          onValueChange={handlePaymentStatusChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                        <p>{formatDate(order.created_at)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                        <p>{order.payment_method}</p>
                      </div>
                      
                      {order.transaction_id && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                          <p>{order.transaction_id}</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Shipping Method</p>
                        <p>{order.shipping_method}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notes</label>
                      <p>{data.notes}</p> 
                      <Button 
                        onClick={saveNotes} 
                        disabled={processing}
                        size="sm"
                      >
                        <Save className="mr-2 h-4 w-4" /> Save Notes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
                      <p>{order.user?.name || 'Guest'}</p>
                    </div>
                    {order.user?.email && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p>{order.user.email}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Shipping Address</p>
                      <p className="whitespace-pre-wrap">{order.shipping_address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Variant</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {order.items.map((item) => {
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.product_variant && item.product_variant.product 
                            ? item.product_variant.product.name 
                            : 'Unknown Product'}
                        </TableCell>
                        <TableCell>
                          {item.product_variant 
                            ? item.product_variant.name 
                            : 'Unknown Variant'}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatRupiah(Number(item.price))}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatRupiah(Number(item.subtotal))}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  </TableBody>
                </Table>
                
                <Separator className="my-4" />
                
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex w-full justify-between md:w-1/3">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">{formatRupiah(Number(order.total_amount))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
