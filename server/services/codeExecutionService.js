async function runCode(code, input) {
  const response = await fetch("https://api.onlinecompiler.io/api/run-code-sync/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.ONLINECOMPILER_API_KEY,
    },
    body: JSON.stringify({
      compiler: "g++-15",
      code,
      input: input || "",
    }),
  });

  const data = await response.json();
  return {
    output: (data.output || "").trim(),
    error: data.error || "",
    status: data.status,
  };
}

module.exports = { runCode };