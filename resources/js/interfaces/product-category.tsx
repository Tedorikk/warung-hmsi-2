import { Product } from './product';

export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    products?: Product[];
    products_count?: number;
    created_at: string;
    updated_at: string;
}
