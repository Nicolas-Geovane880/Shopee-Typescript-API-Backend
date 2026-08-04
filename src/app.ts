import express from "express";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouters.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import dashboardRouter from "./routes/dashboardRouter.js";
import cors from "cors";

const app = express();

app.use (cors({
    origin: ((origin, callback) => {
        if (!origin) {
            return callback (null, true);
        }

        if (origin === process.env.FRONTEND_URL) {
            return callback (null, true);
        }

        return callback (new Error ("Origin not allowed"));
    }),
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "DELETE", "PUT"],
}));

app.use (express.json());

app.use ("/auth", authRouter);
app.use ("/users", userRouter);
app.use ("/orders", orderRouter);
app.use ("/home", dashboardRouter);

app.use (errorHandler);

export default app;