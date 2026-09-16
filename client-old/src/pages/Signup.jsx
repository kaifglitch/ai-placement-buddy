import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    college: "",
    branch: "",
    gradYear: "",
    targetRole: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.mobile) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setError("");
      await api.post("/auth/request-otp", { email: form.email });
      navigate("/verify-otp", { state: { email: form.email, formData: form, mode: "signup" } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    }
  }

  return (
    <div style={{ maxWidth: "420px", margin: "40px auto" }}>
      <h2>Create your account</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="mobile" placeholder="Mobile Number" onChange={handleChange} />
        <input name="college" placeholder="College" onChange={handleChange} />
        <input name="branch" placeholder="Branch" onChange={handleChange} />
        <input name="gradYear" placeholder="Graduation Year" onChange={handleChange} />
        <input name="targetRole" placeholder="Target Job Role" onChange={handleChange} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}

export default Signup;
