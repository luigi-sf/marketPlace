// src/controller/sellerProfileController.ts
import { Request, Response, NextFunction } from "express";
import { SellerProfileService } from "../service/sellerProfileService";
import { AppError } from "../error/AppError";
import { success } from "../utils/response";
import { getIo } from "../socket";

export class SellerProfileController {
  private service = new SellerProfileService();

  // 🔹 Criar seller
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("Usuário não autenticado", 401);

      const seller = await this.service.create({
        userId: req.user.id,
        storeName: req.body.storeName,
        description: req.body.description,
      });

      return success(res, seller, "Perfil de vendedor criado com sucesso");
    } catch (error) {
      next(error);
    }
  }

  // 🔹 Listar todos os sellers
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const sellers = await this.service.getAll();
      return success(res, sellers);
    } catch (error) {
      next(error);
    }
  }

  // 🔹 Pegar seller pelo próprio usuário
  async getMyStore(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("Usuário não autenticado", 401);

      const seller = await this.service.findByUserId(req.user.id);
      return success(res, seller);
    } catch (error) {
      next(error);
    }
  }

  // 🔹 Atualizar seller logado
  async updateMyStore(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("Usuário não autenticado", 401);

      const seller = await this.service.findByUserId(req.user.id);

      const updated = await this.service.update(seller.id, req.body);

      // Emite socket apenas para este seller
      const io = getIo();
      io.to(req.user.id).emit("seller:updated", updated);

      return success(res, updated, "Perfil de seller atualizado");
    } catch (error) {
      next(error);
    }
  }

  // 🔹 Aprovar seller (admin)
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) throw new AppError("ID do seller não fornecido", 400);

      const updated = await this.service.update(id, { isApproved: true });

      // Emite socket para todos ou apenas o seller aprovado
      const io = getIo();
      io.emit("seller:approved", { userId: updated.userId });

      return success(res, updated, "Seller aprovado com sucesso");
    } catch (error) {
      next(error);
    }
  }

  // 🔹 Pegar seller por ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const seller = await this.service.getById(id);
      return success(res, seller);
    } catch (error) {
      next(error);
    }
  }

  // 🔹 Deletar seller
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const deleted = await this.service.delete(id);
      return success(res, deleted, "Perfil de seller deletado");
    } catch (error) {
      next(error);
    }
  }
}