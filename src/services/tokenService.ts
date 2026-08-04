import type { AccessTokenResponseSchema, RefreshTokenResponseSchema } from "../types/tokenSchema.js";
import { InvalidTokenException } from "../exceptions/invalidTokenException.js";
import type { LoginResponseSchema } from "../types/authSchema.js";
import { ErrorMessage } from "../constants/errorMessage.js";
import prisma from "../utils/prismaInstance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const generateTokens = async (userId: number) : Promise<LoginResponseSchema> => {
    const accessTokenResponse = generateAccessToken (userId);
    const refreshTokenResponse = await generateRefreshToken (userId);

    return {
        accessToken: accessTokenResponse, 
        refreshToken: refreshTokenResponse,
    }
}

export const generateAccessToken = (userId: number) : AccessTokenResponseSchema => {
    const accessToken =  jwt.sign ({id: userId}, getJwtSecret(), { expiresIn: "7d" });
    const accessTokenExpiresAt = new Date ();
    accessTokenExpiresAt.setDate (accessTokenExpiresAt.getDate() + 7);

    return {
        code: accessToken,
        expiresAt: accessTokenExpiresAt,
    }
}

export const generateRefreshToken = async (userId: number) : Promise<RefreshTokenResponseSchema> => {
    const refreshToken = jwt.sign ({id: userId}, getJwtSecret(), { expiresIn: "30d" });
    const refreshTokenExpiresAt = new Date ();
    refreshTokenExpiresAt.setDate (refreshTokenExpiresAt.getDate() + 30);

    const savedRefreshToken = await saveRefreshToken (userId, refreshToken, refreshTokenExpiresAt);

    return {
        id: savedRefreshToken.id,
        code: refreshToken,
        expiresAt: refreshTokenExpiresAt,
    }
}

export const verifyToken = (token: string) => {
    const decoded = jwt.verify (token, getJwtSecret());

    if (!decoded || decoded === null || typeof decoded !== "object" || !("id" in decoded)) {
        throw new InvalidTokenException (401, ErrorMessage.INVALID_TOKEN);
    }

    return {
        userId: Number (decoded.id),
    }
}

export const refreshToken = async (refreshToken: string) : Promise<LoginResponseSchema> => {
    const decoded = verifyToken (refreshToken);

    await existsRefreshToken (decoded.userId, refreshToken);

    await deleteRefreshTokensByUserId (decoded.userId);

    return generateTokens (decoded.userId);
} 

const saveRefreshToken = async (userId: number, refreshToken: string, expiresAt: Date) => {
    const refreshTokenHash = await bcrypt.hash (refreshToken, 10);

    await deleteRefreshTokensByUserId (userId);

    return prisma.refreshToken.create ({
        data: {
            user_id: userId,
            refresh_token_hash: refreshTokenHash,
            expires_at: expiresAt,
        },
    });
}

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error ();
    }

    return secret;
}

const deleteRefreshTokensByUserId = async (userId: number) => {
    await prisma.refreshToken.deleteMany ({
        where: {user_id: userId},
    });
}

const existsRefreshToken = async (userId: number, refreshTokenStr: string) => {
    const refreshToken = await prisma.refreshToken.findUnique ({where: {user_id: userId}});

    if (!refreshToken) throw new InvalidTokenException (400, ErrorMessage.REFRESH_TOKEN_NOT_FOUND);

    if (!await bcrypt.compare (refreshTokenStr, refreshToken.refresh_token_hash)) throw new InvalidTokenException (400, ErrorMessage.INVALID_REFRESH_TOKEN);

    return true;
}





