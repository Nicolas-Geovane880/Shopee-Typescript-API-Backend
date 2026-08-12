import { Decimal } from 'decimal.js'
import { findInInterval, findOrders } from "./orderService.js";
import prisma from '../utils/prismaInstance.js';

export const getUserDashboard = async (userId: number, date: string) => {
    const ordersPage = await findInInterval (userId, 1, 20, date, false);

    const allOrders = await findOrders (undefined, userId, undefined, false, date);

    const totalRevenue = calculateTotalRevenue (allOrders);
    const totalProfit = calculateTotalProfit (allOrders);
    const totalSupplierPrice = calculateTotalSupplierPrice (allOrders);

    const userShopCashInfos = await prisma.userShopCashInfos.findUnique ({where: {user_id: userId}});

    return {
        total_revenue_in_interval: totalRevenue,
        total_profit_in_interval: totalProfit,
        total_supplier_price_in_interval: totalSupplierPrice,
        total_profit_all_time: userShopCashInfos?.total_shop_profit,
        total_revenue_all_time: userShopCashInfos?.total_shop_revenue,
        total_supplier_price_all_time: userShopCashInfos?.total_supplier_price,
        orders: ordersPage.data,
        pagination: ordersPage.pagination,
    }
}

export const calculateTotalRevenue = (orders: any[]) => {
    const total = orders.reduce ((acc, order) => {
        if (!order.revenue) {
            return acc;
        }
        
        return acc.plus (order.revenue);
    }, new Decimal (0));

    return total.toNumber ()
};

export const calculateTotalProfit = (orders: any[]) => {
    const total = orders.reduce ((acc, order) => {
        if (!order.profit) {
            return acc;
        }
        return acc.plus (order.profit);
    }, new Decimal (0));

    return total.toNumber ();
}

export const calculateTotalSupplierPrice = (orders: any[]) => {
    const total = orders.reduce ((acc, order) => {
        return acc + order.products.reduce ((acc2: number, product: any) => {
            return acc2 + product.supplier_price;
        }, 0);
    }, 0);

    return total;
}

