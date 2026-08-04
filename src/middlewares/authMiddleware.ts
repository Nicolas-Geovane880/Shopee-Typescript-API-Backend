import { ErrorMessage } from "../constants/errorMessage.js";
import { InvalidTokenException } from "../exceptions/invalidTokenException.js";
import { verifyToken } from "../services/tokenService.js";
import type { ExpressParam } from "../types/express/expressParam.js";

export const authMiddleware: ExpressParam = (req, _res, next) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
        throw new InvalidTokenException (401, ErrorMessage.TOKEN_REQUIRED);
    }

    const [, token] = bearerToken.split (" ");

    try {
        const decoded = verifyToken (token);

        req.user = decoded;

        next();
    } catch (error) {
        throw new InvalidTokenException (401, ErrorMessage.INVALID_TOKEN);
    }
}