import * as userService from "../services/userService.js";
import type { ExpressParam } from "../types/express/expressParam.js";

export const me: ExpressParam = async (req, res, next) => {
    try {
        const me = await userService.me(req.user?.userId!);

        res.status(200).json (me);
    } catch (error) {
        next(); 
    }
}

export const existsByEmail: ExpressParam = async (req, res, next) => {
    try {
        const byEmail = await userService.existsByEmail (req.body.email);


        if (byEmail) {
            return res.status (409).send ();
        }

        return res.status (200).send ();
    } catch (error) {
        next (error);
    }
}
