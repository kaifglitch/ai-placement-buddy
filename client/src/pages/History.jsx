import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function History() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("assessments");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/history");
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function formatDate(d) {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  const tabs = [
    { key: "assessments", label: "Assessments" },
    { key: "interviews", label: "Interviews" },
    { key: "submissions", label: "Coding" },
  ];

  return (
    <div className="min-h-screen text-offwhite page-fade-in">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="font-display text-3xl font-bold mb-8">Your History</h2>

        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                tab === t.key ? "bg-gold text-ink" : "bg-surface text-offwhite/60 hover:text-offwhite"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-offwhite/50">Loading your history...</p>}

        {!loading && tab === "assessments" && (
          data?.assessments?.length ? data.assessments.map((a) => (
            <div key={a._id} className="p-4 mb-3 rounded-xl bg-surface border border-white/5 card-hover flex justify-between items-center">
              <div>
                <p className="font-semibold">{a.subject} <span className="text-xs text-offwhite/50">({a.difficulty})</span></p>
                <p className="text-xs text-offwhite/40">{formatDate(a.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-gold font-semibold">{a.score}/{a.totalQuestions}</p>
                <p className="text-xs text-offwhite/50">{a.accuracy}% accuracy</p>
              </div>
            </div>
          )) : <p className="text-offwhite/50">No assessments yet.</p>
        )}

        {!loading && tab === "interviews" && (
          data?.interviews?.length ? data.interviews.map((i) => (
            <div key={i._id} className="p-4 mb-3 rounded-xl bg-surface border border-white/5 card-hover flex justify-between items-center">
              <div>
                <p className="font-semibold">{i.jobRole}</p>
                <p className="text-xs text-offwhite/50">{i.interviewType} · {formatDate(i.createdAt)}</p>
              </div>
              <p className="text-gold font-semibold">{i.overallScore}/100</p>
            </div>
          )) : <p className="text-offwhite/50">No interviews yet.</p>
        )}

        {!loading && tab === "submissions" && (
          data?.submissions?.length ? data.submissions.map((s) => (
            <div key={s._id} className="p-4 mb-3 rounded-xl bg-surface border border-white/5 card-hover flex justify-between items-center">
              <div>
                <p className="font-semibold">{s.problem?.title || "Coding Problem"}</p>
                <p className="text-xs text-offwhite/50">{s.problem?.difficulty} · {formatDate(s.submittedAt)}</p>
              </div>
              <p className={`font-semibold ${s.allPassed ? "text-teal" : "text-gold"}`}>
                {s.passedCount}/{s.totalCount} passed
              </p>
            </div>
          )) : <p className="text-offwhite/50">No coding submissions yet.</p>
        )}
      </div>
    </div>
  );
}

export default History;
