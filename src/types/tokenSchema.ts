import { z } from "zod";

export const accessTokenResponseSchema = z.object ({
    code: z.string (),
    expiresAt: z.date(),
});

export const refreshTokenResponseSchema = z.object ({
    id: z.string (),
    code: z.string (),
    expiresAt: z.date (),
});

export type AccessTokenResponseSchema = z.infer <typeof accessTokenResponseSchema>;

export type RefreshTokenResponseSchema = z.infer <typeof refreshTokenResponseSchema>;



