import React, { useEffect, useState } from "react";
import API from "../services/api";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "",
    base: "",
    openingBalance: "",
    closingBalance: ""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [assetsRes, purchasesRes, transfersRes] = await Promise.all([
          API.get("/assets"),
          API.get("/purchases"),
          API.get("/transfers")
        ]);

        setPurchases(purchasesRes.data);
        setTransfers(transfersRes.data);

        const purchaseCounts = {};
        purchasesRes.data.forEach(p => {
          const assetId = p.asset_id?._id || p.asset_id;
          purchaseCounts[assetId] = (purchaseCounts[assetId] ?? 0) + Number(p.qty);
        });

        const transferInCounts = {};
        const transferOutCounts = {};
        transfersRes.data.forEach(t => {
          const assetId = t.asset_id?._id || t.asset_id;
          transferInCounts[assetId] = (transferInCounts[assetId] ?? 0) + Number(t.qty);
          transferOutCounts[assetId] = (transferOutCounts[assetId] ?? 0) + Number(t.qty);
        });

        const updatedAssets = assetsRes.data.map(asset => ({
          ...asset,
          purchases: purchaseCounts[asset._id] ?? 0,
          transferIn: transferInCounts[asset._id] ?? 0,
          transferOut: transferOutCounts[asset._id] ?? 0,
          assigned: asset.assigned ?? 0,
          expended: asset.expended ?? 0,
        }));

        setAssets(updatedAssets);
      } catch (error) {
        console.error("Error loading data", error);
      }
    }

    fetchData();
  }, []);

  const handleAddChange = (e) => {
    setNewAsset({ ...newAsset, [e.target.name]: e.target.value });
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await API.post("/assets", {
        ...newAsset,
        openingBalance: Number(newAsset.openingBalance),
        closingBalance: Number(newAsset.closingBalance)
      });
      setNewAsset({
        name: "",
        type: "",
        base: "",
        openingBalance: "",
        closingBalance: ""
      });
      setShowAdd(false);
      const res = await API.get("/assets");
      setAssets(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Asset creation failed");
    }
  };

  const thStyle = {
    padding: "13px 16px",
    color: "#8889aa",
    fontWeight: 700,
    fontSize: 15,
    borderBottom: "2px solid #f0f1f7",
    textAlign: "left",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "14px 15px",
    color: "#222",
    fontWeight: 500,
    fontSize: 15,
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", padding: 38, fontFamily: "Inter, Segoe UI, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ color: "#181825", fontWeight: 800, fontSize: 28 }}>Assets</h2>
        <button
          onClick={() => setShowAdd(v => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#2d7df6",
            color: "#fff",
            borderRadius: 8,
            border: "none",
            fontWeight: 700,
            fontSize: 17,
            padding: "11px 18px",
            cursor: "pointer",
            boxShadow: "0 2px 8px #e2e8f0"
          }}
        >
          <span style={{ width: 23, height: 23, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#fff4", borderRadius: "50%", fontSize: 22 }}>
            +
          </span>
          Add Asset
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddAsset} style={{
          background: "#f7fafc",
          borderRadius: 12,
          boxShadow: "0 2px 12px #e8ebf0",
          marginBottom: 26,
          padding: "20px 28px",
          display: "flex",
          gap: 17,
          alignItems: "end"
        }}>
          <input name="name" placeholder="Asset Name" value={newAsset.name} onChange={handleAddChange} required style={{ padding: 11, border: "1.2px solid #d3d7cf", borderRadius: 6, fontSize: 15, width: 172 }} />
          <input name="type" placeholder="Type (e.g. Weapon, Vehicle)" value={newAsset.type} onChange={handleAddChange} required style={{ padding: 11, border: "1.2px solid #d3d7cf", borderRadius: 6, fontSize: 15, width: 180 }} />
          <input name="base" placeholder="Base" value={newAsset.base} onChange={handleAddChange} required style={{ padding: 11, border: "1.2px solid #d3d7cf", borderRadius: 6, fontSize: 15, width: 140 }} />
          <input name="openingBalance" type="number" min="0" placeholder="Opening" value={newAsset.openingBalance} onChange={handleAddChange} required style={{ padding: 11, border: "1.2px solid #d3d7cf", borderRadius: 6, fontSize: 15, width: 85 }} />
          <input name="closingBalance" type="number" min="0" placeholder="Closing" value={newAsset.closingBalance} onChange={handleAddChange} required style={{ padding: 11, border: "1.2px solid #d3d7cf", borderRadius: 6, fontSize: 15, width: 85 }} />
          <button type="submit" style={{
            background: "#2d7df6",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "11px 22px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 15,
            boxShadow: "0 2px 8px #e2e8f0",
            letterSpacing: 1
          }}>
            Add
          </button>
        </form>
      )}

      <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: 28 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px", fontSize: 16 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Base</th>
                <th style={thStyle}>Opening</th>
                <th style={thStyle}>Closing</th>
                <th style={thStyle}>Purchases</th>
                <th style={thStyle}>Transfer In</th>
                <th style={thStyle}>Transfer Out</th>
                <th style={thStyle}>Assigned</th>
                <th style={thStyle}>Expended</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr
                  key={asset._id}
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  <td style={tdStyle}>{asset.name}</td>
                  <td style={tdStyle}>{asset.type}</td>
                  <td style={tdStyle}>{asset.base}</td>
                  <td style={tdStyle}>{asset.openingBalance}</td>
                  <td style={tdStyle}>{asset.closingBalance}</td>
                  <td style={tdStyle}>{asset.purchases}</td>
                  <td style={tdStyle}>{asset.transferIn}</td>
                  <td style={tdStyle}>{asset.transferOut}</td>
                  <td style={tdStyle}>{asset.assigned}</td>
                  <td style={tdStyle}>{asset.expended}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "13px 16px",
  color: "#8889aa",
  fontWeight: 700,
  fontSize: 15,
  borderBottom: "2px solid #f0f1f7",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "14px 15px",
  color: "#222",
  fontWeight: 500,
  fontSize: 15,
  whiteSpace: "nowrap",
};

export default Assets;
