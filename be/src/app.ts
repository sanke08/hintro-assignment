import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import authRouter from "./routes/auth.routes.js";
import workspaceRouter from "./routes/workspace.routes.js";

const app: Express = express();

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.VITE_FE_URL!],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/workspaces", workspaceRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use(globalErrorHandler);

export default app;
