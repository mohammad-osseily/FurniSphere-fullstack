// types/category.ts
import { Pagination } from "./pagination";
import { Product } from "./product";

export interface Category {
  id: number;
  name: string;
  products?: Product[]; // Associating products with the category
  created_at: string;
  updated_at: string;
}

export type PaginatedCategories = Pagination<Category>;
