const express = require("express");
const router = express.Router();
const { generateProblem, runCodeHandler, submitCode } = require("../controllers/codingController");
const protect = require("../middleware/auth");

router.post("/generate", protect, generateProblem);
router.post("/run", protect, runCodeHandler);
router.post("/submit", protect, submitCode);

module.exports = router;