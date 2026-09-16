import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CountUp from "../components/CountUp";
import Navbar from "../components/Navbar";
import api from "../services/api";

const categoryLabels = {
  DSA: "DSA",
  Coding: "Coding",
  Aptitude: "Aptitude",
  CoreCS: "Core CS",
  TechnicalInterview: "Technical Interview",
  Communication: "Communication",
};

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await api.get("/performance/summary");
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to load performance summary", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen text-offwhite">
      <Navbar />
      <div className="px-6 pt-8 pb-16">
        <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-2">
          Welcome, {user.fullName || "Student"} 👋
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-offwhite/50 mb-10">
          <span>{user.email}</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-teal" />
            Target Role: <span className="text-offwhite/70 font-medium">{user.targetRole}</span>
          </span>
        </div>

        {loading ? (
          <div className="bg-surface rounded-xl p-6 mb-6 border border-white/5 card-hover">
            <p className="text-offwhite/50 text-sm">Loading your progress...</p>
          </div>
        ) : summary?.totalAssessmentsTaken === 0 ? (
          <div className="bg-surface rounded-xl p-6 mb-6 border border-white/5 card-hover">
            <p className="text-offwhite/60">
              You haven't taken any assessments yet. Take your first one to see
              your Placement Readiness Score here.
            </p>
          </div>
        ) : (
          <>
            {/* Readiness Score + Streak */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-surface rounded-xl p-6 border border-white/5 text-center card-hover">
                <p className="text-offwhite/50 text-sm mb-1">Placement Readiness</p>
                <p className="font-display text-4xl font-bold text-gold">
                  <CountUp value={summary.readinessScore} />
                  <span className="text-lg text-offwhite/40">/100</span>
                </p>
              </div>
              <div className="flex-1 bg-surface rounded-xl p-6 border border-white/5 text-center card-hover">
                <p className="text-offwhite/50 text-sm mb-1">Current Streak</p>
                <p className="font-display text-4xl font-bold text-teal">
                  🔥{summary.streak.current}
                </p>
                <p className="text-offwhite/40 text-xs mt-1">
                  Longest: {summary.streak.longest}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              <div className="w-full">
                <Button onClick={() => navigate("/assessment/select")}>
                  Take an Assessment
                </Button>
              </div>
              <div className="w-full">
                <Button onClick={() => navigate("/interview/select")}>
                  Start Mock Interview
                </Button>
              </div>
              <div className="w-full">
                <Button onClick={() => navigate("/coding/select")}>
                  Solve a Coding Problem
                </Button>
              </div>
              <div className="w-full">
                <Button onClick={() => navigate("/career")}>
                  Career Assistant
                </Button>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-surface rounded-xl p-6 mb-4 border border-white/5 card-hover">
              <p className="font-display font-semibold text-lg mb-1">Category Breakdown</p>
              <p className="text-xs text-offwhite/40 uppercase tracking-wider mb-5">Your performance by area</p>
              {Object.entries(summary.categoryScores).map(([cat, score]) => (
                <div key={cat} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-offwhite/70">{categoryLabels[cat] || cat}</span>
                    <span className="text-offwhite/50">{score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal to-gold transition-all"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Weak Topics */}
            {summary.weakTopics?.length > 0 && (
              <div className="bg-surface rounded-xl p-6 mb-6 border border-white/5 card-hover">
                <p className="font-display font-semibold mb-3">Focus Areas</p>
                <div className="flex flex-wrap gap-2">
                  {summary.weakTopics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-sm text-red-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
