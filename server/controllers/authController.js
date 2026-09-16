const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const generateOtp = require("../utils/generateOtp");
const { sendOtpEmail } = require("../services/emailService");

async function requestOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otpHash, expiresAt });
    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function verifySignup(req, res) {
  try {
    const { otp, password, ...userData } = req.body;
    const record = await Otp.findOne({ email: userData.email });

    if (!record) return res.status(400).json({ success: false, message: "OTP not found, request again" });
    if (record.expiresAt < new Date()) return res.status(400).json({ success: false, message: "OTP expired" });
    if (record.attempts >= 5) return res.status(400).json({ success: false, message: "Too many attempts" });

    const isValid = await bcrypt.compare(otp, record.otpHash);
    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    let user = await User.findOne({ email: userData.email });
    if (!user) {
      if (!password) return res.status(400).json({ success: false, message: "Password is required" });
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ ...userData, password: hashedPassword, isVerified: true });
    }

    await Otp.deleteMany({ email: userData.email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "No account found with this email" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { requestOtp, verifySignup, login };