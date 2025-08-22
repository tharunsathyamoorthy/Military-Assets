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
    <>
      <div className="container">
        <div className="panel">
          <h2>Transfer History</h2>
          <ul className="transfer-list">
            {transfers.length === 0 && <li>No transfers found.</li>}
            {transfers.map((t) => (
              <li key={t._id} className="transfer-item">
                {t.qty} of {getAssetName(t.asset_id)} from {t.from_base} to {t.to_base} on{" "}
                {t.date ? new Date(t.date).toLocaleDateString() : "-"}
              </li>
            ))}
          </ul>
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      <style>{`
        .container {
          min-height: 100vh;
          background: #f4f8fb;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 40px 16px 20px 16px;
          box-sizing: border-box;
        }
        .panel {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 8px 28px #e2e8f2;
          width: 550px;
          max-width: 100%;
          padding: 36px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        h2 {
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 20px;
          color: #2d3748;
          user-select: none;
        }
        .transfer-list {
          padding: 0;
          list-style: none;
          max-height: 380px;
          overflow-y: auto;
          margin: 0;
        }
        .transfer-item {
          background: #f7fafc;
          margin-bottom: 6px;
          padding: 12px 16px;
          border-radius: 8px;
          box-shadow: 0 1px 4px #e2e8f0;
          font-size: 1rem;
        }
        .back-button {
          margin-top: 24px;
          width: 180px;
          align-self: center;
          background-color: #232946;
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
          padding: 10px 0;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          letter-spacing: 1px;
          transition: background-color 0.3s ease;
          user-select: none;
        }
        .back-button:hover {
          background-color: #1c243d;
        }

        /* Responsive styles */
        @media (max-width: 600px) {
          .container {
            padding: 20px 12px;
          }
          .panel {
            width: 100%;
            padding: 24px 20px;
          }
          h2 {
            font-size: 1.5rem;
            margin-bottom: 16px;
          }
          .transfer-list {
            max-height: 300px;
          }
          .transfer-item {
            font-size: 0.9rem;
            padding: 10px 12px;
          }
          .back-button {
            width: 100%;
            font-size: 1.1rem;
            padding: 12px 0;
          }
        }
      `}</style>
    </>
  );
}

export default TransferHistory;
