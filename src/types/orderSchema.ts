import { z } from "zod";

export const productCreateSchema = z.object ({
    sku: z.string (),
    quantity: z.number (), 
});

export const orderCreateSchema = z.object ({
    id_seller: z.string (),
    products: z.array (productCreateSchema),
    revenue: z.number ().optional (),
});

export type ProductCreateSchema = z.infer <typeof productCreateSchema>;

export type OrderCreateSchema = z.infer <typeof orderCreateSchema>;