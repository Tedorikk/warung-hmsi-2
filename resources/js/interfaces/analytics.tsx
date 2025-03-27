// @/interfaces/analytics.ts
import { Order } from './order';
import { ProductCategory } from './product-category';

export interface TopSellingProduct {
  id: number;
  name: string;
  image: string | null;
  total_quantity: number;
  total_sales: number;
}

export interface Analytics {
  sales: {
    total: number;
    monthly: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
    lowStock: number;
  };
  salesOverTime: {
    labels: string[];
    data: number[];
  };
  topSellingProducts: TopSellingProduct[];
  recentOrders: Order[];
  categories?: ProductCategory[];
}
