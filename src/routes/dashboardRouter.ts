import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as dashboardController from "../controllers/dashboardController.js";

const dashboardRouter = express.Router ();

dashboardRouter.get ("/list-dashboard/:date", authMiddleware, dashboardController.getUserDashboard);

export default dashboardRouter;