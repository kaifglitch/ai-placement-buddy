const MockInterview = require("../models/MockInterview");
const { generateInterviewQuestions, evaluateInterviewAnswers } = require("../services/aiService");

async function generateInterview(req, res) {
  try {
    const { jobRole, experienceLevel, interviewType, numQuestions } = req.body;
    if (!jobRole || !experienceLevel || !interviewType || !numQuestions) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const questions = await generateInterviewQuestions(jobRole, experienceLevel, interviewType, numQuestions);

    const interview = await MockInterview.create({
      user: req.userId,
      jobRole,
      experienceLevel,
      interviewType,
      questions,
      status: "pending",
    });

    res.json({ success: true, interviewId: interview._id, questions });
  } catch (err) {
    console.error("Full error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function submitInterview(req, res) {
  try {
    const { interviewId, answers } = req.body;
    const interview = await MockInterview.findOne({ _id: interviewId, user: req.userId });
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

    const result = await evaluateInterviewAnswers(interview.questions, answers, interview.jobRole);

    interview.studentAnswers = answers;
    interview.evaluations = result.evaluations;
    interview.overallScore = result.overallScore;
    interview.overallFeedback = result.overallFeedback;
    interview.status = "completed";
    await interview.save();

    res.json({
      success: true,
      questions: interview.questions,
      answers,
      evaluations: result.evaluations,
      overallScore: result.overallScore,
      overallFeedback: result.overallFeedback,
      jobRole: interview.jobRole,
      interviewType: interview.interviewType,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { generateInterview, submitInterview };
