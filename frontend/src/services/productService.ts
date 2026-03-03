import api from "./api";
import type { Product, ProductDTO,ApiResponse} from "../types/products/product";


export const productService = {
  async create(data: ProductDTO): Promise<Product> {
    const {data:response} = await api.post<ApiResponse<Product>>("/products", data);
    return response.data;
  },

  async createWithImage(formData: FormData): Promise<Product> {
    const {data:response} = await api.post<ApiResponse<Product>>("/products", formData, {
    });
    return response.data;
  },

  async getMyProducts(): Promise<Product[]> {
    const {data:response} = await api.get<ApiResponse<Product[]>>("/products/me");
    return response.data
  },
  async getById(id: string): Promise<Product> {
    const {data:response} = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<ProductDTO>): Promise<Product> {
    const {data:response} = await api.patch<ApiResponse<Product>>(`/products/${id}/edit`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async getProducts(categoryId?: string): Promise<Product[]> {
    const {data:response} = await api.get<ApiResponse<Product[]>>("/products", {
      params: { category: categoryId },
    });
    return response.data ;
  },

  async getAllProducts(): Promise<Product[]> {
    const {data:response} = await api.get<ApiResponse<Product[]>>("/products");
    return response.data
  },
};