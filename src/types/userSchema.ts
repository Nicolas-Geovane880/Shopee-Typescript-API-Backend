import { z } from "zod";

export const userCreateSchema = z.object ({
    name: z.string ().min (10, "Name must have at least 10 characters."),
    email: z.email ("Inform a valid email."),
    password: z.string ().min (8, "Password must have at least 8 characters."),
});

export const userResponseSchema = z.object ({
    id: z.number (),
    name: z.string (),
    email: z.email (),
    createdAt: z.date (),
});

export type UserCreateSchema = z.infer<typeof userCreateSchema>;