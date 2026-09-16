import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";

const selectClass =
  "w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-offwhite focus:outline-none focus:border-teal/60 mb-4";

function InterviewSelect() {
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState("Software Developer");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [interviewType, setInterviewType] = useState("Technical");
  const [numQuestions, setNumQuestions] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/interviews/generate", {
        jobRole, experienceLevel, interviewType, numQuestions: Number(numQuestions),
      });
      navigate("/interview/attempt", {
        state: { interviewId: res.data.interviewId, questions: res.data.questions, jobRole, interviewType },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-offwhite flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h2 className="font-display text-3xl font-bold mb-8">Start a Mock Interview</h2>

        <label className="block text-sm text-offwhite/60 mb-1">Job Role</label>
        <input
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className={selectClass}
          placeholder="e.g. Software Developer"
        />

        <label className="block text-sm text-offwhite/60 mb-1">Experience Level</label>
        <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className={selectClass}>
          <option>Fresher</option>
          <option>1-2 years</option>
          <option>3-5 years</option>
        </select>

        <label className="block text-sm text-offwhite/60 mb-1">Interview Type</label>
        <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)} className={selectClass}>
          <option>Technical</option>
          <option>HR</option>
          <option>Behavioral</option>
        </select>

        <label className="block text-sm text-offwhite/60 mb-1">Number of Questions</label>
        <select value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} className={selectClass}>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={7}>7</option>
        </select>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <Button onClick={handleStart} disabled={loading}>
          {loading ? "Preparing your interview..." : "Start Interview"}
        </Button>
      </div>
    </div>
  );
}

export default InterviewSelect;
