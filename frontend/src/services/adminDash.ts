import api from "./api";
import type { AdminDashboardResponse, AdminUser,AdminPending } from '../types/adminDash'
import type { Product } from "../types/products/product";

export const adminService = {

 
  async getDashboard(): Promise<AdminDashboardResponse> {
    const {data:response} = await api.get("/admin");
    return response.data;
  },

   async getPending(): Promise<AdminPending> {
    const response = await api.get("/admin/pending");
    return response.data;
  },


  async getUsers(): Promise<AdminUser[]> {
    const {data:response} = await api.get("/admin/activeUsers");
    return response.data;
  },

  async deactivateUser(id: string): Promise<void> {
    await api.patch(`/admin/desactiveUser/${id}`);
  },

  async getProducts(): Promise<Product[]> {
    const {data:response} = await api.get("/admin/viewProducts");
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/admin/products/${id}`);
  }

};