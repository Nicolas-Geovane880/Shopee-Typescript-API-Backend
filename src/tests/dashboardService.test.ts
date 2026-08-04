import { describe, it, expect } from "vitest";
import { calculateTotalRevenue } from "../services/dashboardService.js";
import { Decimal } from 'decimal.js'

describe ("calculateTotalRevenue", () => {

    it ("Should calculate total revenue", () => {
        const order = [
            {
                id_seller: "ABC123",
                revenue: new Decimal (250.79),
                products: [
                    {
                        sku: "KIT02-20-ACUSTICO",
                        quantity: 2
                    },
                    {
                        sku: "KIT02-40-ACUSTICO",
                        quantity: 1
                    }
                ],
                sold_date: new Date()
            },
            {
                id_seller: "ABC123",
                revenue: new Decimal (150.79),
                products: [
                    {
                        sku: "KIT02-20-ACUSTICO",
                        quantity: 2
                    },
                    {
                        sku: "KIT02-40-ACUSTICO",
                        quantity: 1
                    }
                ],
                sold_date: new Date()
            }
        ];

        const totalRevenue = calculateTotalRevenue (order);

        expect (totalRevenue).toBe (401.58);
    })
})