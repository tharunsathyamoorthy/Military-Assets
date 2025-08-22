import React, { useState, useEffect } from "react";
import API from "../services/api";

function Assignments() {
  const [form, setForm] = useState({
    asset_id: "",
    personnel: "",
    qty: "",
    date: "",
    status: "Assigned",
  });

  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function fetchInitial() {
      try {
        const [assetsRes, assignmentsRes] = await Promise.all([
          API.get("/assets"),
          API.get("/assignments"),
        ]);
        setAssets(assetsRes.data);
        setAssignments(assignmentsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchInitial();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!form.asset_id) return alert("Please select an asset");
    if (!form.personnel.trim()) return alert("Please enter personnel");
    if (!form.qty || Number(form.qty) <= 0) return alert("Enter a valid quantity");
    if (!form.date) return alert("Please select a date");

    try {
      await API.post("/assignments", form);
      alert("Assignment recorded!");
      setForm({ asset_id: "", personnel: "", qty: "", date: "", status: "Assigned" });

      const assignmentsRes = await API.get("/assignments");
      setAssignments(assignmentsRes.data);
    } catch (error) {
      console.error("Assignment failed:", error);
      const message = error.response?.data?.message || "Assignment failed";
      alert(message);
    }
  };

  const getAssetName = (id) => {
    const asset = assets.find((a) => a._id === id);
    return asset ? asset.name : id;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8fb", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "#FFD600", width: 330, borderRadius: "24px 0 0 24px", height: 550, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 40px #e2eaf0", padding: 36 }}>
        <div style={{ width: 98, height: 98, borderRadius: "50%", background: "#FFA726", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 30 }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="26" fill="#fff" />
            <ellipse cx="26" cy="25" rx="14" ry="13" fill="#232946" />
            <ellipse cx="26" cy="41" rx="14" ry="7" fill="#fff" />
          </svg>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: "bold", color: "#232946", marginBottom: 10 }}>Assign Equipment</h2>
        <p style={{ fontSize: 15, color: "#232946", textAlign: "center", marginBottom: 20 }}>Assign or expend assets for your personnel.</p>
      </div>
      <div style={{ flex: 1, background: "#fff", borderRadius: "0 24px 24px 0", maxWidth: 540, height: 550, padding: "28px 36px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <h2 style={{ marginBottom: 15 }}>Assignments & Expenditures</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <select name="asset_id" value={form.asset_id} onChange={handleChange} required style={inputStyle}>
            <option value="">Select Asset</option>
            {assets.map((a) => (
              <option key={a._id} value={a._id}>{a.name} ({a.type})</option>
            ))}
          </select>
          <input name="personnel" placeholder="Personnel" value={form.personnel} onChange={handleChange} required style={inputStyle} />
          <input type="number" min={1} name="qty" placeholder="Quantity" value={form.qty} onChange={handleChange} required style={inputStyle} />
          <input type="date" name="date" value={form.date} onChange={handleChange} required style={inputStyle} />
          <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
            <option value="Assigned">Assigned</option>
            <option value="Expended">Expended</option>
          </select>
          <button type="submit" style={buttonStyle}>Record Assignment</button>
        </form>
        <h3>Assignment History</h3>
        <ul style={{ listStyle: "none", padding: 0, maxHeight: 110, overflow: 'auto' }}>
          {assignments.map(a => (
            <li key={a._id} style={{ background: "#f7fafa", marginBottom: 7, padding: 10, borderRadius: 8 }}>
              {a.qty} of {a.asset_id?.name || a.asset_id} to {a.personnel} on {new Date(a.date).toLocaleDateString()} ({a.status})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #d3d7cf",
  marginBottom: 10,
  fontSize: 15,
  outline: "none",
  width: "100%",
};

const buttonStyle = {
  backgroundColor: "#1e40af",
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
  padding: "10px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  alignSelf: "flex-end",
  width: 140,
};

export default Assignments;
