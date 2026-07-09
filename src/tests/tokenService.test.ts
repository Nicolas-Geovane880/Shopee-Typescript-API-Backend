import { describe, it, expect } from "vitest";
import { generateAccessToken, verifyToken } from "../services/tokenService.js"

describe ("generateAccessToken", () => {
    it ("Should generate access token", () => {
        const userId = 1;

        const accessTokenResult = generateAccessToken (userId);

        expect (accessTokenResult).toHaveProperty ("code");
        expect (accessTokenResult).toHaveProperty ("expiresAt");
    });
});

describe ("verifyToken", () => {
    it ("Should verify a valid token", () => {
        const userId = 1;

        const accessTokenResult = generateAccessToken (userId);

        const verified = verifyToken (accessTokenResult.code);

        expect (typeof verified).toBe ("object")
        expect (verified).toHaveProperty ("userId");
        expect (typeof verified.userId).toBe ("number");
    });
});

