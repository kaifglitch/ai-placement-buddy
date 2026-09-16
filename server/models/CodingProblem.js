const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    input: String,
    expectedOutput: String,
  },
  { _id: false }
);

const codingProblemSchema = new mongoose.Schema({
  title: String,
  statement: String,
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
  constraints: String,
  examples: [{ input: String, output: String, explanation: String }],
  testCases: [testCaseSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CodingProblem", codingProblemSchema);