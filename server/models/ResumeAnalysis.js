import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fileName: { type: String, default: "" },
    targetRole: { type: String, default: "" },
    resumeText: { type: String, default: "" },
    overallScore: { type: Number, default: 0 },
    summary: { type: String, default: "" },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    atsScore: { type: Number, default: 0 },
    sections: {
      contactInfo: { score: Number, feedback: String },
      experience: { score: Number, feedback: String },
      education: { score: Number, feedback: String },
      skills: { score: Number, feedback: String },
      formatting: { score: Number, feedback: String },
    },
    keywords: {
      found: [{ type: String }],
      missing: [{ type: String }],
    },
  },
  { timestamps: true },
);

export default mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
