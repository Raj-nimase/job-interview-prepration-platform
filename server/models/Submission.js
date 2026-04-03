import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  level: { type: Number, required: true, default: 1 },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selectedOption: String,
    },
  ],
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  passed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

submissionSchema.index({ userId: 1, topic: 1, level: 1 });

export default mongoose.model("Submission", submissionSchema);
