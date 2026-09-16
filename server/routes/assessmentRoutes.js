const express = require("express");
const router = express.Router();
const { generateAssessment, submitAssessment } = require("../controllers/assessmentController");
const protect = require("../middleware/auth");

router.post("/generate", protect, generateAssessment);
router.post("/submit", protect, submitAssessment);

module.exports = router;