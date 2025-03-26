import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ProductCategory } from '@/interfaces/product-category';

interface EditProps {
  category: ProductCategory;
}

export default function Edit({ category }: EditProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Product Categories',
      href: '/product-categories',
    },
    {
      title: category.name,
      href: `/product-categories/${category.id}`,
    },
    {
      title: 'Edit',
      href: `/product-categories/${category.id}/edit`,
    },
  ];

  // Ubah put menjadi post di sini
  const { data, setData, post, processing, errors } = useForm({
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    _method: 'put',
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    // Reset the form when the category changes
    setData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      _method: 'put'
    });
    setSlugManuallyEdited(false);
  }, [category, setData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ubah put menjadi post di sini
    post(`/product-categories/${category.id}`, {
      preserveScroll: true, // Tambahkan opsi ini untuk menjaga posisi scroll
      onSuccess: () => {
        // Opsional: Tambahkan notifikasi sukses atau tindakan lain setelah berhasil
        console.log('Category updated successfully');
      },
      onError: (errors) => {
        // Opsional: Tambahkan penanganan error khusus
        console.error('Update failed:', errors);
      }
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single one
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setData('name', name);
    
    // Only auto-generate slug if user hasn't manually edited it
    if (!slugManuallyEdited) {
      setData('slug', generateSlug(name));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setData('slug', e.target.value);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit ${category.name}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-6 md:min-h-min">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight mb-6">Edit Product Category</h1>
            
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Category Information</CardTitle>
                  <CardDescription>
                    Update the details of this product category.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={handleNameChange}
                      placeholder="Enter category name"
                    />
                    {errors.name && (
                      <Alert variant="destructive" className="py-2 mt-1">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.name}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={data.slug}
                      onChange={handleSlugChange}
                      placeholder="enter-category-slug"
                    />
                    {errors.slug && (
                      <Alert variant="destructive" className="py-2 mt-1">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.slug}</AlertDescription>
                      </Alert>
                    )}
                    <p className="text-sm text-gray-500">
                      The slug is used in the URL and should be unique.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Enter category description"
                      rows={4}
                    />
                    {errors.description && (
                      <Alert variant="destructive" className="py-2 mt-1">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.description}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => router.visit('/product-categories')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
