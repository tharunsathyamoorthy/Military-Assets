import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function TransferHistory() {
  const [transfers, setTransfers] = useState([]);
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [transfersRes, assetsRes] = await Promise.all([
          API.get("/transfers"),
          API.get("/assets"),
        ]);
        setTransfers(transfersRes.data);
        setAssets(assetsRes.data);
      } catch (error) {
        console.error("Failed to fetch transfer history", error);
      }
    }
    fetchData();
  }, []);

  const getAssetName = (id) => {
    const asset = assets.find((a) => a._id === id);
    return asset ? `${asset.name} (${asset.type})` : id;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8fb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 40,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 36,
          width: 550,
          boxShadow: "0 8px 28px #e2e8f2",
        }}
      >
        <h2>Transfer History</h2>
        <ul style={{ padding: 0, listStyle: "none", maxHeight: 380, overflowY: "auto" }}>
          {transfers.length === 0 && <li>No transfers found.</li>}
          {transfers.map((t) => (
            <li
              key={t._id}
              style={{
                background: "#f7fafc",
                marginBottom: 6,
                padding: 10,
                borderRadius: 8,
                boxShadow: "0 1px 4px #e2e8f0",
                fontSize: 15,
              }}
            >
              {t.qty} of {getAssetName(t.asset_id)} from {t.from_base} to {t.to_base} on{" "}
              {t.date ? new Date(t.date).toLocaleDateString() : "-"}
            </li>
          ))}
        </ul>
        <button
          style={{
            backgroundColor: "#232946",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
            padding: "10px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            marginTop: 24,
            width: 180,
            alignSelf: "center",
            letterSpacing: 1,
          }}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default TransferHistory;
