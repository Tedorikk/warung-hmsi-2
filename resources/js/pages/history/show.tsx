import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Order, OrderItem } from '@/interfaces/order';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ShowProps {
  order: Order & {
    items: OrderItem[];
  };
}

export default function Show({ order }: ShowProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/home',
    },
    {
      title: 'Order History',
      href: '/history',
    },
    {
      title: `Order #${order.id}`,
      href: `/history/${order.id}`,
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'paid':
        return <Badge variant="default">Paid</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderPaymentAction = () => {
    if (order.payment_status === 'pending') {
      return (
        <Link href={`/orders/${order.id}/payment`}>
          <Button className="mt-2">
            <ExternalLink className="mr-2 h-4 w-4" /> 
            Pay Now
          </Button>
        </Link>
      );
    }
    return null;
  };

  return (
    <AppHeaderLayout breadcrumbs={breadcrumbs}>
      <Head title={`Order #${order.id}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <Link href="/history">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Order #{order.id} placed on {formatDate(order.created_at)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-sm font-medium">Order Status</p>
                  <div className="mt-1">{getStatusBadge(order.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Status</p>
                  <div className="mt-1">{getPaymentStatusBadge(order.payment_status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-sm mt-1">{order.payment_method}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {item.product_variant?.product?.image && (
                              <img 
                                src={item.product_variant.product.image} 
                                alt={item.product_variant.product.name} 
                                className="h-12 w-12 rounded-md object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.product_variant?.product?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.product_variant?.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatRupiah(Number(item.price))}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatRupiah(Number(item.subtotal))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div></div>
              <div className="text-right">
                <p className="text-sm">Total</p>
                <p className="text-xl font-bold">{formatRupiah(Number(order.total_amount))}</p>
              </div>
            </CardFooter>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Shipping Method</p>
                    <p className="text-sm">{order.shipping_method}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Shipping Address</p>
                    <p className="text-sm whitespace-pre-line">{order.shipping_address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm">{order.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Status</p>
                    <div className="mt-1">{getPaymentStatusBadge(order.payment_status)}</div>
                  </div>
                  {order.transaction_id && (
                    <div>
                      <p className="text-sm font-medium">Transaction ID</p>
                      <p className="text-sm">{order.transaction_id}</p>
                    </div>
                  )}
                  {renderPaymentAction()}
                </div>
              </CardContent>
            </Card>

            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppHeaderLayout>
  );
}
