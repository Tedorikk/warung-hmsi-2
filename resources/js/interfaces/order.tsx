// @/interfaces/order.ts
import { User } from './user';
import { ProductVariant } from './product-variant';
import { Product } from './product';

export interface OrderItem {
  id: number;
  order_id: number;
  product_variant_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
  product_variant: ProductVariant & {
    product: Product;
  };
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: string;
  shipping_method: string;
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  items: OrderItem[];
}
