import React, { useEffect, useState } from "react";
import API from "../services/api";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [transfers, setTransfers] = useState([]);

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

        // Group purchases count by asset id
        const purchaseCounts = {};
        purchasesRes.data.forEach(p => {
          const assetId = p.asset_id?._id || p.asset_id;
          purchaseCounts[assetId] = (purchaseCounts[assetId] ?? 0) + Number(p.qty);
        });

        // Group transfer in/out counts by asset id
        const transferInCounts = {};
        const transferOutCounts = {};
        transfersRes.data.forEach(t => {
          const assetId = t.asset_id?._id || t.asset_id;
          transferInCounts[assetId] = (transferInCounts[assetId] ?? 0) + Number(t.qty);
          transferOutCounts[assetId] = (transferOutCounts[assetId] ?? 0) + Number(t.qty);
          // Depending on how you distinguish transfer in/out, adjust accordingly
          // For demonstration, counting all qty as both in and out may need correction
        });

        // Map assets and sum up counts
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

  const thStyle = {
    padding: "13px 16px",
    color: "#8889aa",
    fontWeight: 700,
    fontSize: 15,
    borderBottom: "2px solid #f0f1f7",
    textAlign: "left",
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
      <h2 style={{ color: "#181825", fontWeight: 800, fontSize: 28, marginBottom: 18 }}>Assets</h2>
      <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", padding: 28 }}>
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
              {assets.map(asset => (
                <tr key={asset._id} style={{
                  background: "#fff",
                  borderRadius: 14,
                  boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
                  cursor: "default"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
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

export default Assets;
