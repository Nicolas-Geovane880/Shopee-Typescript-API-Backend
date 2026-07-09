import { z } from "zod";
import { accessTokenResponseSchema, refreshTokenResponseSchema } from "./tokenSchema.js";

export const loginSchema = z.object ({
    email: z.email (),
    password: z.string (),
});

export const loginResponseSchema = z.object ({
    accessToken: accessTokenResponseSchema,
    refreshToken: refreshTokenResponseSchema,
});

export type LoginResponseSchema = z.infer <typeof loginResponseSchema>;


export type LoginSchema = z.infer <typeof loginSchema>;
