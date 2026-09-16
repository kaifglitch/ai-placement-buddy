const Assessment = require("../models/Assessment");
const MockInterview = require("../models/MockInterview");
const CodingSubmission = require("../models/CodingSubmission");

async function getHistory(req, res) {
  try {
    const assessments = await Assessment.find({ user: req.userId, status: "completed" })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("subject difficulty score totalQuestions accuracy createdAt");

    const interviews = await MockInterview.find({ user: req.userId, status: "completed" })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("jobRole interviewType overallScore createdAt");

    const submissions = await CodingSubmission.find({ user: req.userId })
      .sort({ submittedAt: -1 })
      .limit(20)
      .populate("problem", "title difficulty")
      .select("passedCount totalCount allPassed submittedAt problem");

    res.json({ success: true, assessments, interviews, submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getHistory };
