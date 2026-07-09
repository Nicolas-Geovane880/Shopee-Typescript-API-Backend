import express from "express";
import router from "./router.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();

app.use (express.json());

app.use ("/greeting", router);
app.use ("/auth", authRouter);
app.use ("/users", userRouter);

export default app;