import { AppError } from "../error/AppError";
import { prisma } from "../lib/prisma"
import { UpdateProductInput } from "../types/product";
import fs from "fs";
import path from "path";



export class ProductService {

  /*listando todos os produtos*/
  async getAll(categoryId?: string) {
    return prisma.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        SellerProfile: true,
        Category: true,
        ProductImage: true,
      },
    });
  }

  /*pegando pelo id do User*/
  async getByUser(userId: string) {
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId }
    });

    if (!sellerProfile) {
      throw new AppError("Seller profile não encontrado", 404);
    }

    return prisma.product.findMany({
      where: { sellerId: sellerProfile.id },
      include: {
        ProductImage: true,
        Category: true,
      }
    });
  }

  /* pegando pelo id do product*/
  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        SellerProfile: true,
        Category: true,
        ProductImage: true,
        Review: true,
      },
    });

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    return product;
  }

  /*cria o product*/
  async create(data: any, file: any, userId: string) {

    // pega o seller logado
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId }
    });

    if (!sellerProfile) {
      throw new AppError("Seller profile não encontrado", 404);
    }

    let imageUrl = null;

    if (file) {
      imageUrl = `/uploads/${file.filename}`;
    }

    return prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),

        categoryId: data.categoryId,
        sellerId: sellerProfile.id,

        ProductImage: imageUrl
          ? {
            create: {
              url: imageUrl,
            },
          }
          : undefined,
      },
      include: {
        ProductImage: true,
        Category: true,
        SellerProfile: true,
      },
    });
  }

  /* att o product*/
  async update({ productId, userId, role, data }: UpdateProductInput) {

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    return prisma.product.update({
      where: { id: productId },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        stock: data.stock,
        ...(data.categoryId && { categoryId: data.categoryId }),
      },
    });
  }

  async delete(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { ProductImage: true },
    });

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    if (product.ProductImage.length > 0) /*c o array estiver vazio n vai executar*/ {
      for (const image of product.ProductImage) {
        const fileName = path.basename(image.url);
        const filePath = path.join(__dirname, "../uploads", fileName);/*caminho absoluto*/

        if (fs.existsSync(filePath))/*verifica c o arquivo realmente existe*/ {
          fs.unlinkSync(filePath);
          console.log("Imagem apagada:", filePath);
        } else {
          console.warn("Arquivo não encontrado:", filePath);
        }
      }
    }

    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    return prisma.product.delete({
      where: { id },
    });
  }
}