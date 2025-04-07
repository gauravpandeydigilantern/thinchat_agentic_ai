import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { runMigrations } from "./migrations";
import dotenv from "dotenv";

// ✅ Load environment variables based on NODE_ENV
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Logging middleware for API calls
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    log("Running database migrations...");
    await runMigrations();
    log("✅ Database migrations completed!");
  } catch (error) {
    log(`❌ Failed to run database migrations: ${error}`, "error");
  }

  // ✅ Register routes
  const server = await registerRoutes(app);

  // ✅ Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    log(`❌ Error: ${message}`, "error");
    res.status(status).json({ message });
  });

  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = Number(process.env.PORT) || 5000;
  const HOST = process.env.HOST || "127.0.0.1";

  server.listen(PORT, HOST, () => {
    log(`🚀 Server running at http://${HOST}:${PORT} (${isDev ? "dev" : "prod"})`);
  });
})();
