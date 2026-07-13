import express from "express";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouters.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use (express.json());

app.use ("/auth", authRouter);
app.use ("/users", userRouter);
app.use ("/orders", orderRouter);

app.use (errorHandler);

export default app;