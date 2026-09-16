const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: String,
    options: [String],
    correctAnswer: String,
    explanation: String,
    topic: String,
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: String,
  difficulty: String,
  questions: [questionSchema],
  studentAnswers: [String],
  score: Number,
  totalQuestions: Number,
  accuracy: Number,
  timeTakenSeconds: Number,
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assessment", assessmentSchema);