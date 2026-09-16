import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";
import LoadingOverlay from "../components/LoadingOverlay";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter both email and password.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-offwhite flex items-center justify-center px-6 page-fade-in">
      {loading && <LoadingOverlay message="Logging you in..." />}
      <div className="w-full max-w-sm">
        <h2 className="font-display text-3xl font-bold mb-2">Welcome back</h2>
        <p className="text-offwhite/60 mb-8">Log in to continue your prep.</p>
        <form onSubmit={handleLogin}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-offwhite placeholder-offwhite/40 focus:outline-none focus:border-teal/60 mb-3"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-offwhite placeholder-offwhite/40 focus:outline-none focus:border-teal/60 mb-4"
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
