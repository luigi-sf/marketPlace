import type { Category } from "./category";

export interface ProductDTO{
   title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;

  Category: Category

  SellerProfile: {
    id: string;
    storeName: string;
  };

  ProductImage: {
    id: string;
    url: string;
  }[];
}
export interface LocationState {
  selectedCategory: Category;
}