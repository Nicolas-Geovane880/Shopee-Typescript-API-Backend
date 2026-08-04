import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../utils/prismaInstance.js";
import { clearDatabase } from "../utils/clearDatabase.js";
import { generateAccessToken } from "../services/tokenService.js";
import type { OrderCreateSchema } from "../types/orderSchema.js";

describe ("save", () => {
    beforeEach (async () => {
        await clearDatabase ();
    });

    afterAll (async () => {
        await prisma.$disconnect ();
    })

    it ("Should save an order", async () => {
        const user = {
            name: "User test",
            email: "test@gmail.com",
            password_hash: "strong-password"
        }

        const existingUser = await prisma.user.create ({
            data: user
        });

        await prisma.userShopCashInfos.create ({
            data: {user_id: existingUser.id},
        })

        const accessToken = generateAccessToken (existingUser.id);

        const order: OrderCreateSchema = {
            idSeller: "ABC123",
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
            soldDate: "2026-07-20",
        };

        const response = await request (app)
            .post ("/orders/")
            .send (order)
            .set ("Authorization", `Bearer ${accessToken.code}`);
        
        console.log (response.body)

        expect (response.status).toBe (201);
        expect (response.body).toHaveProperty ("id_seller");
        expect (response.body).toHaveProperty ("products");
    });
})
