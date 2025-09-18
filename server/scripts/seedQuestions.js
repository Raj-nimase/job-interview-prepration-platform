// scripts/seedQuestions.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/questionModel.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

await Question.insertMany([
  {
    question: "What is React?",
    options: ["Library", "Framework", "Database", "Language"],
    correctIndex: 0,
  },
  {
    question: "JSX stands for?",
    options: ["JavaScript XML", "Java Syntax X", "JSON XML", "None"],
    correctIndex: 0,
  },
]);

console.log("Seeded questions");
process.exit();

