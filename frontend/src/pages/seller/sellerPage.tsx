// src/pages/seller/sellerPage.tsx
import { useState, useEffect } from "react";
import { useSeller } from "../../components/hooks/useSeller";
import { useNavigate } from "react-router-dom";
import '../../assets/styles/sellers/seller.scss'

export default function SellerPage() {
  const navigate = useNavigate();

  const {
    seller,
    loading,
    isSeller,
    isApproved,
    createSeller,
    updateSeller
  } = useSeller();

  // 🔹 Inputs do formulário sincronizados com o seller
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");

  // 🔹 Atualiza inputs sempre que o seller mudar (fetch inicial ou socket)
useEffect(() => {
  if (seller) {
    // adiando a atualização para o próximo tick
    setTimeout(() => {
      setStoreName(seller.storeName || "");
      setDescription(seller.description || "");
    }, 0);
  }
}, [seller]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isSeller) {
      await createSeller({ storeName, description });
    } else {
      await updateSeller({ storeName, description });
    }
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="seller-container">
      <div className="seller-card">
        <h1 className="seller-title">Área do Vendedor</h1>

        {!isSeller && (
          <>
            <h2 className="seller-subtitle">Tornar-se vendedor</h2>

            <form className="seller-form" onSubmit={handleSubmit}>
              <div>
                <label>Nome da Loja</label>
                <input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button type="submit">Criar Loja</button>
            </form>
          </>
        )}

        {isSeller && !isApproved && (
          <div className="seller-status pending">
            <h2 className="seller-subtitle">Sua loja está em análise</h2>
            <p>Aguarde aprovação do administrador.</p>
          </div>
        )}

        {isSeller && isApproved && seller && (
          <div>
            <h2 className="seller-subtitle">Minha Loja</h2>

            <div className="seller-info">
              <p><strong>Nome:</strong> {seller.storeName}</p>
              <p><strong>Descrição:</strong> {seller.description}</p>
            </div>

            <hr />

            <h3 className="seller-subtitle">Editar Loja</h3>

            <form className="seller-form" onSubmit={handleSubmit}>
              <input
                placeholder="Novo nome"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
Q
              <textarea
                placeholder="Nova descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="button-group">
                <button type="submit">Atualizar</button>
                <button
                  className="meusProdutos"
                  type="button"
                  onClick={() => navigate("/products/me")}
                >
                  Meus Produtos
                </button>
                <button
                  className="cadastrarProduto"
                  type="button"
                  onClick={() => navigate("/categories")}
                >
                  Cadastrar Produto
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}