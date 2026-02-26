import { useContext } from "react";
import { SellerContext } from "../../contexts/seller/sellerContext";

export function useSeller() {
  const context = useContext(SellerContext)
  if (!context) {
    throw new Error("useSeller must be used within SellerProvider")
  }
  return context
}