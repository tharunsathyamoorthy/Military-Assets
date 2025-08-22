import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

// Military Logo SVG - same as Login
const MilitaryLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#6B7267" />
    <path d="M24 12L34 18V30L24 36L14 30V18L24 12Z" fill="#fff" />
  </svg>
);

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "LogisticsOfficer",
    base: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all required fields.");
      return;
    }
    try {
      await API.post("/auth/signup", form);
      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const cardStyle = {
    maxWidth: 420,
    margin: "60px auto",
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 10px 36px rgba(0,0,0,0.12)",
    padding: 48,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const inputStyle = {
    padding: 16,
    borderRadius: 8,
    border: "1.5px solid #cbd5e1",
    fontSize: 17,
    outline: "none",
    background: "#f9fafb",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
    width: "100%",
    transition: "border-color 0.3s ease",
  };

  const buttonStyle = {
    background: "#6B7267",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "16px 0",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 20,
    marginTop: 16,
    boxShadow: "0 4px 14px rgba(107,114,103,0.4)",
    width: "100%",
    letterSpacing: 1.1,
    transition: "background 0.3s ease",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={cardStyle}
    >
      <div style={{ marginBottom: 20 }}>
        <MilitaryLogo />
      </div>
      <h2
        style={{
          fontWeight: 800,
          fontSize: 30,
          color: "#6B7267",
          letterSpacing: 1,
          marginBottom: 16,
        }}
      >
        MILITARY
      </h2>
      <p
        style={{
          fontSize: 18,
          color: "#222",
          marginBottom: 28,
          fontWeight: 500,
          textAlign: "center",
          maxWidth: 280,
        }}
      >
        Need some help?
      </p>
      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
        <motion.input
          whileFocus={{ scale: 1.03, borderColor: "#6B7267" }}
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <motion.input
          whileFocus={{ scale: 1.03, borderColor: "#6B7267" }}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <motion.input
          whileFocus={{ scale: 1.03, borderColor: "#6B7267" }}
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <motion.select
          whileFocus={{ scale: 1.03, borderColor: "#6B7267" }}
          name="role"
          value={form.role}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="Admin">Admin</option>
          <option value="BaseCommander">BaseCommander</option>
          <option value="LogisticsOfficer">LogisticsOfficer</option>
        </motion.select>
        <motion.input
          whileFocus={{ scale: 1.03, borderColor: "#6B7267" }}
          name="base"
          placeholder="Base (if applicable)"
          value={form.base}
          onChange={handleChange}
          style={inputStyle}
        />
        <motion.button
          whileHover={{ scale: 1.05, background: "#5a6357" }}
          type="submit"
          style={buttonStyle}
        >
          Sign Up
        </motion.button>
      </form>
      <p style={{ marginTop: 24, textAlign: "center", fontSize: 16 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#6B7267", fontWeight: "700", textDecoration: "underline" }}>
          Login
        </Link>
      </p>
    </motion.div>
  );
}
