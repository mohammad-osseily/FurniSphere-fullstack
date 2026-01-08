// types/product.ts
import { Pagination } from "./pagination";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  stock: number;
  image: string;
  color: string;
  created_at: string;
  updated_at: string;
}
export interface Product3D {
  id: number;
  name: string;
  product_id: number;
  model_file_path: string;
  file_type: string;
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

export type PaginatedProducts = Pagination<Product>;
