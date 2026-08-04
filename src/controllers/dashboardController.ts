import type { ExpressParam } from "../types/express/expressParam.js";
import * as dashboardService from "../services/dashboardService.js";

export const getUserDashboard: ExpressParam = async (req, res, next) => {
    try {
        const date = req.params.date
        const response = await dashboardService.getUserDashboard (req.user?.userId!, String (date));

        res.status(200).json(response);
    } catch (error) {
        next (error);
    }
}