// src/contexts/Providers.tsx
import React from "react";
import { useAuth } from "../components/hooks/useAuth";
import { SellerProvider } from "./seller/sellerProvider";
import { AdminProvider } from "./admin/adminProvider";
import { SocketProvider } from "../contexts/socket/socketProviders";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  return (
    <SellerProvider>
      {token ? (
        <SocketProvider token={token}>
          <AdminProvider token={token}>{children}</AdminProvider>
        </SocketProvider>
      ) : (
        <>{children}</>
      )}
    </SellerProvider>
  );
};