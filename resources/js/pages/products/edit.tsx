import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ProductCategory } from '@/interfaces/product-category';
import { Product } from '@/interfaces/product';
import { useState } from 'react';
import { ArrowLeft, Upload, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Products',
    href: '/products',
  },
  {
    title: 'Edit',
    href: '#',
  },
];

interface EditProps {
  product: Product & { image_url?: string };
  categories: ProductCategory[];
}

// Definisikan tipe untuk form data
type FormData = {
  category_id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  image: File | null;
  variants: {
    id?: number;
    name: string;
    price: number;
    stock: number;
  }[];
  _method: string;
}

// Definisikan tipe untuk error
type FormErrors = Record<string, string>;

export default function Edit({ product, categories }: EditProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null);
  
  const { data, setData, post, processing, errors } = useForm<FormData>({
    category_id: product.category_id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    is_active: product.is_active,
    image: null,
    variants: product.variants?.map(variant => ({
      id: variant.id,
      name: variant.name,
      price: variant.price,
      stock: variant.stock
    })) || [],
    _method: 'PUT',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting data:', data);
    
    post(`/products/${product.id}`, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        // Handle success
      },
      onError: (errors) => {
        console.error('Validation errors:', errors);
      }
    });
  };

  const generateSlug = () => {
    if (!data.name) return;
    
    const slug = data.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setData('slug', slug);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setData('image', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fungsi untuk mengelola varian
  const addVariant = () => {
    setData('variants', [
      ...data.variants,
      { name: '', price: 0, stock: 0 }
    ]);
  };

  const updateVariant = (index: number, field: 'name' | 'price' | 'stock', value: string | number) => {
    const updatedVariants = [...data.variants];
    if (field === 'price' || field === 'stock') {
      updatedVariants[index][field] = Number(value);
    } else {
      updatedVariants[index][field] = value as string;
    }
    setData('variants', updatedVariants);
  };

  const removeVariant = (index: number) => {
    const updatedVariants = [...data.variants];
    updatedVariants.splice(index, 1);
    setData('variants', updatedVariants);
  };

  // Helper function untuk mengakses error dengan aman
  const getNestedError = (path: string) => {
    return (errors as unknown as FormErrors)[path];
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Product - ${product.name}`} />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 overflow-hidden rounded-xl border p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Edit Product: {product.name}</h1>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Product Information Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>
                  Update the product details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category <span className="text-red-500">*</span></Label>
                  <Select 
                    value={data.category_id} 
                    onValueChange={(value) => setData('category_id', value)}
                  >
                    <SelectTrigger id="category_id">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category_id && (
                    <p className="text-sm text-red-500">{errors.category_id}</p>
                  )}
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    onBlur={generateSlug}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Product Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug <span className="text-red-500">*</span></Label>
                  <Input
                    id="slug"
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500">{errors.slug}</p>
                  )}
                </div>

                {/* Product Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* Product Status */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', checked)}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                {/* Product Image */}
                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PNG, JPG, JPEG or GIF (MAX. 2MB)
                            </p>
                          </div>
                          <input 
                            id="image" 
                            type="file" 
                            className="hidden" 
                            onChange={handleImageChange}
                            accept="image/png, image/jpeg, image/jpg, image/gif"
                          />
                        </label>
                      </div>
                      {errors.image && (
                        <p className="text-sm text-red-500 mt-2">{errors.image}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-h-40 rounded-lg object-contain"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2"
                            onClick={() => {
                              setImagePreview(null);
                              setData('image', null);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          No image selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Variants Card */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Product Variants</CardTitle>
                  <CardDescription>
                    Manage variants of this product
                  </CardDescription>
                </div>
                <Button 
                  type="button" 
                  onClick={addVariant}
                  className="ml-auto"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Variant
                </Button>
              </CardHeader>
              <CardContent>
                {data.variants.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No variants added yet. Click the "Add Variant" button to add product variants.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {data.variants.map((variant, index) => (
                      <div key={index} className="border rounded-lg p-4 relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeVariant(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor={`variant-name-${index}`}>Variant Name <span className="text-red-500">*</span></Label>
                            <Input
                              id={`variant-name-${index}`}
                              value={variant.name}
                              onChange={(e) => updateVariant(index, 'name', e.target.value)}
                              placeholder="e.g. Small, Red, 256GB"
                            />
                            {getNestedError(`variants.${index}.name`) && (
                              <p className="text-sm text-red-500">{getNestedError(`variants.${index}.name`)}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`variant-price-${index}`}>Price <span className="text-red-500">*</span></Label>
                            <Input
                              id={`variant-price-${index}`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={variant.price}
                              onChange={(e) => updateVariant(index, 'price', e.target.value)}
                              placeholder="0.00"
                            />
                            {getNestedError(`variants.${index}.price`) && (
                              <p className="text-sm text-red-500">{getNestedError(`variants.${index}.price`)}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`variant-stock-${index}`}>Stock <span className="text-red-500">*</span></Label>
                            <Input
                              id={`variant-stock-${index}`}
                              type="number"
                              min="0"
                              value={variant.stock}
                              onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                              placeholder="0"
                            />
                            {getNestedError(`variants.${index}.stock`) && (
                              <p className="text-sm text-red-500">{getNestedError(`variants.${index}.stock`)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={processing}
              >
                {processing ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
