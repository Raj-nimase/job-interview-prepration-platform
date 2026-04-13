import mongoose from "mongoose";

const DeliverySchema = new mongoose.Schema({
  fillerWordCount: { type: Number, default: 0 },
  fillerWordRate: { type: Number, default: 0 },
  pacingScore: { type: Number, default: 0 },
  clarityScore: { type: Number, default: 0 },
  overallDeliveryScore: { type: Number, default: 0 },
}, { _id: false });

const StarScoreSchema = new mongoose.Schema({
  situation: { type: Number, default: 0 },
  task: { type: Number, default: 0 },
  action: { type: Number, default: 0 },
  result: { type: Number, default: 0 },
}, { _id: false });

const CodeReviewSchema = new mongoose.Schema({
  correctness: { type: Number, default: 0 },
  efficiency: { type: Number, default: 0 },
  readability: { type: Number, default: 0 },
  overallCode: { type: Number, default: 0 },
  suggestions: { type: String, default: "" },
  improvedVersion: { type: String, default: "" }
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  followUpQuestion: { type: String, default: "" },
  followUpAnswer: { type: String, default: "" },
  codeAnswer: { type: String, default: "" },
  codeLanguage: { type: String, default: "" },
  questionType: { type: String, enum: ["Technical", "Behavioral", "Mixed"], default: "Technical" },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  timeTaken: { type: Number, default: 0 }, // seconds
  timerExpired: { type: Boolean, default: false },
  askedClarification: { type: Boolean, default: false },
  bookmarked: { type: Boolean, default: false },
  feedback: {
    score: { type: Number, default: 0 },
    feedback: { type: String, default: "" },
    nextLevelEdge: { type: String, default: "" },
    refinementAreas: { type: String, default: "" },
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    suggestedAnswer: { type: String, default: "" },
    conciseness: { type: String, default: "" },
    starScores: { type: StarScoreSchema, default: () => ({}) },
    delivery: { type: DeliverySchema, default: () => ({}) },
    codeReview: { type: CodeReviewSchema, default: null },
  },
});

const MockInterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true },
  interviewType: { type: String, enum: ["Technical", "Behavioral", "Mixed"], default: "Technical" },
  personaStyle: { type: String, enum: ["Friendly", "Neutral", "Skeptical"], default: "Neutral" },
  jobDescription: { type: String, default: "" },
  targetCompany: { type: String, default: "" },
  questionsAsked: [QuestionSchema],
  overallScore: { type: Number, default: 0 },
  overallDeliveryScore: { type: Number, default: 0 },
  summary: {
    nextLevelEdge: { type: String, default: "" },
    refinementAreas: { type: String, default: "" },
    starAverages: {
      situation: { type: Number, default: 0 },
      task: { type: Number, default: 0 },
      action: { type: Number, default: 0 },
      result: { type: Number, default: 0 },
    },
    deliveryAverage: { type: Number, default: 0 },
    mostImprovedArea: { type: String, default: "" },
    focusArea: { type: String, default: "" },
    recoveryPlan: { type: String, default: "" },
    sessionVerdict: { type: String, default: "" },
  },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Virtual: bookmarked questions
MockInterviewSchema.virtual("bookmarkedQuestions").get(function () {
  return this.questionsAsked.filter((q) => q.bookmarked);
});

export default mongoose.model("MockInterview", MockInterviewSchema);
