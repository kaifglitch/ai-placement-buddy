const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function signup(req, res) {
  try {
    const { fullName, email, mobile, password, college, branch, gradYear, targetRole } = req.body;
    const trimmedFullName = String(fullName || "").trim();
    const trimmedEmail = String(email || "").trim();
    const trimmedMobile = String(mobile || "").trim();
    const trimmedPassword = String(password || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedFullName || !trimmedEmail || !trimmedMobile || !trimmedPassword) {
      return res.status(400).json({ success: false, message: "Name, email, phone, and password are required" });
    }

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (trimmedPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: trimmedEmail }, ...(trimmedMobile ? [{ mobile: trimmedMobile }] : [])],
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    const user = await User.create({
      fullName: trimmedFullName,
      email: trimmedEmail,
      mobile: trimmedMobile,
      password: hashedPassword,
      college,
      branch,
      gradYear,
      targetRole,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({ success: true, token, user: safeUser });
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
    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { signup, login };