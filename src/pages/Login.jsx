import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

// Use the same logo as Signup
const MilitaryLogo = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#6B7267" />
    <path d="M24 12L34 18V30L24 36L14 30V18L24 12Z" fill="#fff" />
  </svg>
);

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid login");
    }
  };

  const cardStyle = {
    maxWidth: 420,
    margin: "60px auto",
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 8px 32px #e2e8f0",
    padding: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const inputStyle = {
    padding: 15,
    borderRadius: 8,
    border: "1.5px solid #d3d7cf",
    fontSize: 17,
    outline: "none",
    transition: "border 0.2s, box-shadow 0.2s",
    background: "#f8fafc",
    boxShadow: "0 1px 4px #f1f1f1",
    width: "100%",
    marginBottom: 2,
  };

  const buttonStyle = {
    background: "linear-gradient(90deg,#6B7267,#4e554b)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "15px 0",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 19,
    marginTop: 8,
    boxShadow: "0 2px 8px #e2e8f0",
    width: "100%",
    letterSpacing: 1,
    transition: "background 0.2s",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={cardStyle}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #6B7267 60%, #e6f0ea 100%)",
          padding: "38px 0 26px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MilitaryLogo />
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 28, marginTop: 14, letterSpacing: 1.5, textShadow: "0 2px 8px #6B7267" }}>
          Welcome Back!
        </div>
        <div style={{ color: "#e6f0ea", fontSize: 16, marginTop: 8, fontWeight: 400, opacity: 0.95 }}>
          To stay connected, please login with your personal info
        </div>
      </div>
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
          padding: "38px 36px 24px 36px",
        }}
      >
        <motion.input
          whileFocus={{ scale: 1.03, borderColor: "#6B7267" }}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
        />
        <motion.input
          whileFocus={{ scale: 1.03, borderColor: "#6B7267" }}
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={inputStyle}
        />
        <div style={{ textAlign: "right", marginBottom: 8 }}>
          <Link to="#" style={{ color: "#6B7267", fontSize: 15, textDecoration: "underline", opacity: 0.85 }}>
            Forgot your password?
          </Link>
        </div>
        <motion.button
          whileHover={{ scale: 1.04, background: "#5a6357" }}
          type="submit"
          style={buttonStyle}
        >
          LOG IN
        </motion.button>
      </form>
      <div style={{ textAlign: "center", paddingBottom: 28, fontSize: 16 }}>
        Don't have an account?{" "}
        <Link to="/signup" style={{ color: "#6B7267", fontWeight: "bold", textDecoration: "underline" }}>
          Sign up
        </Link>
      </div>
    </motion.div>
  );
}
