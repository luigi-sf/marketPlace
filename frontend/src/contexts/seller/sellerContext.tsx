import { createContext } from "react";
import type { SellerContextType } from "../../types/seller/sellerContext";

export const SellerContext = createContext<SellerContextType | undefined>(undefined)