// src/pages/PendingSellers.tsx
import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { getSocket } from "../../sockets";
import type { SellerProfileResponse } from "../../types/seller/seller";
import '../../assets/styles/Admin/pending.scss';

interface PendingSellersProps {
  token: string; // token JWT do admin
}

export default function PendingSellers({ token }: PendingSellersProps) {
  const [sellers, setSellers] = useState<SellerProfileResponse[]>([]);

  /*Função para carregar vendedores pendentes do backend*/
  const loadPendingSellers = useCallback(async () => {
    try {
      const res = await api.get("/admin/pending");
      const pending = res.data.data.filter((s: SellerProfileResponse) => !s.isApproved);
      setSellers(pending);
    } catch (err) {
      console.error("Erro ao carregar vendedores:", err);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    //Busca inicial de vendedores pendentes
    (async () => {
      await loadPendingSellers();
    })();

    //Usa o socket global já conectado pelo AdminProvider
    const socket = getSocket();
    if (!socket) return;

    const handleNewPending = (newSeller: SellerProfileResponse) => {
      console.log("🔥 Novo vendedor recebido via socket:", newSeller);
      setSellers(prev => [...prev, newSeller]);
    };

    socket.on("newPendingProduct", handleNewPending);

    // Cleanup apenas remove listener
    return () => {
      socket.off("newPendingProduct", handleNewPending);
    };
  }, [token, loadPendingSellers]);

  // Aprovar vendedor
  const approveSeller = async (id: string) => {
    try {
      await api.put(`/sellers/${id}`, { isApproved: true });
      // remove localmente o vendedor aprovado
      setSellers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Erro ao aprovar vendedor:", err);
    }
  };

  return (
    <div className="pending-sellers">
      <h2>Vendedores Pendentes</h2>
      {sellers.length === 0 && <p>Não há vendedores pendentes</p>}

      <table>
        <thead>
          <tr>
            <th>Loja</th>
            <th>Usuário</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((s) => (
            <tr key={s.id}>
              <td>{s.storeName}</td>
              <td>{s.description} ({s.userId})</td>
              <td>
                <button
                  className="approve-btn"
                  onClick={() => approveSeller(s.id)}
                >
                  Aprovar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}