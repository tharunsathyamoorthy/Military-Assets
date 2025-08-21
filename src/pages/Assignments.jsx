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
      const assetsRes = await API.get("/assets");
      setAssets(assetsRes.data);
      const assignmentsRes = await API.get("/assignments");
      setAssignments(assignmentsRes.data);
    };
    fetchData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAssign = async (e) => {
    e.preventDefault();
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
    <div>
      <h2>Assignments & Expenditures</h2>
      <form onSubmit={handleAssign}>
        <select name="asset_id" value={form.asset_id} onChange={handleChange} required>
          <option value="">Select Asset</option>
          {assets.map((a) => (
            <option key={a._id} value={a._id}>{a.name}</option>
          ))}
        </select>
        <input
          name="personnel"
          placeholder="Personnel"
          value={form.personnel}
          onChange={handleChange}
          required
        />
        <input
          name="qty"
          type="number"
          placeholder="Quantity"
          value={form.qty}
          onChange={handleChange}
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Assigned">Assigned</option>
          <option value="Expended">Expended</option>
        </select>
        <button type="submit">Record Assignment</button>
      </form>
      <h3>Assignment History</h3>
      <ul>
        {assignments.map((a) => (
          <li key={a._id}>
            {a.qty} of {a.asset_name || a.asset_id} to {a.personnel} on {new Date(a.date).toLocaleDateString()} ({a.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Assignments;
