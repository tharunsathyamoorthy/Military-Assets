import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

// You can replace this with your actual logo SVG or image
const MilitaryLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#6B7267" />
    <path d="M24 12L34 18V30L24 36L14 30V18L24 12Z" fill="#fff" />
  </svg>
);

function Signup() {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={cardStyle}
    >
      <div style={{ marginBottom: 16 }}>
        <MilitaryLogo />
      </div>
      <div
        style={{
          fontWeight: 700,
          fontSize: 28,
          color: "#6B7267",
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        MILITARY
      </div>
      <div
        style={{
          fontSize: 18,
          color: "#222",
          marginBottom: 24,
          fontWeight: 500,
        }}
      >
        Need some help?
      </div>
      <form
        onSubmit={handleSignup}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: "100%",
        }}
      >
        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#6B7267" }}
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#6B7267" }}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#6B7267" }}
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <motion.select
          whileFocus={{ scale: 1.02, borderColor: "#6B7267" }}
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
          whileFocus={{ scale: 1.02, borderColor: "#6B7267" }}
          name="base"
          placeholder="Base (if applicable)"
          value={form.base}
          onChange={handleChange}
          style={inputStyle}
        />
        <motion.button
          whileHover={{ scale: 1.03, background: "#6B7267" }}
          type="submit"
          style={buttonStyle}
        >
          Sign Up
        </motion.button>
      </form>
      <div style={{ marginTop: 22, textAlign: "center", fontSize: 16 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#6B7267", fontWeight: "bold" }}>
          Login
        </Link>
      </div>
    </motion.div>
  );
}

const cardStyle = {
  maxWidth: 420,
  margin: "60px auto",
  background: "#fff",
  borderRadius: 18,
  boxShadow: "0 6px 32px #e2e8f0",
  padding: 48,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const inputStyle = {
  padding: 14,
  borderRadius: 6,
  border: "1.5px solid #d3d7cf",
  fontSize: 16,
  outline: "none",
  transition: "border 0.2s",
  background: "#fff",
  boxShadow: "0 1px 4px #f1f1f1",
  width: "100%",
};

const buttonStyle = {
  background: "#6B7267",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "14px 0",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 18,
  marginTop: 8,
  boxShadow: "0 2px 8px #e2e8f0",
  width: "100%",
  letterSpacing: 1,
};

export default Signup;
