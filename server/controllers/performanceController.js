const Assessment = require("../models/Assessment");
const User = require("../models/User");
const { WEIGHTS, CATEGORY_MAP } = require("../config/scoringWeights");

async function getSummary(req, res) {
  try {
    const assessments = await Assessment.find({ user: req.userId, status: "completed" });

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

    const user = await User.findById(req.userId);

    res.json({
      success: true,
      readinessScore,
      categoryScores,
      weights: WEIGHTS,
      weakTopics,
      totalAssessmentsTaken: assessments.length,
      streak: {
        current: user.currentStreak,
        longest: user.longestStreak,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getSummary };