import { Request, Response, NextFunction } from "express";
import { ProductService } from "../service/productService";
import { AppError } from "../error/AppError";
import { success } from "../utils/response";
import fs from "fs";
import path from "path";

const productService = new ProductService();

export class ProductController {

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;

      const products = await productService.getAll(
        category as string | undefined
      );

      return success(res, products, "Produtos listados com sucesso");
    } catch (err) {
      next(err);
    }
  }

  async getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const product = await productService.getById(id);

      return success(res, product, "Produto encontrado");
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id; //vem do middleware de auth

      const product = await productService.create(
        req.body,
        req.file,
        userId
      );

      return success(res, product, "Produto criado com sucesso");
    } catch (err) {
      next(err);
    }
  }

  async getMyProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getByUser(req.user.id);

      return success(res, products, "Seus produtos listados com sucesso");
    } catch (err) {
      next(err);
    }
  }

  async patchProduct(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const updatedProduct = await productService.update({
        productId: id,
        userId: req.user.id,
        role: req.user.role,
        data: req.body,
      });

      return success(res, updatedProduct, "Produto atualizado com sucesso");
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Pega o produto antes de deletar
      const product = await productService.getById(id);
      if (!product) throw new AppError("Produto não encontrado", 404);


      // 🔹 Apaga todas as imagens do produto
     if (product.ProductImage && product.ProductImage.length > 0) {
  for (const image of product.ProductImage) {
    // Pega apenas o nome do arquivo
    const fileName = path.basename(image.url);
    const filePath = path.join(__dirname, "../uploads", fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Imagem apagada:", filePath);
    } else {
      console.warn("Arquivo não existe:", filePath);
    }
  }
}
      // Deleta o produto no banco
      await productService.delete(id);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}