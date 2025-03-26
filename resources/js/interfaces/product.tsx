import { ProductCategory } from './product-category';
import { ProductVariant } from './product-variant';

export interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    image?: string;
    category?: ProductCategory;
    variants?: ProductVariant[];
    created_at: string;
    updated_at: string;
}
