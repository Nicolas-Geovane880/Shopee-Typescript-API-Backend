import { supplierPrices } from "../constants/supplierPrices.js";
import type { OrderCreateSchema } from "../types/orderSchema.js";
import prisma from "../utils/prismaInstance.js";

export const save = async (dto: OrderCreateSchema, userId: number) => {
    return prisma.order.create ({
        data: {
            id_seller: dto.id_seller,
            userId: userId,
            revenue: dto.revenue,
            products: {
                createMany: {
                    data: dto.products.map ((product) => ({
                        sku: product.sku,
                        supplierPrice: (supplierPrices[product.sku] * product.quantity),
                        quantity: product.quantity,
                    })) 
                },
            },
        },
        include: {
            products: true,
        },
    });
};

export const findByUserId = async (userId: number) => {
    return prisma.order.findMany ({ 
        where: { userId: userId},
        include: {
            products: true
        }
     });
}