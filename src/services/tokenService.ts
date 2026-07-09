import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { AccessTokenResponseSchema, RefreshTokenResponseSchema } from "../types/tokenSchema.js";
import type { LoginResponseSchema } from "../types/authSchema.js";
import prisma from "../utils/prismaInstance.js";

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
        throw new Error ("Invalid token.");
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

    return prisma.refreshToken.create ({
        data: {
            userId,
            refreshTokenHash,
            expiresAt,
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
        where: {userId: userId},
    });
}

const existsRefreshToken = async (userId: number, refreshToken: string) => {
    const found = await prisma.refreshToken.findUnique ({where: {userId: userId}});

    if (!found) throw new Error ("Refresh Token not found.");

    if (!await bcrypt.compare (refreshToken, found.refreshTokenHash)) throw new Error ("Invalid Refresh Token.");

    return true;
}





