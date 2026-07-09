import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as userController from "../controllers/userController.js";

const userRouter = express.Router ();

userRouter.get ("/me", authMiddleware, userController.me);

export default userRouter;