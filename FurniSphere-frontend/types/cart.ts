import { CartProduct } from "./cartProduct";

export interface Cart {
  id: number;
  user_id: number;
  cart_products: CartProduct[];
}
