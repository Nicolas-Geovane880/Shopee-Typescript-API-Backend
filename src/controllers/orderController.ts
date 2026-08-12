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

export const findInPageable: ExpressParam = async (req, res, next) => {
    try {
        const response = await orderService.findInInterval (req.user?.userId!, Number (req.params.page), 20, String (req.params.date), false);

        res.status(201).json(response);
    } catch (error) {
        console.log (error)
        next (error);
    }
}

export const setOrderAsPaid: ExpressParam = async (req, res, next) => {
    try {
        const idSeller = String (req.params.idSeller)
        await orderService.setOrderAsPaid (idSeller);

        res.status(200).json({message: `Order ${idSeller} has been marked as paid successfully.`})
    } catch (error) {
        next (error);
    }
}

export const findById: ExpressParam = async (req, res, next) => {
    try {
        const idSeller = String (req.params.idSeller)
        const response = await orderService.findById (idSeller);

        res.status(200).json (response);
    } catch (error) {
        next (error);
    }
}