import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Purchases() {
  const [form, setForm] = useState({
    asset_id: "",
    base_id: "",
    qty: "",
    date: "",
  });
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assetsRes = await API.get("/assets");
        setAssets(assetsRes.data);
      } catch (error) {
        console.error("Failed to fetch assets", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      await API.post("/purchases", form);
      alert("Purchase recorded!");
      setForm({ asset_id: "", base_id: "", qty: "", date: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  const gotoHistory = () => {
    navigate("/purchase-history");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {/* Yellow Left Panel */}
      <div
        style={{
          background: "#FFD600",
          width: 330,
          borderRadius: "24px 0 0 24px",
          height: 620,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 40px #e2e8f0",
          padding: "36px 26px",
        }}
      >
        <div
          style={{
            width: 98,
            height: 98,
            borderRadius: "50%",
            background: "#FFA726",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="26" fill="#fff" />
            <ellipse cx="26" cy="25" rx="14" ry="13" fill="#232946" />
            <ellipse cx="26" cy="41" rx="14" ry="7" fill="#fff" />
          </svg>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 13, color: "#232946" }}>
          Add Purchases
        </div>
        <div style={{ fontSize: 15, color: "#232946", marginBottom: 22, textAlign: "center" }}>
          It should only take a couple of minutes<br />
          to record your asset purchases.
        </div>
        {/* Optional: keep the yellow panel arrow, or remove if you want only on right */}
      </div>

      {/* White Panel: form and history button */}
      <div
        style={{
          background: "#fff",
          borderRadius: "0 24px 24px 0",
          boxShadow: "0 8px 40px #e2e8f0",
          flex: "1 1 0",
          minWidth: 360,
          maxWidth: 540,
          height: 620,
          padding: "28px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflowY: "auto",
        }}
      >
        <h2 style={{ color: "#2d3748", fontWeight: 700, fontSize: 26, marginBottom: 15 }}>
          Asset Purchases
        </h2>
        <form onSubmit={handlePurchase} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
            name="base_id"
            placeholder="Base"
            value={form.base_id}
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
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Record Purchase
          </button>
        </form>
        
        {/* VIEW PURCHASE HISTORY BUTTON */}
        <button
          style={{
            background: "#232946",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
            padding: "10px 0",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            marginTop: 24,
            width: 180,
            alignSelf: "center",
            letterSpacing: 1,
          }}
          onClick={gotoHistory}
        >
          View Purchase History
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: 10,
  borderRadius: 6,
  border: "1.2px solid #d3d7cf",
  fontSize: 15,
  outline: "none",
  transition: "border 0.2s",
  background: "#fff",
  boxShadow: "0 1px 2px #f1f1f1",
  width: "100%",
  marginBottom: 0,
};

const buttonStyle = {
  background: "#6B7267",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "10px 0",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 15,
  marginTop: 7,
  boxShadow: "0 2px 8px #e2e8f0",
  width: 120,
  alignSelf: "flex-end",
  letterSpacing: 1,
};

export default Purchases;
