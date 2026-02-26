import { useEffect, useState } from "react"
import { productService } from "../services/productServie"
import type { Product } from "../types/products/product"
import "../assets/styles/dashboard.scss"
import { API_URL } from "../services/api"

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productService.getAllProducts()
        setProducts(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message)
        } else {
          console.error("Erro ao carregar produtos")
        }
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const featuredProducts = products
    .filter((p) => p.ProductImage && p.ProductImage.length > 0)
    .slice(0, 10)

  useEffect(() => {
    if (featuredProducts.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === featuredProducts.length - 1 ? 0 : prev + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [featuredProducts])

  return (
    <div className="dashboard">
      <main className="main">
        {/* HERO */}
        <section className="hero">
          {featuredProducts.length > 0 && (
            <div
              key={featuredProducts[currentSlide].id} // 🔥 FORÇA RE-RENDER
              className="hero-slide"
              style={{
                backgroundImage: `url(${API_URL}${featuredProducts[currentSlide].ProductImage?.[0]?.url})`
              }}
            >
              <div className="hero-overlay">
                <div className="hero-content">
                  <h1>{featuredProducts[currentSlide].title}</h1>
                  <p>{featuredProducts[currentSlide].description}</p>
                  <span>
                    R$ {featuredProducts[currentSlide].price}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* PRODUTOS */}
        <section className="products-section">
          <h2>Todos os Produtos</h2>

          {loading ? (
            <p>Carregando produtos...</p>
          ) : products.length === 0 ? (
            <p>Você ainda não cadastrou produtos.</p>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  {product.ProductImage?.length > 0 && (
                    <img
                      src={`${API_URL}${product.ProductImage[0]?.url}`}
                      alt={product.title}
                      className="product-image"
                    />
                  )}

                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <span>R$ {product.price}</span>

                  <small>Loja: {product.SellerProfile.storeName}</small>
                  <small>Categoria: {product.Category.name}</small>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}