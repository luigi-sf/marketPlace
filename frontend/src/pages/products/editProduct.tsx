import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productServie";
import type { Product } from "../../types/products/product";
import '../../assets/styles/editProduct.scss'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        if (!id) return;

        const data = await productService.getById(id);
        setProduct(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro ao carregar produto");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (!product) return;

    setProduct({
      ...product,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product || !id) return;

    try {
      setSaving(true);
      setError("");

      await productService.update(id, {
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.Category?.id, // caso seja relação
      });

      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao atualizar produto");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (!product) return <p>Produto não encontrado</p>;

  return (
  <div className="edit-product-container">
    <div className="edit-product-card">
      <h1 className="edit-product-title">Editar Produto</h1>

      {error && (
        <div className="edit-product-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-product-form">
        <input
          type="text"
          name="title"
          value={product.title}
          onChange={handleChange}
          placeholder="Título"
          className="edit-product-input"
          required
        />

        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Descrição"
          className="edit-product-textarea"
        />

        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Preço"
          className="edit-product-input"
          required
        />

        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          placeholder="Estoque"
          className="edit-product-input"
          required
        />

        <button
          type="submit"
          disabled={saving}
          className="edit-product-button"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  </div>
);}