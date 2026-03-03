import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../service/userService";
import { CreateUserDTO, UpdateUserDTO } from "../types/user";
import { AppError } from "../error/AppError";
import { success } from "../utils/response";

const userService = new UserService();

export class UserController {

  async create(
    req: Request<{}, {}, CreateUserDTO>,/*Request<Params = {}, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>*/
    res: Response,
    next: NextFunction
  ) {
    try {

      const secret = process.env.JWT_SECRET; /*assinatura do token*/

      if (!secret) {
        throw new AppError("JWT_SECRET não configurado", 500);
      }

      const user = await userService.create(req.body);


      /*informacoes que o token carrega*/
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role
        },
        secret,
        { expiresIn: "1d" }
      );

      return success(
        res,
        {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        },
        "usuario criado com sucesso",
        201
      );

    } catch (err) {
      next(err);
    }
  }

  /*listando os users*/
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.list();
      success(res,users);
    } catch (err) {
      next(err);
    }
  }

  /*get pelo id*/
  async getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params; /*id string pelo do req*/

      if (!id) {
        throw new AppError("ID não informado", 400);
      }

      const user = await userService.findById(id);
      return success(res,user);

    } catch (err) {
      next(err);
    }
  }


  /*update o user */
  async update( /*Request<Params = {}, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>*/
    req: Request<{ id: string }, {}, UpdateUserDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {

      const { id } = req.params;

      if (!id) {
        throw new AppError("ID não informado", 400);
      }

      const user = await userService.update(id, req.body );/*o res.body ja vai validar os campos com o UpdateDTO*/
      return success(res,user);

    } catch (err) {
      next(err);
    }
  }

  /*deletando*/
  async remove(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {

      const { id } = req.params;

      if (!id) {
        throw new AppError("ID não informado", 400);
      }

      await userService.delete(id);
      return res.status(204).send();

    } catch (err) {
      next(err);
    }
  }
}
