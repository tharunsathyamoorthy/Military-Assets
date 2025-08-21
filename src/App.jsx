import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transfers from "./pages/Transfers.jsx";
import Purchases from "./pages/Purchases.jsx";
import Assignments from "./pages/Assignments.jsx";

function App() {
  const token = localStorage.getItem("token");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <BrowserRouter>
        <Routes>
          {/* Always show Signup at root and unknown paths */}
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/transfers"
            element={token ? <Transfers /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchases"
            element={token ? <Purchases /> : <Navigate to="/login" />}
          />
          <Route
            path="/assignments"
            element={token ? <Assignments /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
