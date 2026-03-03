export type CreateSellerProfileDTO  = {
  userId: string;
  storeName: string;
  description?: string;
}

export type UpdateSellerProfileDTO = {
  storeName?: string;
  description?: string;
  isApproved?: boolean
  
}