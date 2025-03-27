import { ProductVariant } from "./product-variant";

export interface CartItem {
    id: number;
    cart_id: number;
    product_variant_id: number;
    quantity: number;
    price: number;
    product_variant?: ProductVariant;
    created_at: string;
    updated_at: string;
}