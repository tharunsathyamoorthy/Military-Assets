import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function PurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [purchasesRes, assetsRes] = await Promise.all([API.get("/purchases"), API.get("/assets")]);
        setPurchases(purchasesRes.data);
        setAssets(assetsRes.data);
      } catch (error) {
        console.error("Failed to fetch purchase history", error);
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
          <h2>Purchase History</h2>
          <ul className="purchase-list">
            {purchases.length === 0 && <li>No purchases found.</li>}
            {purchases.map((p) => (
              <li key={p._id} className="purchase-item">
                {p.qty} of {getAssetName(p.asset_id)} at {p.base_name || p.base_id} on{" "}
                {p.date ? new Date(p.date).toLocaleDateString() : "-"}
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
          padding: 40px 20px 20px;
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
        .purchase-list {
          padding: 0;
          margin: 0;
          list-style: none;
          max-height: 400px;
          overflow-y: auto;
        }
        .purchase-item {
          background: #f7fafc;
          margin-bottom: 6px;
          padding: 10px 15px;
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
          .purchase-list {
            max-height: 300px;
          }
          .purchase-item {
            font-size: 0.9rem;
            padding: 8px 12px;
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

export default PurchaseHistory;
