import type { SellerProfileResponse, CreateSellerProfileDTO,UpdateSellerProfileDTO } from "./seller"

export type SellerContextType = {
  seller: SellerProfileResponse | null
  loading: boolean
  isSeller: boolean
  isApproved: boolean
  createSeller: (data: CreateSellerProfileDTO) => Promise<void>
  updateSeller: (data: UpdateSellerProfileDTO) => Promise<void>
  refreshSeller: () => Promise<void>
}