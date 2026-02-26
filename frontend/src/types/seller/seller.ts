export type SellerProfileResponse = {
  id: string
  userId: string
  storeName: string
  description?: string
  isApproved: boolean
  createdAt: string
}

export type CreateSellerProfileDTO  = {
  storeName: string;
  description?: string;
}

export type UpdateSellerProfileDTO = {
  storeName?: string;
  description?: string;
}