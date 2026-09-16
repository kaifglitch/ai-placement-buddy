import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";

function CareerAssistant() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("chat");

  // Chat state
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);

  // Study plan state
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = question;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setQuestion("");
    setAsking(true);

    try {
      const res = await api.post("/career/ask", { question: userMsg });
      setMessages((prev) => [...prev, { role: "ai", text: res.data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, something went wrong. Try again." },
      ]);
    } finally {
      setAsking(false);
    }
  }

  async function handleGeneratePlan() {
    try {
      setLoadingPlan(true);
      const res = await api.post("/career/study-plan", {});
      setPlan(res.data.plan);
    } catch (err) {
      alert("Failed to generate study plan");
    } finally {
      setLoadingPlan(false);
    }
  }

  return (
    <div className="min-h-screen text-offwhite px-6 pt-8 pb-16 page-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-3xl font-bold">Career Assistant</h2>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("chat")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              tab === "chat" ? "bg-gold text-ink" : "bg-surface text-offwhite/60"
            }`}
          >
            Ask a Question
          </button>
          <button
            onClick={() => setTab("plan")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              tab === "plan" ? "bg-gold text-ink" : "bg-surface text-offwhite/60"
            }`}
          >
            Study Planner
          </button>
        </div>

        {/* Chat Tab */}
        {tab === "chat" && (
          <div>
            <div className="mb-4 space-y-3 max-h-[400px] overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-offwhite/50 text-sm">
                  Ask anything — e.g. "Should I focus on frontend or backend?" or
                  "What should I study this week?"
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-sm max-w-[85%] ${
                    m.role === "user"
                      ? "bg-teal/10 border border-teal/30 ml-auto"
                      : "bg-surface border border-white/5"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {asking && <p className="text-offwhite/50 text-sm">Thinking...</p>}
            </div>

            <form onSubmit={handleAsk} className="flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 px-4 py-3 rounded-lg bg-surface border border-white/10 text-offwhite placeholder-offwhite/40 focus:outline-none focus:border-teal/60"
              />
              <Button type="submit" disabled={asking}>Ask</Button>
            </form>
          </div>
        )}

        {/* Study Plan Tab */}
        {tab === "plan" && (
          <div>
            {!plan && (
              <Button onClick={handleGeneratePlan} disabled={loadingPlan}>
                {loadingPlan ? "Generating your plan..." : "Generate My 7-Day Study Plan"}
              </Button>
            )}

            {plan && (
              <div className="space-y-4">
                {plan.map((d, i) => (
                  <div key={i} className="p-5 rounded-xl bg-surface border border-white/5 card-hover">
                    <p className="text-xs text-teal uppercase tracking-wide mb-1">{d.day}</p>
                    <p className="font-display font-semibold mb-3">{d.focusArea}</p>
                    <ul className="space-y-1">
                      {d.tasks.map((t, j) => (
                        <li key={j} className="text-sm text-offwhite/70 flex gap-2">
                          <span className="text-gold">•</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Button variant="secondary" onClick={handleGeneratePlan} disabled={loadingPlan}>
                  {loadingPlan ? "Regenerating..." : "Regenerate Plan"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CareerAssistant;
