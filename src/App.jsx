import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transfers from "./pages/Transfers.jsx";
import Purchases from "./pages/Purchases.jsx";
import Assignments from "./pages/Assignments.jsx";
import Assets from "./pages/Assets.jsx";
import Profile from "./pages/Profile.jsx";
import Layout from "./components/Navbar.jsx";

function App() {
  const token = !!localStorage.getItem("token");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Protected routes inside Layout */}
          <Route element={token ? <Layout /> : <Navigate to="/login" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/assignments" element={<Assignments />} />
             <Route path="/assets" element={<Assets />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
