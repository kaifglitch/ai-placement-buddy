const User = require("../models/User");
const Assessment = require("../models/Assessment");
const { WEIGHTS, CATEGORY_MAP } = require("../config/scoringWeights");
const { getCareerAdvice, generateStudyPlan } = require("../services/aiService");

async function buildContext(userId) {
  const user = await User.findById(userId);
  const assessments = await Assessment.find({ user: userId, status: "completed" });

  const categoryTotals = {};
  const topicMistakes = {};

  assessments.forEach((a) => {
    const category = CATEGORY_MAP[a.subject] || "Other";
    categoryTotals[category] = categoryTotals[category] || { sum: 0, count: 0 };
    categoryTotals[category].sum += a.accuracy || 0;
    categoryTotals[category].count += 1;

    a.questions.forEach((q, i) => {
      if (a.studentAnswers[i] !== q.correctAnswer) {
        const topic = q.topic || "General";
        topicMistakes[topic] = (topicMistakes[topic] || 0) + 1;
      }
    });
  });

  const categoryScores = {};
  Object.keys(WEIGHTS).forEach((cat) => {
    categoryScores[cat] = categoryTotals[cat]
      ? Math.round(categoryTotals[cat].sum / categoryTotals[cat].count)
      : 0;
  });

  let readinessScore = 0;
  Object.entries(WEIGHTS).forEach(([cat, weight]) => {
    readinessScore += categoryScores[cat] * weight;
  });
  readinessScore = Math.round(readinessScore);

  const weakTopics = Object.entries(topicMistakes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic]) => topic);

  return {
    targetRole: user.targetRole,
    readinessScore,
    categoryScores,
    weakTopics,
    totalAssessmentsTaken: assessments.length,
  };
}

async function askQuestion(req, res) {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ success: false, message: "question is required" });

    const context = await buildContext(req.userId);
    const result = await getCareerAdvice(question, context);

    res.json({ success: true, answer: result.answer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getStudyPlan(req, res) {
  try {
    const context = await buildContext(req.userId);
    const plan = await generateStudyPlan(context);

    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { askQuestion, getStudyPlan };