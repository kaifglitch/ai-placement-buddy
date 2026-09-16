import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";

const defaultCode = `#include <bits/stdc++.h>
using namespace std;

int main() {
    // your code here
    return 0;
}`;

function CodingPlayground() {
  const location = useLocation();
  const navigate = useNavigate();
  const { problemId, title, statement, difficulty, constraints, examples } = location.state || {};

  const [code, setCode] = useState(defaultCode);
  const [customInput, setCustomInput] = useState("");
  const [runOutput, setRunOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  if (!problemId) {
    return (
      <div className="min-h-screen text-offwhite flex items-center justify-center">
        <p>No problem loaded. Please start again.</p>
      </div>
    );
  }

  async function handleRun() {
    try {
      setRunning(true);
      setRunOutput(null);
      const res = await api.post("/coding/run", { code, input: customInput });
      setRunOutput(res.data);
    } catch (err) {
      setRunOutput({ error: err.response?.data?.message || "Run failed" });
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    try {
      setSubmitting(true);
      setSubmitResult(null);
      const res = await api.post("/coding/submit", { problemId, code });
      setSubmitResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen text-offwhite page-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-screen">
        {/* Left: Problem statement */}
        <div className="p-6 lg:border-r border-white/10 overflow-y-auto">
          <span className="text-xs px-2 py-1 rounded-full bg-teal/10 text-teal border border-teal/30">
            {difficulty}
          </span>
          <h2 className="font-display text-2xl font-bold mt-3 mb-4">{title}</h2>
          <p className="text-offwhite/80 whitespace-pre-line mb-4">{statement}</p>

          <p className="text-sm text-offwhite/50 mb-1">Constraints</p>
          <p className="text-sm text-offwhite/70 mb-4 font-mono">{constraints}</p>

          <p className="text-sm text-offwhite/50 mb-2">Examples</p>
          {examples?.map((ex, i) => (
            <div key={i} className="mb-3 p-3 rounded-lg bg-surface border border-white/5 text-sm font-mono card-hover">
              <p>Input: {ex.input}</p>
              <p>Output: {ex.output}</p>
              {ex.explanation && <p className="text-offwhite/50 mt-1 font-sans">{ex.explanation}</p>}
            </div>
          ))}
        </div>

        {/* Right: Editor */}
        <div className="p-6 flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full flex-1 min-h-[300px] px-4 py-3 rounded-lg bg-surface border border-white/10 text-offwhite font-mono text-sm focus:outline-none focus:border-teal/60 mb-3"
          />

          <label className="text-sm text-offwhite/60 mb-1">Custom Input (for Run)</label>
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-offwhite font-mono text-sm focus:outline-none focus:border-teal/60 mb-3"
          />

          <div className="flex gap-3 mb-4">
            <Button variant="secondary" onClick={handleRun} disabled={running}>
              {running ? "Running..." : "Run"}
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>

          {runOutput && (
            <div className="p-4 rounded-lg bg-surface border border-white/5 mb-4 font-mono text-sm card-hover">
              <p className="text-offwhite/50 mb-1">Output:</p>
              <pre className="whitespace-pre-wrap text-offwhite">{runOutput.output || "(no output)"}</pre>
              {runOutput.error && <p className="text-red-400 mt-2">{runOutput.error}</p>}
            </div>
          )}

          {submitResult && (
            <div className="p-4 rounded-lg bg-surface border border-white/5 card-hover">
              <p className={`font-semibold mb-3 ${submitResult.allPassed ? "text-teal" : "text-gold"}`}>
                {submitResult.passedCount}/{submitResult.totalCount} test cases passed
              </p>
              {submitResult.results.map((r, i) => (
                <div
                  key={i}
                  className={`mb-2 p-3 rounded-lg text-xs font-mono border ${
                    r.passed ? "bg-teal/5 border-teal/20" : "bg-red-500/5 border-red-500/20"
                  }`}
                >
                  <p>Input: {r.input}</p>
                  <p>Expected: {r.expectedOutput}</p>
                  <p>Got: {r.actualOutput}</p>
                  <p>{r.passed ? "✅ Passed" : "❌ Failed"}</p>
                </div>
              ))}
              {submitResult.allPassed && (
                <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodingPlayground;