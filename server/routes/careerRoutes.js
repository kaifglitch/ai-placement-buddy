const express = require("express");
const router = express.Router();
const { askQuestion, getStudyPlan } = require("../controllers/careerController");
const protect = require("../middleware/auth");

router.post("/ask", protect, askQuestion);
router.post("/study-plan", protect, getStudyPlan);

module.exports = router;