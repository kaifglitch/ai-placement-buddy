import { useNavigate } from "react-router-dom";
import RevealSection from "../components/RevealSection";

const steps = [
  { label: "Sign Up", desc: "Create your profile in seconds" },
  { label: "Assess Yourself", desc: "AI tests your real skill level" },
  { label: "Practice & Improve", desc: "Targeted prep on your weak spots" },
  { label: "Mock Interview", desc: "AI interviewer, real feedback" },
  { label: "Get Placed", desc: "Walk in ready, not hopeful" },
];

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-offwhite overflow-hidden page-fade-in">
      {/* Nav / Brand */}
      <nav className="flex flex-col items-center justify-center px-6 pt-10 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold to-teal flex items-center justify-center shadow-lg shadow-gold/20">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="none"
              stroke="#0F1229"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 18 L9 12 L13 15 L20 7" />
              <path d="M15 7 L20 7 L20 12" />
              <circle cx="19" cy="18" r="1.5" fill="#0F1229" stroke="none" />
              <path d="M17.2 15.8 L17.8 16.6 M20.8 19.4 L20.2 18.6 M17.2 20.2 L17.8 19.4 M20.8 16.6 L20.2 17.4" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="font-display text-3xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">
              AI
            </span>{" "}
            Placement Buddy
          </span>
        </div>
        <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-gold to-teal" />
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-20 text-center">
        <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight max-w-3xl mx-auto">
          Walk into placements already knowing{" "}
          <span className="bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">
            you're ready.
          </span>
        </h1>
        <p className="mt-6 text-lg text-offwhite/80 max-w-xl mx-auto leading-relaxed">
          AI-generated assessments, coding practice, and mock interviews that
          adapt to where you actually stand — not where you wish you were.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="px-7 py-3 rounded-lg bg-gold text-ink font-semibold hover:brightness-110 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-7 py-3 rounded-lg border border-teal/40 text-teal font-semibold hover:bg-teal/10 transition"
          >
            Log In
          </button>
        </div>
      </section>

      {/* Journey path */}
      <RevealSection>
        <section className="px-6 pb-28 max-w-5xl mx-auto">
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-10 md:gap-4">
          <div
            className="hidden md:block absolute top-5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal/40 to-transparent"
            style={{
              animation: "growLine 1.2s ease-out forwards",
              transformOrigin: "left",
            }}
          />
          {steps.map((step, i) => (
            <div
              key={step.label}
              className="relative flex-1 flex flex-col items-center md:items-start text-center md:text-left"
              style={{
                animation: `fadeInUp 0.5s ease-out ${0.3 + i * 0.15}s both`,
              }}
            >
              <div className="w-10 h-10 rounded-full bg-surface border border-teal/50 flex items-center justify-center text-teal font-display font-semibold text-sm mb-3">
                {i + 1}
              </div>
              <h3 className="font-display font-semibold text-offwhite">
                {step.label}
              </h3>
              <p className="text-sm text-offwhite/60 mt-1 max-w-[160px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        </section>
      </RevealSection>

      <style>{`
        @keyframes growLine {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Landing;
