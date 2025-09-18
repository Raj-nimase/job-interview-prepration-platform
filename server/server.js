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
//import quizRoutes from "./routes/quizRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/interview", interview);
app.use("/dashboard", dashboardRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/questions", questionRoutes);
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
