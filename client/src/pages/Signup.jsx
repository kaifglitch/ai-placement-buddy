import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";
import LoadingOverlay from "../components/LoadingOverlay";

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-offwhite placeholder-offwhite/40 focus:outline-none focus:border-teal/60 mb-3";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", email: "", mobile: "", password: "", confirmPassword: "", college: "", branch: "", gradYear: "", targetRole: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const requiredFields = [form.fullName, form.email, form.mobile, form.password];
    if (requiredFields.some((value) => !String(value).trim())) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Invalid email format.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.confirmPassword !== undefined && form.confirmPassword !== form.password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post("/auth/signup", {
        ...form,
        confirmPassword: undefined,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-offwhite flex items-center justify-center px-6 py-16 page-fade-in">
      {loading && <LoadingOverlay message="Creating your account..." />}
      <div className="w-full max-w-md">
        <h2 className="font-display text-3xl font-bold mb-2">Create your account</h2>
        <p className="text-offwhite/60 mb-8">Start your placement prep journey today.</p>
        <form onSubmit={handleSubmit}>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} className={inputClass} />
          <input name="email" placeholder="Email" onChange={handleChange} className={inputClass} />
          <input name="mobile" placeholder="Mobile Number" onChange={handleChange} className={inputClass} />
          <input name="password" type="password" placeholder="Password (min 6 characters)" onChange={handleChange} className={inputClass} />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} className={inputClass} />
          <input name="college" placeholder="College" onChange={handleChange} className={inputClass} />
          <input name="branch" placeholder="Branch" onChange={handleChange} className={inputClass} />
          <input name="gradYear" placeholder="Graduation Year" onChange={handleChange} className={inputClass} />
          <input name="targetRole" placeholder="Target Job Role" onChange={handleChange} className={inputClass} />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
