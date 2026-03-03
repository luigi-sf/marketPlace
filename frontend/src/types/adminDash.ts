import type { ReactNode } from "react";
import type { SellerProfileResponse } from "./seller/seller";

export interface AdminDashboardResponse {
  pendingSellers: number;
   activeUsers: number;
  totalProducts: number;
}
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export interface AdminProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
}

export interface AdminPending{
  id:string;
  storeName:string;
  description?:string;
  userId:string;
  isApproved:boolean;
  

}
export interface AdminProviderProps {
  children: ReactNode;
  token: string;
}


export interface PendingSellersResponse {
  data: SellerProfileResponse[];
  message?: string;
}