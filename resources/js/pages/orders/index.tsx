import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Eye, Trash2 } from 'lucide-react';
import { Order } from '@/interfaces/order';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Orders',
    href: '/orders',
  },
];

interface IndexProps {
  orders: {
    data: Order[];
    current_page: number;
    last_page: number;
  };
  filters: {
    search?: string;
    status?: string;
    payment_status?: string;
    per_page?: string;
  };
}

export default function Index({ orders, filters }: IndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(filters?.payment_status || 'all');
  const [perPage, setPerPage] = useState(filters?.per_page || '10');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    applyFilters(value);
  };

  const handlePaymentStatusChange = (value: string) => {
    setPaymentStatusFilter(value);
    applyFilters(undefined, value);
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(value);
    applyFilters();
  };

  const applyFilters = (status?: string, paymentStatus?: string) => {
    router.get('/orders', {
      search: searchTerm || undefined,
      status: (status || statusFilter) === 'all' ? undefined : (status || statusFilter),
      payment_status: (paymentStatus || paymentStatusFilter) === 'all' ? undefined : (paymentStatus || paymentStatusFilter),
      per_page: perPage,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = (id: number) => {
    router.delete(`/orders/${id}`, {
      onSuccess: () => {
        // Success handling can be added here if needed
      },
    });
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
        return <Badge variant="secondary">Paid</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Orders" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-6 md:min-h-min">
          <div className="flex flex-col space-y-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentStatusFilter} onValueChange={handlePaymentStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Orders Table */}
            <Table>
              <TableCaption>A list of all orders.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.length > 0 ? (
                  orders.data.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.user?.name || 'Guest'}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>${Number(order.total_amount).toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.visit(`/orders/${order.id}`)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete Order #{order.id}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(order.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No orders found. Try adjusting your filters or create a new order.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
{/* Pagination */}
<div className="flex items-center justify-between space-x-2 py-4">
              <Pagination>
                <PaginationContent>
                  {orders.current_page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={`/orders?page=${orders.current_page - 1}&per_page=${perPage}&search=${searchTerm}&status=${statusFilter}&payment_status=${paymentStatusFilter}`} />
                    </PaginationItem>
                  )}
                  {[...Array(orders.last_page)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink href={`/orders?page=${i + 1}&per_page=${perPage}&search=${searchTerm}&status=${statusFilter}&payment_status=${paymentStatusFilter}`}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {orders.current_page < orders.last_page && (
                    <PaginationItem>
                      <PaginationNext href={`/orders?page=${orders.current_page + 1}&per_page=${perPage}&search=${searchTerm}&status=${statusFilter}&payment_status=${paymentStatusFilter}`} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>

              {/* Per Page Selector */}
              <div className="flex items-center space-x-2">
                <span className='text-sm'>Show</span>
                <Select
                  value={perPage.toString()}
                  onValueChange={(value) => handlePerPageChange(value)}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder={perPage.toString()} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <p className='text-sm'>per page</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}