import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {requestLogger} from "./middleware/request-logger.middleware";
import { errorHandler } from './middleware/error.middleware';

import { authMiddlewareCookies } from './middleware/auth.middleware';
import { authRoutes } from './routes/auth.routes';
import { boardRoutes } from "./routes/board.routes";
import { taskRoutes } from "./routes/task.routes";
import { settingsRoutes } from "./routes/settings.routes";

const app = express();
const port = 3000;

// 1. Security middleware (first)
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2. Body parsing middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser(process.env.JWT_SECRET!)); // Use cookie parser with secret for signed cookies

// 3. Logging middleware
app.use(requestLogger);

// 4. Authentication middleware (for protected routes)
app.use("/api/protected", authMiddlewareCookies);

// 5. Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/settings", settingsRoutes)

app.get("/", (req, res) => {
  res.send("Backend Avanzado - Tarea 8 - TODO App");
});

// CheckStatus check endpoint
app.get("/checkStatus", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 6. Error handling middleware (last)
app.use(errorHandler);

// 7. Health check's endpoint's
// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/checkStatus`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});