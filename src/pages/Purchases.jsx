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
    const fetchAssets = async () => {
      try {
        const res = await API.get("/assets");
        setAssets(res.data);
      } catch (error) {
        console.error("Failed to fetch assets", error);
      }
    };
    fetchAssets();
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

  const gotoHistory = () => navigate("/purchase-history");

  return (
    <>
      <div className="container">
        <aside className="left-panel">
          <div className="icon-circle">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="26" fill="#fff" />
              <ellipse cx="26" cy="25" rx="14" ry="13" fill="#232946" />
              <ellipse cx="26" cy="41" rx="14" ry="7" fill="#fff" />
            </svg>
          </div>
          <h2 className="title">Add Purchases</h2>
          <p className="description">
            It should only take a couple of minutes<br />to record your asset purchases.
          </p>
        </aside>

        <main className="right-panel">
          <h2 className="heading">Asset Purchases</h2>
          <form onSubmit={handlePurchase} className="form">
            <select
              name="asset_id"
              value={form.asset_id}
              onChange={handleChange}
              required
              className="input"
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
              className="input"
            />
            <input
              name="qty"
              type="number"
              placeholder="Quantity"
              value={form.qty}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="input"
            />
            <button type="submit" className="submit-btn">Record Purchase</button>
          </form>

          <button onClick={gotoHistory} className="history-btn">
            View Purchase History
          </button>
        </main>
      </div>

      <style>{`
        .container {
          min-height: 100vh;
          background: #f4f8fb;
          display: flex;
          justify-content: center;
          gap: 20px;
          padding: 20px;
        }

        .left-panel {
          background-color: #ffd600;
          width: 320px;
          border-radius: 24px 0 0 24px;
          box-shadow: 0 0 20px rgba(226, 230, 240, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px 30px;
          color: #232946;
          text-align: center;
        }

        .icon-circle {
          width: 98px;
          height: 98px;
          background: #ffa726;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
        }

        .title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 15px;
          user-select: none;
        }

        .description {
          font-size: 15px;
          line-height: 1.4;
          user-select: none;
        }

        .right-panel {
          background: #fff;
          width: 100%;
          max-width: 540px;
          border-radius: 0 24px 24px 0;
          box-shadow: 0 0 20px rgba(226, 230, 240, 0.6);
          padding: 30px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: auto;
          height: 620px;
        }

        .heading {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #2d3748;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .input {
          width: 100%;
          padding: 10px;
          border: 1.3px solid #d1d6db;
          border-radius: 6px;
          background-color: #fff;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .input:focus {
          border-color: #2563eb;
          outline: none;
          box-shadow: 0 0 8px rgba(37, 99, 235, 0.5);
        }

        .submit-btn {
          width: 130px;
          padding: 12px 0;
          border: none;
          border-radius: 6px;
          background-color: #6b7267;
          color: #fff;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          margin-top: 10px;
          align-self: flex-end;
          box-shadow: 0 4px 8px rgba(107, 114, 103, 0.5);
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #565a53;
        }

        .history-btn {
          width: 180px;
          margin: 30px auto 0 auto;
          padding: 12px 0;
          border: none;
          border-radius: 6px;
          background-color: #232946;
          color: #fff;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(35, 41, 70, 0.5);
          transition: background-color 0.3s ease;
        }

        .history-btn:hover {
          background-color: #1b203f;
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
            padding: 10px;
          }

          .left-panel {
            width: 100%;
            border-radius: 20px 20px 0 0;
            padding: 24px 20px;
            height: auto;
          }

          .right-panel {
            width: 100%;
            max-width: none;
            border-radius: 0 0 20px 20px;
            padding: 20px;
            height: auto;
          }

          .submit-btn, .history-btn {
            width: 100%;
            align-self: stretch;
          }

          .submit-btn {
            margin-top: 20px;
          }

          .history-btn {
            margin: 20px 0 0 0;
          }
        }
      `}</style>
    </>
  );
}

export default Purchases;
