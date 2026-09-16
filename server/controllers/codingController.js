const CodingProblem = require("../models/CodingProblem");
const CodingSubmission = require("../models/CodingSubmission");
const { generateCodingProblem } = require("../services/aiService");
const { runCode } = require("../services/codeExecutionService");

async function generateProblem(req, res) {
  try {
    const { difficulty } = req.body;
    if (!difficulty) return res.status(400).json({ success: false, message: "difficulty is required" });

    const problemData = await generateCodingProblem(difficulty);
    const problem = await CodingProblem.create({ ...problemData, difficulty });

    res.json({
      success: true,
      problemId: problem._id,
      title: problem.title,
      statement: problem.statement,
      difficulty: problem.difficulty,
      constraints: problem.constraints,
      examples: problem.examples,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function runCodeHandler(req, res) {
  try {
    const { code, input } = req.body;
    const result = await runCode(code, input || "");
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function submitCode(req, res) {
  try {
    const { problemId, code } = req.body;
    const problem = await CodingProblem.findById(problemId);
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });

    const results = [];
    let passedCount = 0;

    for (const tc of problem.testCases) {
      const { output, error } = await runCode(code, tc.input);
      const passed = !error && output.trim() === tc.expectedOutput.trim();
      if (passed) passedCount++;
      results.push({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: error ? `Error: ${error}` : output,
        passed,
      });
    }

    const allPassed = passedCount === problem.testCases.length;

    const submission = await CodingSubmission.create({
      user: req.userId,
      problem: problemId,
      code,
      passedCount,
      totalCount: problem.testCases.length,
      allPassed,
      results,
    });

    res.json({
      success: true,
      passedCount,
      totalCount: problem.testCases.length,
      allPassed,
      results,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { generateProblem, runCodeHandler, submitCode };