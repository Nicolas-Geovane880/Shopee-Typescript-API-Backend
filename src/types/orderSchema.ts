import type { Prisma } from "@prisma/client";
import { z } from "zod";

export const productCreateSchema = z.object ({
    sku: z.string (),
    quantity: z.number (), 
});

export const orderCreateSchema = z.object ({
    idSeller: z.string (),
    products: z.array (productCreateSchema),
    revenue: z.number ().optional (),
    soldDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: "Invalid format. Use YYYY-MM-DD",}),
});

export type ProductCreateSchema = z.infer <typeof productCreateSchema>;

export type OrderCreateSchema = z.infer <typeof orderCreateSchema>;

export type OrderWithProducts = Prisma.OrderGetPayload<{
    include: {
        products: true,
    }
}>