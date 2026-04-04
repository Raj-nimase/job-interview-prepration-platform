import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  feedback: {
    score: { type: Number, default: 0 },
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
  },
});

const MockInterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true },
  questionsAsked: [QuestionSchema],
  overallScore: { type: Number, default: 0 },
  summary: {
    nextLevelEdge: { type: String, default: "" },
    refinementAreas: { type: String, default: "" },
  },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MockInterview", MockInterviewSchema);
