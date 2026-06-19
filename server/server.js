// server/server.js
import express from "express";
import mongoose, { startSession } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import interview from "./routes/interviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import cookiparser from "cookie-parser";
//import quizRoutes from "./routes/quizRoutes.js";

dotenv.config();
const app = express();
app.use(cookiparser());
const allowedOrigins = new Set(
  [
    process.env.CLIENT_ORIGIN,
    ...(process.env.CLIENT_ORIGINS
      ? process.env.CLIENT_ORIGINS.split(",")
      : []),
    "http://localhost:5173",
    "https://job-interview-prepration-platform-3f621l3d0.vercel.app",
  ].filter(Boolean),
);

function isAllowedOrigin(origin) {
  return (
    allowedOrigins.has(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)
  );
}

// enable cross-origin requests and allow cookies to be sent
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "25mb" })); // allow base64 audio payloads
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/interview", interview);
app.use("/dashboard", dashboardRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/resume", resumeRoutes);
//app.use("/api/quiz", quizRoutes);

app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
