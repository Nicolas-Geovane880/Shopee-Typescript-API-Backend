import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as userController from "../controllers/userController.js";

const userRouter = express.Router ();

userRouter.get ("/me", authMiddleware, userController.me);
userRouter.post ("/validate-email", userController.existsByEmail);

export default userRouter;