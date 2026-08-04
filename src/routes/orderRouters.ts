import * as orderController from "../controllers/orderController.js";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const orderRouter = express.Router ();

orderRouter.post ("/", authMiddleware, orderController.save);
orderRouter.post ("/paid/:idSeller", authMiddleware, orderController.setOrderAsPaid);
orderRouter.get ("/find/:idSeller", authMiddleware, orderController.findById);
orderRouter.get ("/:page/:date", authMiddleware, orderController.findInPageable);

export default orderRouter;
