import { Product } from './product';

export interface ProductVariant {
    id: number;
    product_id: number;
    name: string;
    price: number;
    stock: number;
    product?: Product;
    created_at: string;
    updated_at: string;
}
