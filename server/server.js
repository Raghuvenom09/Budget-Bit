import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import restaurantRoutes from "./routes/restaurants.js";
import reviewRoutes from "./routes/reviews.js";
import billRoutes from "./routes/bills.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Rate limiter for auth endpoints ───────────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
});

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/users", userRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok", time: new Date() }));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
});

// ── Boot ──────────────────────────────────────────────────────────────────────
connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err.message);
        process.exit(1);
    });
