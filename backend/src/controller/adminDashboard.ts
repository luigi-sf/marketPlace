import { Request, Response, NextFunction } from "express";
import { AdminDashboardService } from "../service/adminDash";
import { AppError } from "../error/AppError";
import { success } from "../utils/response";

export class AdminController {
  private service = new AdminDashboardService();

  async dashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.execute();
      return success(res, data);
    } catch (error) {
      next(error);
    }
  }

  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.service.getActiveUsers();
      return success(res, users);
    } catch (error) {
      next(error);
    }
  }

  async deactivate(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("ID do usuário é obrigatório", 400);
      }

      await this.service.deactivateUser(id);

      return success(res, null, "Usuário desativado com sucesso");
    } catch (error) {
      next(error);
    }
  }

  async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.service.getProducts();
      return success(res, products);
    } catch (error) {
      next(error);
    }
  }

   async getPending(req: Request, res: Response, next: NextFunction) {
    try {
      const pending = await this.service.getPendingSellers();
      return success(res, pending, "Vendedores pendentes carregados");
    } catch (err) {
      
      next(err);
    }
  }

  async deleteProduct(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("ID do produto é obrigatório", 400);
      }

      await this.service.deleteProduct(id);

      return success(res, null, "Produto excluído com sucesso");
    } catch (error) {
      next(error);
    }
  }
}