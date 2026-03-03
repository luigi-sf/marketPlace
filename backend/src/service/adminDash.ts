import { prisma } from "../lib/prisma";

export class AdminDashboardService {
  async execute() {
    const activeUsers = await prisma.user.count({
      where: { isActive: true }
    });

    const pendingSellers = await prisma.sellerProfile.count({
      where: { isApproved: false }
    });

    const totalProducts = await prisma.product.count();

    return {
      activeUsers,
      pendingSellers,
      totalProducts
    };
  }
  async getActiveUsers() {
    return prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true
      }
    });
  }

  async deactivateUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false }
    });
  }


  async getPendingSellers() {
    return prisma.sellerProfile.findMany({
      where: { isApproved: false },
      select: {
        id: true,
        storeName: true,
        description: true,
        userId: true
      }
    });
  }

  async approveSeller(id: string) {
    return prisma.sellerProfile.update({
      where: { id },
      data: { isApproved: true }
    });
  }


  async getProducts() {
    return prisma.product.findMany({
      select: {
        id: true,
        description: true,
        stock: true,
        categoryId: true,
        title: true,
        price: true,
        sellerId: true
      }
    });
  }

  async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id }
    });
  }
}
