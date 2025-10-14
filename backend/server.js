import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import messageRouter from "./routes/messageRouter.js";
import reactionRouter from "./routes/reactionRouter.js";
import userRouter from "./routes/userRouter.js";
import protectedRouter from "./routes/protectedRouter.js";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// ----- Rate Limiters -----

// 1️⃣ Protect login/register heavily
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20, // 20 requests per 15 minutes per IP
    message: { success: false, response: "Too many login attempts, try again later" },
});

// 2️⃣ General API limiter (for messages/reactions)
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 1000, // 1000 requests per minute per IP
    message: { success: false, response: "Slow down!" },
});

// ----- Apply Limiters -----

// Only apply in production
if (process.env.NODE_ENV === "production") {
    app.use("/api/users", authLimiter);
    app.use("/api/messages", apiLimiter);
    app.use("/api/reactions", apiLimiter);
}

// ----- Routers -----
app.use("/api/users", userRouter);
app.use("/api/protected", protectedRouter);
app.use("/api/messages", messageRouter);
app.use("/api/reactions", reactionRouter);

// Root route
app.get("/", (req, res) => res.send("✅ API is running!"));

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
