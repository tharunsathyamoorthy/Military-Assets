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
    const fetchData = async () => {
      try {
        const assetsRes = await API.get("/assets");
        setAssets(assetsRes.data);
        const assignmentsRes = await API.get("/assignments");
        setAssignments(assignmentsRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAssign = async (e) => {
    e.preventDefault();

    if(!form.asset_id || !form.personnel || !form.qty || !form.date) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await API.post("/assignments", form);
      alert("Assignment recorded!");
      setForm({ asset_id: "", personnel: "", qty: "", date: "", status: "Assigned" });

      const assignmentsRes = await API.get("/assignments");
      setAssignments(assignmentsRes.data);
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    }
  };

  const getAssetName = (id) => {
    const asset = assets.find(a => a._id === id);
    return asset ? asset.name : id;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#FFD600", width: 330, borderRadius: "24px 0 0 24px", height: 550, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 40px #e2e8f0", padding: "36px 26px" }}>
        <div style={{ width: 98, height: 98, borderRadius: "50%", background: "#FFA726", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30 }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="26" fill="#fff" />
            <ellipse cx="26" cy="25" rx="14" ry="13" fill="#232946" />
            <ellipse cx="26" cy="41" rx="14" ry="7" fill="#fff" />
          </svg>
        </div>
        <div style={{ fontSize: 24, fontWeight: "800", marginBottom: 13, color: "#232946" }}>Assign Equipment</div>
        <div style={{ fontSize: 15, color: "#232946", marginBottom: 22, textAlign: "center" }}>
          Assign or expend assets<br /> for your personnel.
        </div>
        <button style={{ border: "none", outline: "none", borderRadius: "50%", background: "#232946", color: "#fff", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 14, fontSize: 22, boxShadow: "0 1px 8px #cfcfcf" }}>
          &#8594;
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: "0 24px 24px 0", boxShadow: "0 8px 40px #e2e8f0", flex: "1 1 auto", maxWidth: 540, height: 550, padding: "28px 36px", display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto" }}>
        <h2 style={{ color: "#2d3748", fontWeight: "700", fontSize: 26, marginBottom: 15 }}>Assignments & Expenditures</h2>
        <form onSubmit={handleAssign} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <select
            name="asset_id"
            value={form.asset_id}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select Asset</option>
            {assets.map(a => (
              <option key={a._id} value={a._id}>{a.name} ({a.type})</option>
            ))}
          </select>
          <input name="personnel" placeholder="Personnel" value={form.personnel} onChange={handleChange} required style={inputStyle} />
          <input name="qty" type="number" min={1} placeholder="Quantity" value={form.qty} onChange={handleChange} required style={inputStyle} />
          <input name="date" type="date" value={form.date} onChange={handleChange} required style={inputStyle} />
          <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
            <option value="Assigned">Assigned</option>
            <option value="Expended">Expended</option>
          </select>
          <button type="submit" style={buttonStyle}>Record Assignment</button>
        </form>

        <h3 style={{ color: "#4a5568", fontWeight: "600", marginBottom: 5, fontSize: 17 }}>Assignment History</h3>
        <ul style={{ listStyle: "none", padding: 0, maxHeight: 110, overflowY: "auto" }}>
          {assignments.map(a => (
            <li key={a._id} style={{ background: "#f7fafc", marginBottom: 7, padding: 10, borderRadius: 8, boxShadow: "0 1px 4px #e2e8f0", fontSize: 15 }}>
              {a.qty} of {a.asset_id.name || a.asset_id._id} to {a.personnel} on {new Date(a.date).toLocaleDateString()} ({a.status})
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
  fontSize: 15,
  outline: "none",
  background: "#fff",
  marginBottom: 0,
};

const buttonStyle = {
  backgroundColor: "#6B7267",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "10px 0",
  fontWeight: "bold",
  fontSize: 15,
  cursor: "pointer",
  marginTop: 7,
  boxShadow: "0 2px 8px #e2e8f0",
  width: 120,
  alignSelf: "flex-end",
  letterSpacing: 1,
};

export default Assignments;
