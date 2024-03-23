import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const port: number = parseInt(process.env.PORT || "5000");
const mongoURI: string = process.env.MONGODB_URI || "";

const app: Application = express();
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => console.error(err));

// Import all API routes
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Run the express (node) app
app.listen(port, () => {
  console.log(`Node Server is running on ${port}`);
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode: number = (error as any).statusCode || 500;
  const message: string = (error as any).message || "Internal server error";
  res.status(statusCode).json({ success: false, statusCode, message });
});
