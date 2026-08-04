import * as authService from "../services/authService.js";
import { loginSchema, validateCodeSchema } from "../types/authSchema.js";
import type { ExpressParam } from "../types/express/expressParam.js";
import { userCreateSchema } from "../types/userSchema.js";
import { refreshToken } from "../services/tokenService.js";

const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

export const signup: ExpressParam = async (req, res, next) => {
    try {
        const dto = userCreateSchema.parse (req.body);
        const response = await authService.signup (dto);

        res.status(201).json(response);
    } catch (error) {
        next (error);
    }
}

export const login: ExpressParam = async (req, res, next) => {
    try {
        const dto = loginSchema.parse (req.body);
        const response = await authService.login (dto);

        res.status(200).json(response);
    } catch (error) {
        next (error);
    }
}

export const validateCode: ExpressParam = async (req, res, next) => {
    try {
        const dto = validateCodeSchema.parse (req.body);
        const response = await authService.validateCode (dto);

        res.status(200).json(response);
    } catch (error) {
        next (error);
    }
} 

export const resendLoginCode: ExpressParam = async (req, res, next) => {
    try {
        const response = await authService.resendLoginCode (String (req.params.challengeId));

        res.status(200).json(response);
    } catch (error) {
        next (error);
    }
} 

export const refresh: ExpressParam = async (req, res, next) => {
    try {
        const response = await refreshToken (req.body.refreshToken);

        res.status(200).json(response);
    } catch (error) {
        next (error);
    }
}

export const isAuthenticated: ExpressParam = async (req, res, next) => {
    try {
        await authService.isAuthenticated (req.user?.userId!);

        res.status(200).send ();
    } catch (error) {
        next (error);
    }
}

export const sendForgotPasswordLink: ExpressParam = async (req, res, next) => {
    try {
        console.log ("ENVIOU EMAIL PARA: " + req.body.email);
        
        await authService.sendForgotPasswordLink (req.body.email);

        res.status(200).send ();
    } catch (error) {
        next (error);
    }
}

export const resetPassword: ExpressParam = async (req, res, next) => {
    try {
        await authService.resetPassword (req.body.newPassword, req.body.token);

        res.status(200).send ();
    } catch (error) {
        next (error);
    }
}
