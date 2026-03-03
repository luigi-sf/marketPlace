import { useEffect, useState, useCallback } from "react";
import { getSocket } from "../../sockets";
import { AdminContext } from "./adminContext";
import { useAdminSocket } from "../../components/hooks/useAdmin";
import type { AdminProviderProps } from "../../types/adminDash";
import type { PendingSellersResponse } from "../../types/adminDash";

export function AdminProvider({ children, token }: AdminProviderProps) {
  const [pendingCount, setPendingCount] = useState(0);

  useAdminSocket(token);

  const loadPendingSellers = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/admin/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: PendingSellersResponse = await res.json();
      const pending = data.data.filter((s) => !s.isApproved);

      setPendingCount(pending.length);
    } catch (err) {
      console.error("Erro ao carregar vendedores pendentes:", err);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const socket = getSocket();
    if (!socket) return;

    const handleNewPending = () => {
      console.log("🔥 sellerApprovalUpdated");
      loadPendingSellers();
    };

    socket.on("sellerApprovalUpdated", handleNewPending);

    // 🔥 carrega após o mount de forma assíncrona segura
    queueMicrotask(() => {
      loadPendingSellers();
    });

    return () => {
      socket.off("sellerApprovalUpdated", handleNewPending);
    };
  }, [token, loadPendingSellers]);

  return (
    <AdminContext.Provider value={{ pendingCount }}>
      {children}
    </AdminContext.Provider>
  );
}