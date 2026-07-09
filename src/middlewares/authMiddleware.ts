import { verifyToken } from "../services/tokenService.js";
import type { ExpressParam } from "../types/express/expressParam.js";

export const authMiddleware: ExpressParam = (req, res, next) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
        throw new Error ("SEM TOKEN");
    }

    const [type, token] = bearerToken.split (" ");
        const decoded = verifyToken (token);

        req.user = decoded;

        next();
    try {

    } catch (error) {
        res.
        status (401)
        .json ({message: "Invalid or expired token."})
    }
}