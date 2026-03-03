export type  UpdateProductInput = {
  productId: string;
  userId: string;
  role: "ADMIN" | "SELLER";
  data: Partial<{
    title: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
  }>;
}