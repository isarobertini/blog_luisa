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

// ----- Middleware -----
app.use(helmet());
app.use(express.json());

// ----- CORS using FRONTEND_URL env -----
const allowedOrigins = [
    process.env.FRONTEND_URL,     // frontend in Render/Netlify
    "http://localhost:5173",      // local frontend for testing
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // allow cookies/auth headers if needed
}));

// ----- Rate Limiters -----

// Protect login/register heavily
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { success: false, response: "Too many login attempts, try again later" },
});

// General API limiter
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000,
    message: { success: false, response: "Slow down!" },
});

// Apply limiters only in production
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
app.get("/", (req, res) => res.send(" API is running!"));

// ----- MongoDB Connection -----
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// ----- Start Server -----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
