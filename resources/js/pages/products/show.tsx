import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppLayout from '@/layouts/app-layout';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Trash2 } from 'lucide-react';
import { AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger } from '@/components/ui/alert-dialog';

import { Product } from '@/interfaces/product';
import { ProductVariant } from '@/interfaces/product-variant';

type Props = {
    product: Product;
};

export default function Show({ product }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: '/products',
        },
        {
            title: product.name,
            href: `/products/${product.slug}`,
        },
    ];

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        
        router.post(route('cart.add'), {
            product_variant_id: selectedVariant.id,
            quantity: 1, // You can add a quantity input if needed
        }, {
            preserveState: true,
            preserveScroll: true,
        });
        
        toast.success(`Added ${product.name} - ${selectedVariant.name} to cart`);
    };

    // Format price helper function
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(price);
      };

    const handleDelete = (id: number) => {
        router.delete(`/products/${id}`, {
          onSuccess: () => {
            // Success handling can be added here if needed
          },
        });
      };

    // Komponen konten untuk tampilan admin
    const AdminView = () => (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-6 md:min-h-min">
                <div className="flex items-start justify-between">
                    <div className='p-4'>
                        <h1 className="text-2xl font-bold">{product.name}</h1>
                        <div className="mt-2 flex items-center gap-2">
                            <Badge variant={product.is_active ? "default" : "destructive"} className={product.is_active ? "bg-green-500" : ""}>
                                {product.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {product.category && (
                                <Badge variant="outline">{product.category.name}</Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('products.index')}>Back</Link>
                        </Button>
                        <Button variant="default" asChild>
                            <Link href={route('products.edit', product.id)}>Edit Product</Link>
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
                                  This will permanently delete the product "{product.name}".
                                  {product.variants && product.variants.length > 0 && (
                                    <span className="font-semibold text-red-500 block mt-2">
                                      Warning: This product has {product.variants.length} variants associated with it.
                                    </span>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Product Image */}
                    <div>
                        {product.image ? (
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="h-auto w-full rounded-lg object-cover shadow-md"
                            />
                        ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                            No img
                        </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold">Description</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">
                                {product.description || "No description available"}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold">Product Variants</h2>
                            {product.variants && product.variants.length > 0 ? (
                                <div className="mt-4 space-y-4">
                                    {product.variants.map((variant) => (
                                        <Card key={variant.id}>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-medium">{variant.name}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            Stock: {variant.stock}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold">
                                                            {formatPrice(variant.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-2 text-gray-500">No variants available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Komponen konten untuk tampilan user
    const UserView = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Product Image */}
                <div>
                    {product.image ? (
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-auto w-full rounded-lg object-cover shadow-md"
                        />
                    ) : (
                        <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                            <span className="text-gray-400">No image available</span>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold">{product.name}</h1>
                        {product.category && (
                            <Badge variant="outline" className="mt-2">
                                {product.category.name}
                            </Badge>
                        )}
                    </div>

                    <div>
                        <p className="text-gray-600 dark:text-gray-300">
                            {product.description || "No description available"}
                        </p>
                    </div>

                    {product.variants && product.variants.length > 0 ? (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Select Variant</h2>
                            <RadioGroup 
                                value={selectedVariant?.id.toString()} 
                                onValueChange={(value) => {
                                    const variant = product.variants?.find(v => v.id.toString() === value) || null;
                                    setSelectedVariant(variant);
                                }}
                            >
                                <div className="space-y-2">
                                    {product.variants.map((variant) => (
                                        <div key={variant.id} className="flex items-center space-x-2">
                                            <RadioGroupItem 
                                                value={variant.id.toString()} 
                                                id={`variant-${variant.id}`}
                                                disabled={variant.stock <= 0}
                                            />
                                            <Badge
                                                key={variant.id}
                                                variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                                                className={`cursor-pointer ${
                                                    selectedVariant?.id === variant.id ? "bg-green-500 hover:bg-green-600" : ""
                                                } ${variant.stock <= 0 ? "opacity-50 cursor-not-allowed" : "hover:text-gray-700"}`}
                                                onClick={() => variant.stock > 0 && setSelectedVariant(variant)}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <span>{variant.name}</span>
                                                    <span className="font-bold">{formatPrice(variant.price)}</span>
                                                </div>
                                                {variant.stock <= 0 && (
                                                    <span className="text-xs text-red-500 block">Out of stock</span>
                                                )}
                                                {variant.stock > 0 && variant.stock < 5 && (
                                                    <span className="text-xs text-amber-500 block">Only {variant.stock} left</span>
                                                )}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>

                            <div className="pt-4">
                                {selectedVariant ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold">Price:</span>
                                            <span className="text-xl font-bold">{formatPrice(selectedVariant.price)}</span>
                                        </div>
                                        <Button 
                                            className="w-full" 
                                            onClick={handleAddToCart}
                                            disabled={!selectedVariant || selectedVariant.stock <= 0}
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                ) : (
                                    <Button className="w-full" disabled>
                                        Select a variant
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg bg-amber-50 p-4 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                            <p>This product has no variants available.</p>
                        </div>
                    )}

                    <Button variant="outline" asChild className="mt-4">
                        <Link href={route('products.index')}>Back to Products</Link>
                    </Button>
                </div>
            </div>
        </div>
    );

    // Render layout berdasarkan role user
    if (auth.user.roles && Array.isArray(auth.user.roles) && auth.user.roles.includes('admin')) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`${product.name} - Product Details`} />
                <AdminView />
            </AppLayout>
        );
    } else {
        return (
            <AppHeaderLayout breadcrumbs={breadcrumbs}>
                <Head title={`${product.name} - Product Details`} />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-6 md:min-h-min">
                        <UserView />
                    </div>
                </div>
            </AppHeaderLayout>
        );
    }
}
