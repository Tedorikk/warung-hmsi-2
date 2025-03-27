import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { CartItem } from '@/interfaces/cart-item';
import { toast } from 'sonner';
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
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CartProps {
  cartItems: CartItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Home', href: '/home' },
  { title: 'Cart', href: '/cart' },
];

export default function Cart({ cartItems = [] }: CartProps) {
  const [items, setItems] = useState<CartItem[]>(cartItems);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateQuantity = (id: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    router.delete(route('cart.remove', { id: id }), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success('Item removed from cart');
        setIsSubmitting(false);
      },
      onError: () => {
        toast.error('Failed to remove item from cart');
        setIsSubmitting(false);
      }
    });
  };

  const clearCart = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    router.post(route('cart.clear'), {}, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setItems([]);
        toast.success('Cart cleared successfully');
        setIsSubmitting(false);
      },
      onError: () => {
        toast.error('Failed to clear cart');
        setIsSubmitting(false);
      }
    });
  };

  const calculateTotal = () => {
    const total = items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(total);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    shipping_address: '',
    shipping_method: '',
    payment_method: '',
    notes: ''
  });

  const handleCheckoutInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    router.post(route('checkout.process'), {
      shipping_address: checkoutData.shipping_address,
      shipping_method: checkoutData.shipping_method,
      payment_method: checkoutData.payment_method,
      notes: checkoutData.notes
    }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setIsSubmitting(false);
        toast.success('Checkout berhasil! Pesanan Anda sedang diproses.');
        const orderId = page.props.order_id || page.props.orderId;
        if (orderId) {
          router.visit(route('orders.success', { orderId }));
        } else {
          router.visit(route('orders.index'));
        }
      },
      onError: (errors) => {
        setIsSubmitting(false);
        console.error('Error response:', errors);
        toast.error('Gagal melakukan checkout');
      }
    });
  };

  return (
    <AppHeaderLayout breadcrumbs={breadcrumbs}>
      <Head title="Cart" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        {items.length > 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                  const productName = item.product_variant?.product?.name || 'Unknown Product';
                  const variantName = item.product_variant?.name;
                  const imageUrl = item.product_variant?.product?.image || '/placeholder-product.jpg';
                  
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex p-4 gap-4">
                        <img
                          src={imageUrl}
                          alt={`${productName} product image`}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{productName}</h3>
                          {variantName && (
                            <Badge variant="secondary" className="mt-1">{variantName}</Badge>
                          )}
                          <p className="text-muted-foreground mt-1">
                            {formatPrice(item.price)}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isSubmitting}
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isSubmitting}
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            onClick={() => removeItem(item.id)}
                            disabled={isSubmitting}
                            variant="destructive"
                            size="sm"
                            className="mt-3"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
            <Separator className="my-4" />
            <CardFooter className="flex justify-between flex-wrap gap-4">
              <div className="text-xl font-bold">
                Total: {calculateTotal()}
              </div>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isSubmitting}>
                      Clear Cart
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will remove all items from your cart. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={clearCart} disabled={isSubmitting}>Clear Cart</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button onClick={() => setShowCheckoutForm(true)} disabled={isSubmitting}>
                  Checkout
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="p-8">
            <div className="text-center">
              <p className="text-muted-foreground">Your cart is empty. Start shopping now!</p>
              <Button className="mt-4" asChild>
                <a href="/home">Browse Products</a>
              </Button>
            </div>
          </Card>
        )}
      </div>
      <Dialog open={showCheckoutForm} onOpenChange={setShowCheckoutForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogDescription>
              Fill in the details below to complete your purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="shipping_address">Shipping Address</Label>
              <Textarea
                id="shipping_address"
                name="shipping_address"
                value={checkoutData.shipping_address}
                onChange={handleCheckoutInputChange}
                placeholder="Enter your full shipping address"
                className="resize-none"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shipping_method">Shipping Method</Label>
              <Select 
                value={checkoutData.shipping_method} 
                onValueChange={(value) => handleSelectChange('shipping_method', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular (2-3 days)</SelectItem>
                  <SelectItem value="express">Express (1 day)</SelectItem>
                  <SelectItem value="same_day">Same Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select 
                value={checkoutData.payment_method} 
                onValueChange={(value) => handleSelectChange('payment_method', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="e_wallet">E-Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={checkoutData.notes}
                onChange={handleCheckoutInputChange}
                placeholder="Any special instructions for your order"
                className="resize-none"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowCheckoutForm(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCheckout} disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppHeaderLayout>
  );
}
