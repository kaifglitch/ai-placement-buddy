import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    if (!identifier) {
      setError("Enter your email or mobile number.");
      return;
    }

    try {
      setError("");
      await api.post("/auth/request-otp", { email: identifier });
      navigate("/verify-otp", { state: { email: identifier, mode: "login" } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div style={{ maxWidth: "380px", margin: "40px auto" }}>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <input
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email or Mobile Number"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button type="submit">Send OTP</Button>
      </form>
    </div>
  );
}

export default Login;
