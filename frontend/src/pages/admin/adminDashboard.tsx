import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminDash";
import type { AdminDashboardResponse } from "../../types/adminDash";
import "../../assets/styles/Admin/adminDash.scss";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await adminService.getDashboard();
        setData(response);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) return <p className="loading">Carregando dashboard...</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <span>Painel administrativo</span>
      </header>
      

      <section className="dashboard-grid">
        <div className="stat-card">
          <div>
            <h2>{data?.pendingSellers}</h2>
            <p>Usuários Pendentes</p>
          </div>
          <button onClick={() => navigate("/admin/pending")}>
            Gerenciar
          </button>
        </div>

        <div className="stat-card">
          <div>
            <h2>{data?.activeUsers}</h2>
            <p>Usuários Ativos</p>
          </div>
          <button onClick={() => navigate("/admin/activeUsers")}>
            Visualizar
          </button>
        </div>

        <div className="stat-card">
          <div>
            <h2>{data?.totalProducts}</h2>
            <p>Total de Produtos</p>
          </div>
          <button onClick={() => navigate("/admin/viewProducts")}>
            Acessar
          </button>
        </div>
      </section>
    </div>
  );
}