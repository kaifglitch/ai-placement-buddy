import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";

function AssessmentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="min-h-screen text-offwhite flex items-center justify-center">
        <p>No result found.</p>
      </div>
    );
  }

  const { score, totalQuestions, accuracy, topicStats, detailedResults } = result;

  return (
    <div className="min-h-screen text-offwhite px-6 pt-8 pb-16 page-fade-in">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-2">Assessment Result</h2>
        <p className="text-xl mb-8">
          Score: <span className="text-gold font-semibold">{score}/{totalQuestions}</span>{" "}
          <span className="text-offwhite/60">({accuracy}% accuracy)</span>
        </p>

        <h3 className="font-display font-semibold text-lg mb-3">Topic-wise Performance</h3>
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(topicStats).map(([topic, stats]) => (
            <span key={topic} className="px-3 py-1.5 rounded-full bg-surface border border-white/10 text-sm">
              {topic}: <span className="text-teal">{stats.correct}/{stats.total}</span>
            </span>
          ))}
        </div>

        <h3 className="font-display font-semibold text-lg mb-3">Detailed Review</h3>
        {detailedResults.map((q, i) => (
          <div
            key={i}
            className={`mb-3 p-4 rounded-xl border card-hover ${
              q.isCorrect ? "bg-teal/5 border-teal/30" : "bg-red-500/5 border-red-500/30"
            }`}
          >
            <p className="font-semibold mb-1">{i + 1}. {q.questionText}</p>
            <p className="text-sm mb-1">
              Your answer: {q.yourAnswer || "(not answered)"} {q.isCorrect ? "✅" : "❌"}
            </p>
            {!q.isCorrect && <p className="text-sm mb-1">Correct answer: {q.correctAnswer}</p>}
            <p className="text-offwhite/50 text-sm">{q.explanation}</p>
          </div>
        ))}

        <div className="mt-6">
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    </div>
  );
}

export default AssessmentResult;
