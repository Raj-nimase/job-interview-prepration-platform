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
});

export default mongoose.model("MockInterview", MockInterviewSchema);
