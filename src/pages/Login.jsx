import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

// Military Logo SVG
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
    boxShadow: "0 12px 36px rgba(0,0,0,0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const inputStyle = {
    padding: 16,
    borderRadius: 8,
    border: "1.5px solid #cbd5e1",
    fontSize: 18,
    outline: "none",
    background: "#f9fafb",
    boxShadow: "inset 0 1px 3px rgb(0 0 0 / 0.06)",
    width: "100%",
    marginBottom: 6,
    transition: "border-color 0.3s ease",
  };

  const buttonStyle = {
    background: "linear-gradient(90deg,#6B7267,#4e554b)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "16px 0",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 20,
    marginTop: 10,
    boxShadow: "0 4px 12px rgba(75, 75, 75, 0.25)",
    width: "100%",
    letterSpacing: 1.1,
    transition: "background 0.25s ease",
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
          padding: "42px 0 28px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MilitaryLogo />
        <h2
          style={{
            color: "#fff",
            fontWeight: "900",
            fontSize: 30,
            marginTop: 20,
            letterSpacing: 1.4,
            textShadow: "0 3px 10px #6B7267",
          }}
        >
          Welcome Back!
        </h2>
        <p
          style={{
            color: "#d1d5db",
            fontSize: 16,
            marginTop: 8,
            fontWeight: 400,
            opacity: 0.9,
            maxWidth: 280,
            textAlign: "center",
          }}
        >
          To stay connected, please login with your personal info
        </p>
      </div>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: 20, padding: "38px 44px 32px" }}
      >
        <motion.input
          whileFocus={{ scale: 1.03, borderColor: "#6B7267" }}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <motion.input
          whileFocus={{ scale: 1.03, borderColor: "#6B7267" }}
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <div style={{ textAlign: "right", marginBottom: 10 }}>
          <Link
            to="#"
            style={{ color: "#6B7267", fontSize: 15, textDecoration: "underline", opacity: 0.85 }}
          >
            Forgot your password?
          </Link>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, background: "#565e53" }}
          type="submit"
          style={buttonStyle}
        >
          LOG IN
        </motion.button>
      </form>
      <div style={{ textAlign: "center", paddingBottom: 28, fontSize: 16 }}>
        Don't have an account?{" "}
        <Link to="/signup" style={{ color: "#6B7267", fontWeight: "700", textDecoration: "underline" }}>
          Sign up
        </Link>
      </div>
    </motion.div>
  );
}
