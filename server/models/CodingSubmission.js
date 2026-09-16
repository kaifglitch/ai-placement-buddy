const mongoose = require("mongoose");

const codingSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: "CodingProblem", required: true },
  code: String,
  language: { type: String, default: "cpp" },
  passedCount: Number,
  totalCount: Number,
  allPassed: Boolean,
  results: [
    {
      input: String,
      expectedOutput: String,
      actualOutput: String,
      passed: Boolean,
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CodingSubmission", codingSubmissionSchema);