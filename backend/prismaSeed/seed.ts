import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  // --- Categorias ---
  const categories = [
    { name: "Informática", slug: "informatica", image: "/images/category/informatica.jpg" },
    { name: "Eletrônicos", slug: "eletronicos", image: "/images/category/eletronicos.jpg" },
    { name: "Roupas", slug: "roupas", image: "/images/category/roupas.jpg" },
    { name: "Suplementos", slug: "suplementos", image: "/images/category/suplementos.jpg" },
    { name: "Casa e Cozinha", slug: "casa-cozinha", image: "/images/category/casa.jpg" },
    { name: "Esportes", slug: "esportes", image: "/images/category/esportes.jpg" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { image: category.image },
      create: category,
    });
  }
  console.log("🌱 Categorias seedadas com sucesso");

  // --- Usuário Admin ---
  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@omnimarket.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@omnimarket.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("🌱 Usuário admin seedado com sucesso");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });