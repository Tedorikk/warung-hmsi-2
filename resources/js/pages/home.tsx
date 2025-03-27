import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Product } from '@/interfaces/product';
import { ProductCategory } from '@/interfaces/product-category';
import { ProductVariant } from '@/interfaces/product-variant';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface HomeProps {
    featuredProducts: Product[];
    categories: ProductCategory[];
    productsByCategory: ProductCategory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/home',
    },
];

export default function Home({ featuredProducts, categories, productsByCategory }: HomeProps) {
    const [activeCategory, setActiveCategory] = useState<number | null>(
        productsByCategory.length > 0 ? productsByCategory[0].id : null
    );

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Featured Products Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Featured Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {featuredProducts.map((product) => (
                                <FeaturedProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                
                {/* Products by Category Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Our Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue={activeCategory?.toString()} onValueChange={(value:string) => setActiveCategory(Number(value))}>
                            <TabsList className="mb-6 overflow-x-auto">
                                {categories.map((category) => (
                                    <TabsTrigger key={category.id} value={category.id.toString()}>
                                        {category.name} ({category.products_count})
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            {productsByCategory.map((category) => (
                                <TabsContent key={category.id} value={category.id.toString()}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {category.products?.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppHeaderLayout>
    );
}

function FeaturedProductCard({ product }: { product: Product }) {
    const calculatedPrice = product.variants?.reduce(
        (min: number, variant: ProductVariant) => (variant.price < min ? variant.price : min),
        product.variants?.[0]?.price || 0
    ) ?? 0;

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(price);
    };
    
    const lowestPrice = formatPrice(Number(calculatedPrice));
    
    return (
        <Card>
            <Link href={`/products/${product.id}`}>
                <CardContent className="p-0">
                    <div className="h-48 overflow-hidden relative">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400">No image</span>
                            </div>
                        )}
                        <Badge className="absolute top-2 right-2">Featured</Badge>
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                            {product.category?.name}
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                            <span className="font-bold text-blue-600">
                                {lowestPrice}
                            </span>
                            <Badge variant="outline">{product.variants?.length || 0} variants</Badge>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}

function ProductCard({ product }: { product: Product }) {
    const calculatedPrice = product.variants?.reduce(
        (min: number, variant: ProductVariant) => (variant.price < min ? variant.price : min),
        product.variants?.[0]?.price || 0
    ) ?? 0;
    
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(price);
    };
    
    const lowestPrice = formatPrice(Number(calculatedPrice));
    
    return (
        <Card>
            <Link href={`/products/${product.id}`}>
                <CardContent className="p-0">
                    <div className="h-40 overflow-hidden">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400">No image</span>
                            </div>
                        )}
                    </div>
                    <div className="p-3">
                        <h3 className="font-medium text-base truncate">{product.name}</h3>
                        <div className="mt-1 flex justify-between items-center">
                            <span className="font-bold text-blue-600">
                                {lowestPrice}
                            </span>
                            <Badge variant="outline">
                                {product.variants?.reduce((total: number, variant: ProductVariant) => total + variant.stock, 0) || 0} in stock
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
