import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";
import LoadingOverlay from "../components/LoadingOverlay";

const selectClass =
  "w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-offwhite focus:outline-none focus:border-teal/60 mb-4";

function AssessmentSelect() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("DSA");
  const [difficulty, setDifficulty] = useState("Easy");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/assessments/generate", {
        subject, difficulty, numQuestions: Number(numQuestions),
      });
      navigate("/assessment/attempt", {
        state: { assessmentId: res.data.assessmentId, questions: res.data.questions },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-offwhite flex items-center justify-center px-6 page-fade-in">
      {loading && <LoadingOverlay message="Generating your questions with AI..." />}
      <div className="w-full max-w-sm">
        <h2 className="font-display text-3xl font-bold mb-8">Start an Assessment</h2>

        <label className="block text-sm text-offwhite/60 mb-1">Subject</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className={selectClass}>
          <option>DSA</option><option>DBMS</option><option>OS</option><option>CN</option>
          <option>OOP</option><option>Aptitude</option><option>Java</option><option>JavaScript</option>
        </select>

        <label className="block text-sm text-offwhite/60 mb-1">Difficulty</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </select>

        <label className="block text-sm text-offwhite/60 mb-1">Number of Questions</label>
        <select value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} className={selectClass}>
          <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option>
        </select>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <Button onClick={handleStart} disabled={loading}>
          {loading ? "Generating questions..." : "Start Assessment"}
        </Button>
      </div>
    </div>
  );
}

export default AssessmentSelect;
