import api from "./api";
import type { Product, ProductDTO } from "../types/products/product";

type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export const productService = {
  // Criar produto
  async create(data: ProductDTO): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>("/products", data);
    return response.data.data;
  },

  // Criar produto com imagem
  async createWithImage(formData: FormData): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  // Pegar produtos do usuário
  async getMyProducts(): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>("/products/me");
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  // Pegar produto por ID
  async getById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  // Atualizar produto
  async update(id: string, data: Partial<ProductDTO>): Promise<Product> {
    const response = await api.patch<ApiResponse<Product>>(`/products/${id}/edit`, data);
    return response.data.data;
  },

  // Deletar produto
  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  // Pegar produtos por categoria
  async getProducts(categoryId?: string): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>("/products", {
      params: { category: categoryId },
    });
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  // Pegar todos os produtos
  async getAllProducts(): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>("/products");
    return Array.isArray(response.data.data) ? response.data.data : [];
  },
};