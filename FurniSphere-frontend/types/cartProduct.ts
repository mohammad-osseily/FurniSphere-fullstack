import { Product } from ".";

export interface CartProduct {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product: Product;
}
