import type { Order } from "@prisma/client";
import { ErrorMessage } from "../constants/errorMessage.js";
import { supplierPrices } from "../constants/supplierPrices.js";
import { ResourceNotFound } from "../exceptions/resourceNotFound.js";
import type { OrderCreateSchema } from "../types/orderSchema.js";
import prisma from "../utils/prismaInstance.js";

export const save = async (dto: OrderCreateSchema, userId: number) => {
    const profit = calculateProfit (dto);

    return prisma.order.create ({
        data: {
            id_seller: dto.idSeller,
            user_id: userId,
            revenue: dto.revenue === undefined ? 0 : dto.revenue,
            profit: profit,
            sold_date: new Date (dto.soldDate),
            products: {
                createMany: {
                    data: dto.products.map ((product) => ({
                        sku: product.sku,
                        supplier_price: (supplierPrices[product.sku] * product.quantity),
                        quantity: product.quantity,
                    })) 
                },
            },
        },
        select: {
            revenue: true, profit: true, id_seller: true,
            is_paid: true, sold_date: true,
            products: {
                select: {
                    sku: true,
                    supplier_price: true,
                    quantity: true
                }
            }
        },
    });
};

export const findInInterval = async (userId: number,
                                     page: number,
                                     size: number,
                                     date: string,
                                     isPaid: boolean) => {
    page = page > 0 ? page : 1;
    size = size > 0 && size <= 50 ? size : 20;
    const skip = (page - 1) * size;


    const [orders, ordersCount] = await prisma.$transaction ([
        findOrders (skip, userId, size, isPaid, date),

        prisma.order.count ({
            where: {user_id: userId, is_paid: false},
        }),
    ]);

    return {
        data: orders,
        pagination: {
            page, size, ordersCount,
            totalPages: Math.ceil (ordersCount / size),
            hasNextPage: page * size < ordersCount,
            hasPreviousPage: page > 1,
        },
    };
}

export const findOrders = (skip: number | undefined,
                    userId: number, size: number | undefined,
                    isPaid: boolean,
                    date: string) => {

    return prisma.order.findMany ({
            where: {user_id: userId, is_paid: isPaid, sold_date: date === "all-time"? undefined : new Date (date)},
            skip, take: size,
            orderBy: {
                sold_date: "desc"
            },
            select: {
                revenue: true, profit: true, id_seller: true,
                is_paid: true, sold_date: true,
                user: false,
                products: {
                    select: {
                        sku: true,
                        supplier_price: true,
                        quantity: true,
                    }
                }
            },
        })
}

export const setOrderAsPaid = async (idSeller: string) => {
    const order = await prisma.order.findUnique ({where: {id_seller: idSeller}, include: {products: true}});

    if (!order) throw new ResourceNotFound (400, ErrorMessage.ORDER_NOT_FOUND);

    await prisma.order.update ({
        where: {id_seller: idSeller},
        data: {
            is_paid: true,
        }
    });

    await updateUserShopCashInfo (order, order.products);
}

export const findById = async (idSeller: string) => {
    return prisma.order.findUnique ({
        where: {id_seller: idSeller},
        select: {
                revenue: true, profit: true, id_seller: true,
                is_paid: true, sold_date: true,
                user: false,
                products: {
                    select: {
                        sku: true,
                        supplier_price: true,
                        quantity: true,
                    }
                }
            },
    });
}

const calculateProfit = (dto: OrderCreateSchema) => {
    let profit = 0;
    
    if (typeof dto.revenue === "number") {
        profit = dto.revenue;

        dto.products.forEach (product => {
            profit -= (supplierPrices[product.sku] * product.quantity)
        });
    }

    return profit;
}

const updateUserShopCashInfo = async (order: Order, products: any[]) => {

    await prisma.userShopCashInfos.update ({
        where: {user_id: order.user_id},
        data: {
            total_shop_profit: {
                increment: order.profit === null ? 0.0 : order.profit,
            },
            total_shop_revenue: {
                increment: order.revenue === null ? 0.0 : order.revenue
            },
            total_supplier_price: {
                increment: products.reduce ((acc, product) => {
                    return acc + supplierPrices[product.sku] * product.quantity;
                }, 0)
            }
        }
    });
}