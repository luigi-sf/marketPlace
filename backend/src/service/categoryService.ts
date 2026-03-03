import { prisma } from "../lib/prisma";

export const categoryService = {
  async list() {
    return prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: true
      },
      orderBy: {
        name: "asc" /*ordem alfabetica*/
      }
    });
  }
};