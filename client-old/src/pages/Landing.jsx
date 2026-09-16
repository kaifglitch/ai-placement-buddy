import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1>AI Campus Placement Assistant</h1>
      <p style={{ color: "#555", maxWidth: "500px", margin: "20px auto" }}>
        Prepare smarter for placements with AI-generated assessments,
        coding practice, mock interviews, and personalized readiness scoring.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <Button onClick={() => navigate("/signup")}>Get Started</Button>
        <Button variant="secondary" onClick={() => navigate("/login")}>
          Log In
        </Button>
      </div>
    </div>
  );
}

export default Landing;
