// CategoryPage.tsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Category } from "../../types/products/category";
import "../../assets/styles/category.scss";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="category-page">
      <h1 className="title">Categorias</h1>

      <div className="category-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to="/products"
            state={{ selectedCategory: cat }}
            className="category-card"
          >
            <img src={cat.image} alt={cat.name} />
            <p>{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}