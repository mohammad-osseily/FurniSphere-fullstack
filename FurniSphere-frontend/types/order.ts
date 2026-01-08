
// @/types/order.ts
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

export interface Order {
  id: number;
  status: OrderStatus;
  created_at: string;
  total_amount: number;
  order_items: OrderItem[];
}

