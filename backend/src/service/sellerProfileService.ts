import { prisma } from "../lib/prisma";
import { AppError } from "../error/AppError";
import { CreateSellerProfileDTO, UpdateSellerProfileDTO } from "../types/sellerProfile";
import { Role } from "@prisma/client";

export class SellerProfileService {

  /*cria com o id do user*/
  async create(data: CreateSellerProfileDTO) {

    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user)
      throw new AppError("Usuário não encontrado", 404);

    const alreadyExists = await prisma.sellerProfile.findUnique({
      where: { userId: data.userId }
    });

    if (alreadyExists)
      throw new AppError("Usuário já possui perfil de vendedor", 400);

    /*att o role do user pra seller*/

    /*transation passa o valor c td der certo c n ele n passa nd*/
    const seller = await prisma.$transaction(async (tx) => {  /*tx vai subistituir o prima.*/
      const created = await tx.sellerProfile.create({ data }); /*criando o sellerProfile*/
      await tx.user.update({
        where: { id: data.userId },
        data: { role: "SELLER" }
      });
      return created;

    });
    return seller
  }

   /*pegando pelo id*/
  async getById(id: string) {
    const seller = await prisma.sellerProfile.findUnique({
      where: { id },
      include: {
        Product: true,
        User: {
          select: {
            id: true,
            role:true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!seller)
      throw new AppError("Perfil de vendedor não encontrado", 404);

    return seller;
  }

  /*listando todos os sellers*/
  async getAll() {
    return prisma.sellerProfile.findMany({
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }



  /*att o seller*/
  async update(id: string, data: UpdateSellerProfileDTO) {

    const seller = await prisma.sellerProfile.findUnique({
      where: { id }
    });

    if (!seller)
      throw new AppError("Perfil de vendedor não encontrado", 404);

    return prisma.sellerProfile.update({
      where: { id },
      data
    });
  }

  /*deletando o seller*/
  async delete(id: string) {

    const seller = await prisma.sellerProfile.findUnique({
      where: { id }
    });

    if (!seller)
      throw new AppError("Perfil de vendedor não encontrado", 404);

    return prisma.sellerProfile.delete({
      where: { id }
    });
  }

  /*buscando pelo userId*/
  async findByUserId(userId: string) {
    const seller = await prisma.sellerProfile.findUnique({
      where: { userId },
      include: {
        User: {
          select: {
            id: true,
            role:true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!seller)
      throw new AppError("Perfil de vendedor não encontrado", 404);

    return seller;
  }
}

