import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { AppError } from "../error/AppError";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { success } from "../utils/response";

export class AuthController {

  private generateToken(user: {
    id: string;
    email: string;
    role: Role;
    sellerProfileId?: string | null;
  }) {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não definido");
    }

    return Jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        sellerProfileId: user.sellerProfileId ?? null
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        throw new AppError("Email ou senha inválidos", 400);

      const user = await prisma.user.findUnique({
        where: { email },
        include: { SellerProfile: true }
      });

      if (!user)
        throw new AppError("Email ou senha inválidos", 401);

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch)
        throw new AppError("Email ou senha inválidos", 401);

      const token = this.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        sellerProfileId: user.SellerProfile?.id ?? null
      });

      return success(
        res,
        {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            sellerProfile: user.SellerProfile
              ? {
                  id: user.SellerProfile.id,
                }
              : null
          }
        },
        "Usuário logado com sucesso",
        200
      );

    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password)
        throw new AppError("Nome, email e senha são obrigatórios", 400);

      const userExists = await prisma.user.findUnique({
        where: { email }
      });

      if (userExists) 
        throw new AppError("Usuário já existe", 400);

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role === "SELLER" ? "SELLER" : "CUSTOMER"
        },
        include: { SellerProfile: true }
      });

      const token = this.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        sellerProfileId: user.SellerProfile?.id ?? null
      });

      return success(
        res,
        {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            sellerProfile: null 
          }
        },
        "Usuário registrado com sucesso",
        201
      );

    } catch (err) {
      next(err);
    }
  }
}