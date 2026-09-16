import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";

function InterviewAttempt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewId, questions, jobRole, interviewType } = location.state || {};

  const [answers, setAnswers] = useState(Array(questions?.length || 0).fill(""));
  const [submitting, setSubmitting] = useState(false);

  if (!questions) {
    return (
      <div className="min-h-screen text-offwhite flex items-center justify-center">
        <p>No interview data found. Please start again.</p>
      </div>
    );
  }

  function updateAnswer(i, value) {
    const updated = [...answers];
    updated[i] = value;
    setAnswers(updated);
  }

  async function handleSubmit() {
    try {
      setSubmitting(true);
      const res = await api.post("/interviews/submit", { interviewId, answers });
      navigate("/interview/result", {
        state: { result: { ...res.data, jobRole, interviewType } },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen text-offwhite px-6 pt-8 pb-16">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-2">Mock Interview</h2>
        <p className="text-offwhite/50 mb-8">{jobRole} — {interviewType}</p>

        {questions.map((q, i) => (
          <div key={i} className="mb-6 p-5 rounded-xl bg-surface border border-white/5 card-hover">
            <p className="text-xs text-teal mb-2 uppercase tracking-wide">{q.category}</p>
            <p className="font-semibold mb-3">{i + 1}. {q.questionText}</p>
            <textarea
              value={answers[i]}
              onChange={(e) => updateAnswer(i, e.target.value)}
              rows={4}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 rounded-lg bg-ink border border-white/10 text-offwhite placeholder-offwhite/40 focus:outline-none focus:border-teal/60"
            />
          </div>
        ))}

        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Evaluating your answers..." : "Submit Interview"}
        </Button>
      </div>
    </div>
  );
}

export default InterviewAttempt;
