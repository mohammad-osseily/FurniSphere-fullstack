// types/user.ts
import { Pagination } from "./pagination";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

export type PaginatedUsers = Pagination<User>;
