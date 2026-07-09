import express from "express";
import * as userController from "./controllers/helloController.js";

const router = express.Router();

router.get ("/hi", userController.hello);

export default router;



