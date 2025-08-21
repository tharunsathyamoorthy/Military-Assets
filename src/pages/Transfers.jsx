import React, { useState, useEffect } from "react";
import API from "../services/api";

function Transfers() {
  const [form, setForm] = useState({
    asset_id: "",
    from_base: "",
    to_base: "",
    qty: "",
  });
  const [transfers, setTransfers] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Always fetch fresh assets from backend
      const assetsRes = await API.get("/assets");
      setAssets(assetsRes.data);
      const transfersRes = await API.get("/transfers");
      setTransfers(transfersRes.data);
    };
    fetchData();
  }, [/* no dependencies, fetch on mount */]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await API.post("/transfers", form);
      alert("Transfer successful!");
      setForm({ asset_id: "", from_base: "", to_base: "", qty: "" });
      const transfersRes = await API.get("/transfers");
      setTransfers(transfersRes.data);
    } catch (err) {
      alert(err.response?.data?.message || "Transfer failed");
    }
  };

  // Helper to get asset name by id
  const getAssetName = (id) => {
    const asset = assets.find((a) => a._id === id);
    return asset ? `${asset.name} (${asset.type})` : id;
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 6px 32px #e2e8f0",
        padding: 36,
      }}
    >
      <h2 style={{ color: "#2d3748", fontWeight: 700, fontSize: 28, marginBottom: 18 }}>
        Asset Transfers
      </h2>
      <form
        onSubmit={handleTransfer}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <select
          name="asset_id"
          value={form.asset_id}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select Asset</option>
          {assets.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name} ({a.type}) - {a.base}
            </option>
          ))}
        </select>
        <input
          name="from_base"
          placeholder="From Base"
          value={form.from_base}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="to_base"
          placeholder="To Base"
          value={form.to_base}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="qty"
          type="number"
          placeholder="Quantity"
          value={form.qty}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Transfer
        </button>
      </form>
      <h3 style={{ color: "#4a5568", fontWeight: 600, marginBottom: 14, fontSize: 20 }}>
        Transfer History
      </h3>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {transfers.map((t) => (
          <li
            key={t._id}
            style={{
              background: "#f7fafc",
              marginBottom: 10,
              padding: 16,
              borderRadius: 8,
              boxShadow: "0 1px 4px #e2e8f0",
              fontSize: 16,
            }}
          >
            {t.qty} of {getAssetName(t.asset_id)} from {t.from_base} to {t.to_base} on{" "}
            {new Date(t.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

const inputStyle = {
  padding: 12,
  borderRadius: 6,
  border: "1.5px solid #d3d7cf",
  fontSize: 16,
  outline: "none",
  transition: "border 0.2s",
  background: "#fff",
  boxShadow: "0 1px 4px #f1f1f1",
  width: "100%",
  marginBottom: 0,
};

const buttonStyle = {
  background: "#6B7267",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "12px 0",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 16,
  marginTop: 8,
  boxShadow: "0 2px 8px #e2e8f0",
  width: 160,
  alignSelf: "flex-end",
  letterSpacing: 1,
};

export default Transfers;
