import "dotenv/config";
import express, {  Response } from "express"
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import authenticate from "./middleware/authenticate";
import userRoutes from "./routes/user.route";
import sessionRoutes from "./routes/session.route";
import errorHandler from "./middleware/errorHandler";
import connectToDatabase from "./config/db";

const server = express();



// add middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
server.use(cookieParser());

// health check
//@ts-ignore
server.get("/", (_, res: Response) => {
    return res.status(200).json({
      status: "healthy",
    });
  });


// auth routes
server.use("/auth", authRoutes);

// protected routes
server.use("/user", authenticate, userRoutes);
server.use("/sessions", authenticate, sessionRoutes);

// error handler
server.use(errorHandler);


server.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT} in ${NODE_ENV} environment`);
    await connectToDatabase();
  });


