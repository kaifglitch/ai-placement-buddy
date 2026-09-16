const Assessment = require("../models/Assessment");
const { generateQuestions } = require("../services/aiService");

async function generateAssessment(req, res) {
  try {
    const { subject, difficulty, numQuestions } = req.body;
    if (!subject || !difficulty || !numQuestions) {
      return res.status(400).json({ success: false, message: "subject, difficulty and numQuestions are required" });
    }

    const questions = await generateQuestions(subject, difficulty, numQuestions);

    const assessment = await Assessment.create({
      user: req.userId,
      subject,
      difficulty,
      questions,
      totalQuestions: questions.length,
      status: "pending",
    });

    // Correct answer/explanation chhupa ke bhejo — student ko abhi nahi dikhna chahiye
    const safeQuestions = assessment.questions.map((q) => ({
      questionText: q.questionText,
      options: q.options,
      topic: q.topic,
    }));

    res.json({ success: true, assessmentId: assessment._id, questions: safeQuestions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function submitAssessment(req, res) {
  try {
    const { assessmentId, answers, timeTakenSeconds } = req.body;
    const assessment = await Assessment.findOne({ _id: assessmentId, user: req.userId });
    if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found" });

    let score = 0;
    const topicStats = {};

    assessment.questions.forEach((q, i) => {
      const topic = q.topic || "General";
      topicStats[topic] = topicStats[topic] || { correct: 0, total: 0 };
      topicStats[topic].total += 1;
      if (answers[i] === q.correctAnswer) {
        score += 1;
        topicStats[topic].correct += 1;
      }
    });

    const accuracy = Math.round((score / assessment.totalQuestions) * 100);

    assessment.studentAnswers = answers;
    assessment.score = score;
    assessment.accuracy = accuracy;
    assessment.timeTakenSeconds = timeTakenSeconds || 0;
    assessment.status = "completed";
    await assessment.save();

    // Streak update
    const user = await require("../models/User").findById(req.userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!user.lastActiveDate) {
      user.currentStreak = 1;
    } else {
      const last = new Date(user.lastActiveDate);
      last.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.currentStreak += 1;
      } else if (diffDays > 1) {
        user.currentStreak = 1;
      }
      // diffDays === 0 → same day, no change
    }

    user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
    user.lastActiveDate = today;
    await user.save();

    const detailedResults = assessment.questions.map((q, i) => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      yourAnswer: answers[i],
      isCorrect: answers[i] === q.correctAnswer,
      explanation: q.explanation,
      topic: q.topic,
    }));

    res.json({ success: true, score, totalQuestions: assessment.totalQuestions, accuracy, topicStats, detailedResults });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { generateAssessment, submitAssessment };