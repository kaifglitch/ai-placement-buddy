require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const codingRoutes = require("./routes/codingRoutes");
const careerRoutes = require("./routes/careerRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/history", historyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));