const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

async function callGeminiWithRetry(prompt, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await response.json();

    const isOverloaded =
      data?.error?.code === 503 || data?.error?.status === "UNAVAILABLE";

    if (isOverloaded && attempt < maxRetries) {
      const waitMs = attempt * 2000;
      console.log(`Gemini overloaded, retrying in ${waitMs}ms (attempt ${attempt}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      continue;
    }

    if (data?.error) {
      throw new Error(data.error.message || "Gemini API error");
    }

    return data;
  }
}

async function generateQuestions(subject, difficulty, numQuestions) {
  const prompt = `Generate ${numQuestions} multiple choice questions for a college placement exam prep on the subject "${subject}" at "${difficulty}" difficulty level.
Return ONLY a valid JSON array (no markdown formatting, no extra text before or after) where each item has this exact structure:
{
  "questionText": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string (must exactly match one of the options)",
  "explanation": "string",
  "topic": "string (a specific sub-topic name, e.g. Arrays, Sliding Window, Normalization)"
}`;

  const data = await callGeminiWithRetry(prompt);
  console.log("Gemini raw response:", JSON.stringify(data, null, 2));
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  text = text.replace(/```json|```/g, "").trim();

  return JSON.parse(text);
}

async function generateInterviewQuestions(jobRole, experienceLevel, interviewType, numQuestions) {
  const prompt = `Generate ${numQuestions} mock interview questions for a "${jobRole}" position, for a candidate at "${experienceLevel}" experience level, focused on "${interviewType}" interview type.
Return ONLY a valid JSON array (no markdown, no extra text) where each item has this exact structure:
{
  "questionText": "string",
  "category": "string (e.g. Technical, Behavioral, Problem-Solving)"
}`;

  const data = await callGeminiWithRetry(prompt);
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  text = text.replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

async function evaluateInterviewAnswers(questions, answers, jobRole) {
  const qaPairs = questions
    .map((q, i) => `Q${i + 1} (${q.category}): ${q.questionText}\nAnswer: ${answers[i] || "(no answer given)"}`)
    .join("\n\n");

  const prompt = `You are evaluating a mock interview for a "${jobRole}" position. Here are the questions and the candidate's answers:

${qaPairs}

For EACH answer, evaluate technical accuracy, completeness, and communication clarity. Then give an overall assessment.
Return ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
{
  "evaluations": [
    {
      "score": number (0-100),
      "feedback": "string - constructive feedback on this specific answer",
      "strengths": ["string"],
      "improvements": ["string"]
    }
  ],
  "overallScore": number (0-100, average weighted assessment),
  "overallFeedback": "string - 2-3 sentence summary of overall performance and next steps"
}
The "evaluations" array must have exactly ${questions.length} items, in the same order as the questions.`;

  const data = await callGeminiWithRetry(prompt);
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  text = text.replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

async function generateCodingProblem(difficulty) {
  const prompt = `Generate one coding problem for a placement preparation platform at "${difficulty}" difficulty level, similar to a LeetCode-style problem, solvable in C++.
Return ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
{
  "title": "string",
  "statement": "string - clear problem description",
  "constraints": "string - input constraints",
  "examples": [
    { "input": "string", "output": "string", "explanation": "string" }
  ],
  "testCases": [
    { "input": "string - raw stdin input", "expectedOutput": "string - exact expected stdout output" }
  ]
}
Provide exactly 2 items in "examples" and exactly 4 items in "testCases" (including the example cases). The program should read input from stdin and print output to stdout.`;

  const data = await callGeminiWithRetry(prompt);
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  text = text.replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

async function getCareerAdvice(question, context) {
  const prompt = `You are a career advisor AI for a college placement preparation platform. A student is asking for advice.

Student's profile:
- Target Role: ${context.targetRole}
- Placement Readiness Score: ${context.readinessScore}/100
- Category Scores: ${JSON.stringify(context.categoryScores)}
- Weak Topics: ${context.weakTopics?.join(", ") || "None identified yet"}
- Total Assessments Taken: ${context.totalAssessmentsTaken}

Student's question: "${question}"

Give a helpful, honest, and specific answer based on their actual data above. Do not make unsupported claims about real hiring decisions or guarantee outcomes. Keep the response concise (3-5 sentences) and actionable.
Return ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
{
  "answer": "string"
}`;

  const data = await callGeminiWithRetry(prompt);
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  text = text.replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

async function generateStudyPlan(context) {
  const prompt = `You are a study planner AI for a college placement preparation platform. Create a 7-day study plan for a student.

Student's profile:
- Target Role: ${context.targetRole}
- Placement Readiness Score: ${context.readinessScore}/100
- Category Scores: ${JSON.stringify(context.categoryScores)}
- Weak Topics: ${context.weakTopics?.join(", ") || "None identified yet, suggest general foundational practice"}

Return ONLY a valid JSON array (no markdown, no extra text) with exactly 7 items, one per day, where each item has this exact structure:
{
  "day": "string (e.g. Day 1)",
  "focusArea": "string - the main topic/category to focus on",
  "tasks": ["string", "string", "string"]
}
Prioritize the student's weak topics and lowest category scores earlier in the week. Keep tasks specific and actionable (not generic advice).`;

  const data = await callGeminiWithRetry(prompt);
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  text = text.replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

module.exports = { generateQuestions, generateInterviewQuestions, evaluateInterviewAnswers, generateCodingProblem, getCareerAdvice, generateStudyPlan };