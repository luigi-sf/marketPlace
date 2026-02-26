import { useEffect, useState } from "react";
import api from "../services/api";
import type { SellerProfileResponse } from "../types/seller/seller";
import '../assets/styles/pending.scss'

export default function PendingSellers() {
  const [sellers, setSellers] = useState<SellerProfileResponse[]>([]);

  useEffect(() => {
  const loadPendingSellers = async () => {
    try {
      const res = await api.get("/sellers/pending");
      console.log(res.data); // status, message, data
      const pending = res.data.data.filter((s: SellerProfileResponse) => !s.isApproved);
      setSellers(pending);
    } catch (err) {
      console.error(err);
    }
  };

  loadPendingSellers();
}, []);

  const approveSeller = async (id: string) => {
  try {
    await api.put(`/sellers/${id}`, { isApproved: true });
    const res = await api.get("/sellers/pending");
    const pending = res.data.data.filter((s: SellerProfileResponse) => !s.isApproved);
    setSellers(pending);
  } catch (err) {
    console.error(err);
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