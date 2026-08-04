import express  from "express";
import * as authController from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = express.Router ();

authRouter.post ("/signup", authController.signup);
authRouter.post ("/login", authController.login);
authRouter.post ("/refresh", authController.refresh);
authRouter.post ("/validate-code", authController.validateCode);
authRouter.post ("/resend-code/:challengeId", authController.resendLoginCode)
authRouter.get ("/is-authenticated", authMiddleware, authController.isAuthenticated);
authRouter.post ("/forgot-password", authController.sendForgotPasswordLink);
authRouter.post ("/reset-password", authController.resetPassword);

export default authRouter;