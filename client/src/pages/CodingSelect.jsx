import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";

const selectClass =
  "w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-offwhite focus:outline-none focus:border-teal/60 mb-4";

function CodingSelect() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("Easy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/coding/generate", { difficulty });
      navigate("/coding/playground", {
        state: {
          problemId: res.data.problemId,
          title: res.data.title,
          statement: res.data.statement,
          difficulty: res.data.difficulty,
          constraints: res.data.constraints,
          examples: res.data.examples,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-offwhite flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl font-bold mb-8">Solve a Coding Problem</h2>

          <label className="block text-sm text-offwhite/60 mb-1">Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <Button onClick={handleStart} disabled={loading}>
            {loading ? "Generating problem..." : "Get Problem"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CodingSelect;