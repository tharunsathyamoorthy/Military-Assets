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
      const assetsRes = await API.get("/assets");
      setAssets(assetsRes.data);
      const transfersRes = await API.get("/transfers");
      setTransfers(transfersRes.data);
    };
    fetchData();
  }, []);

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

  const getAssetName = (id) => {
    const asset = assets.find((a) => a._id === id);
    return asset ? `${asset.name} (${asset.type})` : id;
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f4f8fb",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      {/* Yellow Left Panel */}
      <div style={{
        background: "#FFD600", width: 330, borderRadius: "24px 0 0 24px",
        height: 550, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", boxShadow: "0 8px 40px #e2e8f0", padding: "36px 26px",
      }}>
        <div style={{
          width: 98, height: 98, borderRadius: "50%", background: "#FFA726",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30,
        }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="26" fill="#fff"/>
            <ellipse cx="26" cy="25" rx="14" ry="13" fill="#232946"/>
            <ellipse cx="26" cy="41" rx="14" ry="7" fill="#fff"/>
          </svg>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 13, color: "#232946" }}>
          Register Transfer
        </div>
        <div style={{
          fontSize: 15, color: "#232946", marginBottom: 22, textAlign: "center"
        }}>
          Quickly record transfers<br />
          of assets between bases.
        </div>
        <button style={{
          border: "none", outline: "none", borderRadius: "50%",
          background: "#232946", color: "#fff", width: 48, height: 48,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", marginTop: 14, fontSize: 22,
          boxShadow: "0 1px 8px #cfcfcf"
        }}>
          &#8594;
        </button>
      </div>

      {/* White Panel: form and history */}
      <div style={{
        background: "#fff", borderRadius: "0 24px 24px 0", boxShadow: "0 8px 40px #e2e8f0",
        flex: "1 1 0", minWidth: 360, maxWidth: 540, height: 550, padding: "28px 36px",
        display: "flex", flexDirection: "column", justifyContent: "center", overflowY: 'auto'
      }}>
        <h2 style={{ color: "#2d3748", fontWeight: 700, fontSize: 26, marginBottom: 15 }}>Asset Transfers</h2>
        <form onSubmit={handleTransfer}
          style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
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
        <h3 style={{ color: "#4a5568", fontWeight: 600, marginBottom: 5, fontSize: 17 }}>Transfer History</h3>
        <ul style={{ padding: 0, listStyle: "none", maxHeight: 110, overflow: 'auto' }}>
          {transfers.map((t) => (
            <li
              key={t._id}
              style={{
                background: "#f7fafc", marginBottom: 7,
                padding: 10, borderRadius: 8, boxShadow: "0 1px 4px #e2e8f0", fontSize: 15,
              }}
            >
              {t.qty} of {getAssetName(t.asset_id)} from {t.from_base} to {t.to_base} on {new Date(t.date).toLocaleDateString()}
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

export default Transfers;
