import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  topic: { type: String, required: true },     // e.g. "Aptitude", "Technical", "Coding", "HR", "DSA"
  level: { type: Number, required: true },      // 1, 2, 3, 4, 5
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
}, { timestamps: true });

// Compound index for fast queries
questionSchema.index({ topic: 1, level: 1 });

export default mongoose.model("Question", questionSchema);
