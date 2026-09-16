const express = require("express");
const router = express.Router();
const { getSummary } = require("../controllers/performanceController");
const protect = require("../middleware/auth");

router.get("/summary", protect, getSummary);

module.exports = router;
