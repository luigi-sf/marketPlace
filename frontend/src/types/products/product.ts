import type { Category } from "./category";

export interface ProductDTO{
   title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

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