import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import Button from "../components/Button";

function InterviewResult() {
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

  const { questions, answers, evaluations, overallScore, overallFeedback, jobRole, interviewType } = result;

  function downloadPDF() {
    const doc = new jsPDF();
    const margin = 15;
    let y = 20;

    doc.setFontSize(18);
    doc.text("Mock Interview Report", margin, y);
    y += 10;
    doc.setFontSize(11);
    doc.text(`Role: ${jobRole}  |  Type: ${interviewType}`, margin, y);
    y += 8;
    doc.text(`Overall Score: ${overallScore}/100`, margin, y);
    y += 10;

    doc.setFontSize(12);
    const feedbackLines = doc.splitTextToSize(`Overall Feedback: ${overallFeedback}`, 180);
    doc.text(feedbackLines, margin, y);
    y += feedbackLines.length * 6 + 6;

    questions.forEach((q, i) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      const qLines = doc.splitTextToSize(`Q${i + 1}. ${q.questionText}`, 180);
      doc.text(qLines, margin, y);
      y += qLines.length * 6 + 2;

      doc.setFontSize(10);
      const ansLines = doc.splitTextToSize(`Answer: ${answers[i] || "(not answered)"}`, 180);
      doc.text(ansLines, margin, y);
      y += ansLines.length * 5 + 2;

      const ev = evaluations[i];
      doc.text(`Score: ${ev.score}/100`, margin, y);
      y += 6;
      const fbLines = doc.splitTextToSize(`Feedback: ${ev.feedback}`, 180);
      doc.text(fbLines, margin, y);
      y += fbLines.length * 5 + 10;
    });

    doc.save("mock-interview-report.pdf");
  }

  return (
    <div className="min-h-screen text-offwhite px-6 pt-8 pb-16 page-fade-in">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-2">Interview Report</h2>
        <p className="text-offwhite/50 mb-6">{jobRole} — {interviewType}</p>

        <div className="bg-surface rounded-xl p-6 mb-6 border border-white/5 card-hover">
          <p className="text-offwhite/50 text-sm mb-1">Overall Score</p>
          <p className="font-display text-4xl font-bold text-gold mb-3">{overallScore}/100</p>
          <p className="text-offwhite/70 text-sm">{overallFeedback}</p>
        </div>

        <h3 className="font-display font-semibold text-lg mb-3">Question-wise Feedback</h3>
        {questions.map((q, i) => {
          const ev = evaluations[i];
          return (
            <div key={i} className="mb-4 p-5 rounded-xl bg-surface border border-white/5 card-hover">
              <p className="text-xs text-teal mb-1 uppercase tracking-wide">{q.category}</p>
              <p className="font-semibold mb-2">{i + 1}. {q.questionText}</p>
              <p className="text-sm text-offwhite/60 mb-2">Your answer: {answers[i] || "(not answered)"}</p>
              <p className="text-sm text-gold mb-2">Score: {ev.score}/100</p>
              <p className="text-sm text-offwhite/70 mb-2">{ev.feedback}</p>
              {ev.strengths?.length > 0 && (
                <p className="text-xs text-teal/80">✓ {ev.strengths.join(", ")}</p>
              )}
              {ev.improvements?.length > 0 && (
                <p className="text-xs text-red-300/80">→ {ev.improvements.join(", ")}</p>
              )}
            </div>
          );
        })}

        <div className="flex gap-4 mt-6">
          <Button onClick={downloadPDF}>Download PDF Report</Button>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InterviewResult;
