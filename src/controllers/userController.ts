import * as userService from "../services/userService.js";
import type { ExpressParam } from "../types/express/expressParam.js";

export const me: ExpressParam = async (req, res, next) => {
    try {
        const me = await userService.me(req.user?.userId!);

        res
        .status (200)
        .json (me);
    } catch (error) {
        next();
    }
}
