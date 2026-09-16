const mongoose = require("mongoose");

const mockInterviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobRole: String,
  experienceLevel: String,
  interviewType: String,
  questions: [{ questionText: String, category: String }],
  studentAnswers: [String],
  evaluations: [
    {
      score: Number,
      feedback: String,
      strengths: [String],
      improvements: [String],
    },
  ],
  overallScore: Number,
  overallFeedback: String,
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MockInterview", mockInterviewSchema);
