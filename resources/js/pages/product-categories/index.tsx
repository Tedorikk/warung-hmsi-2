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
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
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
    title: 'Product Categories',
    href: '/product-categories',
  },
];



interface IndexProps {
  categories: ProductCategory[];
  filters: {
    search?: string;
  };
}

export default function Index({ categories, filters }: IndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
  };
  
  const applyFilters = useCallback(() => {
    router.get('/product-categories', {
      search: searchTerm || undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  }, [searchTerm]);
  
  const handleDelete = (id: number) => {
    router.delete(`/product-categories/${id}`, {
      onSuccess: () => {
        
      },
    });
  };
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Product Categories" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-6 md:min-h-min">
          <div className="flex flex-col space-y-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold tracking-tight">Product Categories</h1>
              <Button 
                onClick={() => router.visit('/product-categories/create')} 
                className="md:self-end"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </div>
            
            {/* Filters Section */}
            <div className="w-full md:w-1/3">
              <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            {/* Categories Table */}
            <Table>
              <TableCaption>A list of your product categories.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        {category.description ? (
                          category.description.length > 50 
                            ? `${category.description.substring(0, 50)}...` 
                            : category.description
                        ) : (
                          <span className="text-gray-400">No description</span>
                        )}
                      </TableCell>
                      <TableCell>
                      <Badge variant="outline">
                        {category.products_count || 0}
                      </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.visit(`/product-categories/${category.id}/edit`)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
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
                                  This will permanently delete the category "{category.name}".
                                  {category.products && category.products.length > 0 && (
                                    <span className="font-semibold text-red-500 block mt-2">
                                      Warning: This category has {category.products.length} products associated with it.
                                    </span>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(category.id)}
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
                    <TableCell colSpan={5} className="text-center py-8">
                      No categories found. Try adjusting your search or add a new category.
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
