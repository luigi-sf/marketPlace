// src/context/adminContext.ts
import { createContext } from "react";

interface AdminContextType {
  pendingCount: number;
}

export const AdminContext = createContext<AdminContextType>({
  pendingCount: 0,
});