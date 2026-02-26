import { Link } from "react-router-dom";
import "../assets/styles/topBar.scss";
import { useAuth } from "./hooks/useAuth";
import { nintendoColors } from "./hooks/nColors";

type Letter = keyof typeof nintendoColors;

export default function TopBar() {
  const { user, isAuthenticated, logout } = useAuth();

  // Função para pegar a cor baseada na inicial do usuário
  const getButtonColor = (name?: string) => {
    if (!name || name.length === 0) return "#9ca3af"; // cor padrão
    const letter = name[0].toUpperCase() as Letter;
    return nintendoColors[letter] || "#9ca3af";
  };

 
  const buttonColor = getButtonColor(user?.name);

  return (
    <div className="topbar">
      <Link to="/dashboard" className="logo">
        OmniMarket
      </Link>

      <div className="right">
        {isAuthenticated && user ? (
          <>
            {user.role === "CUSTOMER" && (
              <Link to="/sellers" className="topbar-button">
                Vender
              </Link>
            )}

            {user.role === "SELLER" && (
              <Link
                to="/sellers"
                className="topbar-button my-store"
                style={{
                  backgroundColor: buttonColor, // cor baseada na inicial
                  color: "#fff",
                }}
              >
                Minha Loja
              </Link>
            )}



             {user.role === "ADMIN" && (
              <Link
                to="/sellers/pending"
                className="topbar-button central-adm"
    
              >
                central administrativa
              </Link>
            )}

            <div className="user-info">
              <span>Olá, {user.name}</span>

              {/* Botão de logout normal */}
              <button
                onClick={logout}
                style={{
                  backgroundColor: "#e60012",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  cursor: "pointer",
                }}
              >
                Sair
              </button>
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Cadastrar</Link>
          </div>
        )}
      </div>
    </div>
  );
}