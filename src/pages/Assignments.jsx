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
    async function fetchData() {
      try {
        const [assetsRes, assignmentsRes] = await Promise.all([
          API.get("/assets"),
          API.get("/assignments"),
        ]);
        console.log("Assets fetched:", assetsRes.data);
        setAssets(assetsRes.data);
        setAssignments(assignmentsRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.asset_id) {
      alert("Please select an asset");
      return;
    }
    if (!form.personnel.trim()) {
      alert("Please enter personnel");
      return;
    }
    if (!form.qty || Number(form.qty) <= 0) {
      alert("Enter a valid quantity");
      return;
    }
    if (!form.date) {
      alert("Please select a date");
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f5f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          background: "#FFD600",
          width: 330,
          borderRadius: "24px 0 0 24px",
          height: 550,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 40px #e0e6f2",
          padding: 36,
          marginRight: 20,
        }}
      >
        <div
          style={{
            width: 98,
            height: 98,
            borderRadius: "50%",
            background: "#FFA726",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
            <circle cx={26} cy={26} r={26} fill="#fff" />
            <ellipse cx={26} cy={25} rx={14} ry={13} fill="#232946" />
            <ellipse cx={26} cy={41} rx={14} ry={7} fill="#fff" />
          </svg>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: "bold", color: "#232946", marginBottom: 10 }}>
          Assign Equipment
        </h2>
        <p style={{ fontSize: 15, color: "#232946", textAlign: "center" }}>
          Assign or expend assets for your personnel.
        </p>
      </div>

      {/* Main Form and History */}
      <div
        style={{
          flex: 1,
          maxWidth: 540,
          background: "#fff",
          borderRadius: "0 24px 24px 0",
          height: 550,
          padding: "28px 36px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginBottom: 15 }}>Assignments & Expenditures</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}
        >
          <select
            name="asset_id"
            value={form.asset_id}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">{assets.length === 0 ? "No assets available" : "Select Asset"}</option>
            {assets.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name} ({a.type}) - {a.base}
              </option>
            ))}
          </select>

          <input
            name="personnel"
            placeholder="Personnel"
            value={form.personnel}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="qty"
            type="number"
            min={1}
            placeholder="Quantity"
            value={form.qty}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
            <option value="Assigned">Assigned</option>
            <option value="Expended">Expended</option>
          </select>

          <button type="submit" style={buttonStyle}>
            Record Assignment
          </button>
        </form>

        <h3>Assignment History</h3>
        <ul style={{ listStyle: "none", padding: 0, maxHeight: 110, overflow: "auto" }}>
          {assignments.map((assignment) => (
            <li
              key={assignment._id}
              style={{ padding: 10, marginBottom: 7, backgroundColor: "#f7fafb", borderRadius: 8 }}
            >
              {assignment.qty} of {assignment.asset_id?.name || assignment.asset_id} to {assignment.personnel} on{" "}
              {assignment.date ? new Date(assignment.date).toLocaleDateString() : "-"} ({assignment.status})
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
  backgroundColor: "#2563eb",
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
  padding: "10px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  width: 140,
  alignSelf: "flex-end",
  letterSpacing: 1,
};

export default Assignments;
