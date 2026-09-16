function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h2>Welcome, {user.fullName || "Student"} 👋</h2>
      <p>Email: {user.email}</p>
      <p>Target Role: {user.targetRole}</p>
      <p style={{ marginTop: "20px", color: "#555" }}>
        (Dashboard with real performance data coming in Phase 5)
      </p>
    </div>
  );
}

export default Dashboard;
