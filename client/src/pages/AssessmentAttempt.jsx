import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";

function AssessmentAttempt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { assessmentId, questions } = location.state || {};

  const [answers, setAnswers] = useState(Array(questions?.length || 0).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  if (!questions) {
    return (
      <div className="min-h-screen text-offwhite flex items-center justify-center">
        <p>No assessment data found. Please start again.</p>
      </div>
    );
  }

  function selectAnswer(qIndex, option) {
    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);
  }

  async function handleSubmit() {
    try {
      setSubmitting(true);
      const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);
      const res = await api.post("/assessments/submit", { assessmentId, answers, timeTakenSeconds });
      navigate("/assessment/result", { state: { result: res.data } });
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen text-offwhite px-6 pt-8 pb-16">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-8">Assessment</h2>
      {questions.map((q, i) => (
          <div key={i} className="mb-5 p-5 rounded-xl bg-surface border border-white/5 card-hover">
            <p className="font-semibold mb-3">{i + 1}. {q.questionText}</p>
          {q.options.map((opt, j) => (
              <label
                key={j}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer mb-1 transition ${
                  answers[i] === opt ? "bg-teal/10 border border-teal/40" : "hover:bg-white/5"
                }`}
              >
              <input
                type="radio"
                name={`q-${i}`}
                checked={answers[i] === opt}
                onChange={() => selectAnswer(i, opt)}
                className="accent-teal-400"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Assessment"}
      </Button>
      </div>
    </div>
  );
}

export default AssessmentAttempt;
