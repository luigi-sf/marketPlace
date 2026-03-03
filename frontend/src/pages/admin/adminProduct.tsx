import { useEffect, useState } from "react";
import { adminService } from "../../services/adminDash";
import "../../assets/styles/Admin/adminProducts.scss";
import type { Product } from "../../types/products/product";

export default function ActiveProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await adminService.getProducts();
      setProducts(response);
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    const confirmAction = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmAction) return;

    try {
      await adminService.deleteProduct(id);

      // remove da lista local
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto", error);
    }
  }

  if (loading) return <p className="loading">Carregando produtos...</p>;

  return (
    <div className="active-products">
      <h2>Produtos Ativos</h2>

      {products.length === 0 && <p>Não há produtos cadastrados</p>}

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Seller</th>
            <th>Ação</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>R$ {product.price.toFixed(2)}</td>
              <td>{product.id}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteProduct(product.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}