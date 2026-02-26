import { useEffect, useState } from 'react'
import { productService } from '../../services/productServie'
import type { Product } from '../../types/products/product'
import { useNavigate } from 'react-router-dom'
import '../../assets/styles/myProduct.scss'

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productService.getMyProducts()
        setProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return <div className="my-products"><p>Carregando produtos...</p></div>
  }
  console.log(products)


  async function handleDelete(id: string) {
  const confirmDelete = window.confirm(
    "Tem certeza que deseja excluir este produto?"
  );

  if (!confirmDelete) return;

  try {
    await productService.delete(id);

    // remove da lista sem reload (melhor prática)
    setProducts((prev) => prev.filter((product) => product.id !== id));
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Erro ao excluir produto");
    }
  }
}

  return (
    <div className="my-products">
      <div className="header">
        <h1>Meus Produtos</h1>
        <button onClick={() => navigate('/categories')}>
          + Novo Produto
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty">
          <p>Você ainda não cadastrou produtos.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="card-body">
                <h3>{product.title}</h3>
                <p className="price">
                  R$ {product.price.toFixed(2)}
                </p>
                <p className="stock">
                  Estoque: {product.stock}
                </p>
              </div>

              <div className="card-actions">
                <button
                  className="edit"
                  onClick={() => navigate(`/products/${product.id}/edit`)}
                >
                  Editar
                </button>

                <button className="delete"
                  onClick={() => handleDelete(product.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}