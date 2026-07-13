import * as orderController from "../controllers/orderController.js";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const orderRouter = express.Router ();

orderRouter.post ("/", authMiddleware, orderController.save);
orderRouter.get ("/", authMiddleware, orderController.findByUserId);

export default orderRouter;
