import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "your email";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  async function handleVerify(e) {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }

    const mode = location.state?.mode || "login";
    const formData = location.state?.formData;

    try {
      setError("");
      const endpoint = mode === "signup" ? "/auth/verify-signup" : "/auth/verify-login";
      const payload = mode === "signup" ? { ...formData, otp } : { email, otp };

      const res = await api.post(endpoint, payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  }

  return (
    <div style={{ maxWidth: "380px", margin: "40px auto", textAlign: "center" }}>
      <h2>Verify your email</h2>
      <p>We sent a code to {email}</p>
      <form onSubmit={handleVerify}>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button type="submit">Verify</Button>
      </form>
    </div>
  );
}

export default VerifyOtp;
