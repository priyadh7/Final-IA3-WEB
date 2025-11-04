

// If you see a missing types error for 'cors', run: npm i --save-dev @types/cors
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Register all API routes
registerRoutes(app).then(server => {
  // Start the server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
  });
});
