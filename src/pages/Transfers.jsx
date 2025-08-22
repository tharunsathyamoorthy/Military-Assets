import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Transfers() {
  const [form, setForm] = useState({
    asset_id: "",
    from_base: "",
    to_base: "",
    qty: "",
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

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await API.post("/transfers", form);
      alert("Transfer successful!");
      setForm({ asset_id: "", from_base: "", to_base: "", qty: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Transfer failed");
    }
  };

  const gotoHistory = () => navigate("/transfer-history");

  return (
    <>
      <div className="container">
        <div className="left-panel">
          <div className="icon-circle">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="26" fill="#fff" />
              <ellipse cx="26" cy="25" rx="14" ry="13" fill="#232946" />
              <ellipse cx="26" cy="41" rx="14" ry="7" fill="#fff" />
            </svg>
          </div>
          <h1 className="title">Register Transfer</h1>
          <p className="desc">Quickly record transfers<br />of assets between bases.</p>
        </div>
        <div className="right-panel">
          <h2 className="heading">Asset Transfers</h2>
          <form className="form" onSubmit={handleTransfer}>
            <select
              name="asset_id"
              value={form.asset_id}
              onChange={handleChange}
              required
              className="input"
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
              className="input"
            />
            <input
              name="to_base"
              placeholder="To Base"
              value={form.to_base}
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
            <button type="submit" className="button">
              Transfer
            </button>
          </form>
          <button onClick={gotoHistory} className="history-button">
            View Transfer History
          </button>
        </div>
      </div>

      <style>{`
        .container {
          min-height: 100vh;
          background: #f4f8fb;
          display: flex;
          justify-content: center;
          padding: 20px;
          gap: 20px;
        }
        .left-panel {
          background: #ffd600;
          width: 320px;
          border-radius: 24px 0 0 24px;
          box-shadow: 0 8px 40px #e0e6f2;
          padding: 36px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .icon-circle {
          width: 98px;
          height: 98px;
          border-radius: 50%;
          background-color: #ffa726;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
        }
        .title {
          font-size: 28px;
          font-weight: 900;
          color: #232946;
          margin-bottom: 12px;
          text-align: center;
          user-select: none;
        }
        .desc {
          font-size: 16px;
          color: #232946cc;
          text-align: center;
          user-select: none;
        }
        .right-panel {
          background: #fff;
          border-radius: 0 24px 24px 0;
          box-shadow: 0 8px 40px #e0e6f2;
          padding: 30px 40px;
          flex-grow: 1;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          height: 550px;
          box-sizing: border-box;
        }
        .heading {
          font-size: 28px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 20px;
          user-select: none;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .input {
          padding: 12px;
          border-radius: 6px;
          border: 1.5px solid #d1d7de;
          font-size: 16px;
          outline: none;
          background: #fff;
          box-shadow: 0 1px 4px #f1f3f5;
          transition: border-color 0.25s;
        }
        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 8px #2563eb66;
        }
        .button {
          margin-top: 14px;
          background: #47523e;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          border: none;
          border-radius: 6px;
          padding: 12px 0;
          cursor: pointer;
          box-shadow: 0 2px 8px #3e4b37aa;
          align-self: flex-end;
          width: 130px;
          transition: background-color 0.3s;
        }
        .button:hover {
          background: #3e4b37;
        }
        .history-button {
          margin: 24px auto 0 auto;
          background: #232946;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          border: none;
          border-radius: 6px;
          padding: 12px 0;
          cursor: pointer;
          width: 200px;
          transition: background-color 0.3s;
        }
        .history-button:hover {
          background: #1b224a;
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
            padding: 15px;
          }
          .left-panel {
            width: 100%;
            border-radius: 20px 20px 0 0;
            padding: 24px;
            height: auto;
          }
          .right-panel {
            max-width: 100%;
            height: auto;
            border-radius: 0 0 20px 20px;
            padding: 20px;
          }
          .button {
            width: 100%;
            margin-top: 18px;
          }
          .history-button {
            width: 100%;
            margin: 20px 0 0 0;
          }
          .form {
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
}

export default Transfers;
