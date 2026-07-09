import * as authService from "../services/authService.js";
import { loginSchema } from "../types/authSchema.js";
import type { ExpressParam } from "../types/express/expressParam.js";
import { userCreateSchema } from "../types/userSchema.js";
import { refreshToken } from "../services/tokenService.js";

export const signup: ExpressParam = async (req, res, next) => {
    try {
        const signupDto = userCreateSchema.parse (req.body);
        const signupResponse = await authService.signup (signupDto);

        res.status(201).json(signupResponse);
    } catch (error) {
        console.log (error);
        next();
    }
}

export const login: ExpressParam = async (req, res, next) => {
    try {
        const loginDto = loginSchema.parse (req.body);
        const loginResponse = await authService.login (loginDto);

        res.status(200).json(loginResponse);
    } catch (error) {
        console.log (error);
        next();
    }
}

export const refresh: ExpressParam = async (req, res, next) => {
    try {
        const tokenResponse = await refreshToken (req.body.refreshToken);

        res.status(200).json(tokenResponse);
    } catch (error) {
        console.log (error);
        next ();
    }
}