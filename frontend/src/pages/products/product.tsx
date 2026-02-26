import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Category } from "../../types/products/category";
import { productService } from "../../services/productServie";
import "../../assets/styles/product.scss";

interface LocationState {
  selectedCategory: Category;
}

export default function CreateProductPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState };
  const category = location.state.selectedCategory;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("O nome do produto é obrigatório.");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Informe um preço válido maior que 0.");
      return;
    }

    if (!stock || Number(stock) < 0) {
      alert("Informe um estoque válido.");
      return;
    }

    if (!category?.id) {
      alert("Categoria inválida.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", name);
      formData.append("description", description);
      formData.append("price", String(price));
      formData.append("stock", String(stock));
      formData.append("categoryId", category.id);

      if (image) {
        formData.append("image", image);
      }

      await productService.createWithImage(formData);

      alert(`Produto "${name}" cadastrado com sucesso!`);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar produto");
    }
  };

  return (
    <div className="create-product-page">
      <h1>Cadastrar Produto</h1>
      <p>
        Categoria selecionada: <strong>{category.name}</strong>
      </p>

      <form className="create-product-form" onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Descrição:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </label>

        <label>
          Preço:
          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />
        </label>

        <label>
          Estoque:
          <input
            type="number"
            value={stock}
            onChange={(e) =>
              setStock(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />
        </label>

        <label>
          Imagem do Produto:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setImage(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </label>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "200px",
              marginTop: "10px",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        )}

        <button type="submit">Cadastrar Produto</button>
      </form>
    </div>
  );
}