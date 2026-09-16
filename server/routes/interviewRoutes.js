const express = require("express");
const router = express.Router();
const { generateInterview, submitInterview } = require("../controllers/interviewController");
const protect = require("../middleware/auth");

router.post("/generate", protect, generateInterview);
router.post("/submit", protect, submitInterview);

module.exports = router;
