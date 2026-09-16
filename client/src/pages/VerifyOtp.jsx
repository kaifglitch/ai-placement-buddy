import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";
import LoadingOverlay from "../components/LoadingOverlay";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "your email";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(e) {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    const mode = location.state?.mode || "login";
    const formData = location.state?.formData;

    try {
      setLoading(true);
      setError("");
      const endpoint = mode === "signup" ? "/auth/verify-signup" : "/auth/verify-login";
      const payload = mode === "signup" ? { ...formData, otp } : { email, otp };
      const res = await api.post(endpoint, payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-offwhite flex items-center justify-center px-6">
      {loading && <LoadingOverlay message="Verifying your details..." />}
      <div className="w-full max-w-sm text-center">
        <h2 className="font-display text-3xl font-bold mb-2">Verify your email</h2>
        <p className="text-offwhite/60 mb-8">We sent a code to {email}</p>
        <form onSubmit={handleVerify}>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-offwhite text-center tracking-[0.3em] placeholder-offwhite/40 focus:outline-none focus:border-teal/60 mb-4"
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
