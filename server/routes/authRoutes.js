const express = require("express");
const router = express.Router();
const { requestOtp, verifySignup, login } = require("../controllers/authController");
const { otpLimiter } = require("../middleware/rateLimiter");

router.post("/request-otp", otpLimiter, requestOtp);
router.post("/verify-signup", verifySignup);
router.post("/login", login);

module.exports = router;