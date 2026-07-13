import type { ExpressParam } from "../types/express/expressParam.js";
import { orderCreateSchema } from "../types/orderSchema.js";
import * as orderService from "../services/orderService.js"

export const save: ExpressParam = async (req, res, next) => {
    try {
        const dto = orderCreateSchema.parse (req.body);
        const response = await orderService.save (dto, req.user?.userId!);

        res.status(201).json(response);
    } catch (error) {
        console.log (error)
        next (error);
    }
}

export const findByUserId: ExpressParam = async (req, res, next) => {
    try {
        const response = await orderService.findByUserId (req.user?.userId!);

        res.status(200).json(response);
    } catch (error) {
        next (error);
    }
}