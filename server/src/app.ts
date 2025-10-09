import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import storeRoutes from "./routes/storeRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(",") || [
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", storeRoutes);
app.use("/api/pages", pageRoutes);

app.use((req, res, next) => {
  console.log("INCOMING EXPRESS:", req.method, req.url, req.originalUrl);
  next();
});

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} does not exist`,
  });
});

app.use(errorHandler);

export default app;
