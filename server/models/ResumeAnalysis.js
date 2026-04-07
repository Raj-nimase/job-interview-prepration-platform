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
      contactInfo: {
        score: Number,
        feedback: String,
        issues: [{ type: String }],
        whatToAdd: [{ type: String }],
        improvements: [{ type: String }],
        examples: [{ type: String }],
      },
      experience: {
        score: Number,
        feedback: String,
        issues: [{ type: String }],
        whatToAdd: [{ type: String }],
        improvements: [{ type: String }],
        examples: [{ type: String }],
      },
      education: {
        score: Number,
        feedback: String,
        issues: [{ type: String }],
        whatToAdd: [{ type: String }],
        improvements: [{ type: String }],
        examples: [{ type: String }],
      },
      skills: {
        score: Number,
        feedback: String,
        issues: [{ type: String }],
        whatToAdd: [{ type: String }],
        improvements: [{ type: String }],
        examples: [{ type: String }],
      },
      formatting: {
        score: Number,
        feedback: String,
        issues: [{ type: String }],
        whatToAdd: [{ type: String }],
        improvements: [{ type: String }],
        examples: [{ type: String }],
      },
    },
    keywords: {
      found: [{ type: String }],
      missing: [{ type: String }],
    },
    actionPlan: [
      {
        title: { type: String, default: "" },
        targetSection: { type: String, default: "" },
        priority: {
          type: String,
          enum: ["high", "medium", "low"],
          default: "medium",
        },
        rationale: { type: String, default: "" },
        estimatedImpact: { type: String, default: "" },
        tasks: [{ type: String }],
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
