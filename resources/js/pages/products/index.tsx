import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { Product } from '@/interfaces/product';
import { ProductCategory } from '@/interfaces/product-category';
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Products',
    href: '/products',
  },
];

interface IndexProps {
  products: Product[];
  categories: ProductCategory[];
  filters: {
    search?: string;
    category_id?: string;
    is_active?: string;
  };
}

export default function Index({ products, categories, filters }: IndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [categoryFilter, setCategoryFilter] = useState(filters?.category_id || 'all');
  const [isActive] = useState(filters?.is_active || '');
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
  };
  
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    applyFilters(value);
  };
  
  const applyFilters = useCallback((categoryValue?: string) => {
    router.get('/products', {
      search: searchTerm || undefined,
      category_id: (categoryValue || categoryFilter) === 'all' ? undefined : (categoryValue || categoryFilter),
      is_active: isActive || undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  }, [searchTerm, categoryFilter, isActive]);
  
  const handleDelete = (id: number) => {
    router.delete(`/products/${id}`, {
      onSuccess: () => {
        // Success handling can be added here if needed
      },
    });
  };
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Products" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-6 md:min-h-min">
          <div className="flex flex-col space-y-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold tracking-tight">Products</h1>
              <Button 
                onClick={() => router.visit('/products/create')} 
                className="md:self-end"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
            
            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                <SelectTrigger className="SelectTrigger">
                  <SelectValue placeholder="Filter Berdasarkan Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Products Table */}
            <Table>
              <TableCaption>A list of your products.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Variants</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                            No img
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.variants?.length || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.visit(`/products/${product.id}/edit`)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.visit(`/products/${product.id}`)}
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No products found. Try adjusting your filters or add a new product.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
