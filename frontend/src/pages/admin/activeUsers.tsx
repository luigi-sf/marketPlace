import { useEffect, useState } from "react";
import { adminService } from "../../services/adminDash";
import "../../assets/styles/Admin/activeUsers.scss";
import type { AdminUser } from "../../types/adminDash";

export default function ActiveUsersPage() {
  const [users, setUsers] = useState< AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
  try {
    const response = await adminService.getUsers();
    setUsers(response);
  } catch (error) {
    console.error("Erro ao buscar usuários", error);
  } finally {
    setLoading(false);
  }
}
  async function deactivateUser(id: string) {
    const confirmAction = window.confirm(
      "Tem certeza que deseja desativar este usuário?"
    );

    if (!confirmAction) return;

    try {
      await adminService.deactivateUser(id);

      // Atualiza a lista removendo o usuário desativado
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Erro ao desativar usuário", error);
    }
  }

  if (loading) return <p className="loading">Carregando usuários...</p>;

  return (
    <div className="active-users">
      <h2>Usuários Ativos</h2>

      {users.length === 0 && <p>Não há usuários ativos</p>}

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ação</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="deactivate-btn"
                  onClick={() => deactivateUser(user.id)}
                >
                  Desativar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}