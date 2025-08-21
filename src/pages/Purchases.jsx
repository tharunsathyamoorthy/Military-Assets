import React, { useState, useEffect } from "react";
import API from "../services/api";

function Purchases() {
  const [form, setForm] = useState({
    asset_id: "",
    base_id: "",
    qty: "",
    date: "",
  });
  const [purchases, setPurchases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "",
    base: "",
    openingBalance: 0,
    closingBalance: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      // Always fetch fresh assets from backend
      const assetsRes = await API.get("/assets");
      setAssets(assetsRes.data);
      // Optionally fetch bases if you want to show base names in dropdown
      // const basesRes = await API.get("/bases");
      // setBases(basesRes.data);
      const purchasesRes = await API.get("/purchases");
      setPurchases(purchasesRes.data);
    };
    fetchData();
  }, [/* no dependencies, fetch on mount */]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      await API.post("/purchases", form);
      alert("Purchase recorded!");
      setForm({ asset_id: "", base_id: "", qty: "", date: "" });
      const purchasesRes = await API.get("/purchases");
      setPurchases(purchasesRes.data);
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  const handleAssetChange = (e) =>
    setNewAsset({ ...newAsset, [e.target.name]: e.target.value });

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await API.post("/assets", newAsset);
      alert("Asset added!");
      setNewAsset({
        name: "",
        type: "",
        base: "",
        openingBalance: 0,
        closingBalance: 0,
      });
      const assetsRes = await API.get("/assets");
      setAssets(assetsRes.data);
    } catch (err) {
      alert(err.response?.data?.message || "Asset creation failed");
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
        Asset Purchases
      </h2>
      {/* Asset creation form */}
      <form
        onSubmit={handleAddAsset}
        style={{
          marginBottom: 32,
          background: "#f7fafc",
          padding: 18,
          borderRadius: 10,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <h4 style={{ width: "100%", margin: 0, color: "#6B7267" }}>Add New Asset</h4>
        <input
          name="name"
          placeholder="Asset Name"
          value={newAsset.name}
          onChange={handleAssetChange}
          required
          style={inputStyle}
        />
        <input
          name="type"
          placeholder="Type (e.g. Weapon, Vehicle)"
          value={newAsset.type}
          onChange={handleAssetChange}
          required
          style={inputStyle}
        />
        <input
          name="base"
          placeholder="Base"
          value={newAsset.base}
          onChange={handleAssetChange}
          required
          style={inputStyle}
        />
        <input
          name="openingBalance"
          type="number"
          placeholder="Opening Balance"
          value={newAsset.openingBalance}
          onChange={handleAssetChange}
          style={{ ...inputStyle, width: 120 }}
        />
        <input
          name="closingBalance"
          type="number"
          placeholder="Closing Balance"
          value={newAsset.closingBalance}
          onChange={handleAssetChange}
          style={{ ...inputStyle, width: 120 }}
        />
        <button type="submit" style={buttonStyle}>
          Add Asset
        </button>
      </form>
      <form
        onSubmit={handlePurchase}
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
          <option value="">
            {assets.length === 0 ? "No assets available" : "Select Asset"}
          </option>
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
      <h3 style={{ color: "#4a5568", fontWeight: 600, marginBottom: 14, fontSize: 20 }}>
        Purchase History
      </h3>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {purchases.map((p) => (
          <li
            key={p._id}
            style={{
              background: "#f7fafc",
              marginBottom: 10,
              padding: 16,
              borderRadius: 8,
              boxShadow: "0 1px 4px #e2e8f0",
              fontSize: 16,
            }}
          >
            {p.qty} of {getAssetName(p.asset_id)} at {p.base_name || p.base_id} on{" "}
            {new Date(p.date).toLocaleDateString()}
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

export default Purchases;
