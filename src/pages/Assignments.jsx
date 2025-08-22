import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Assignments() {
  const [form, setForm] = useState({
    asset_id: "",
    personnel: "",
    qty: "",
    date: "",
    status: "Assigned",
  });
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await API.get("/assets");
        setAssets(res.data);
      } catch (error) {
        console.error("Failed to fetch assets", error);
      }
    }
    fetchAssets();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.asset_id) return alert("Please select an asset");
    if (!form.personnel.trim()) return alert("Please enter personnel");
    if (!form.qty || Number(form.qty) <= 0) return alert("Enter a valid quantity");
    if (!form.date) return alert("Please select a date");

    try {
      await API.post("/assignments", form);
      alert("Assignment recorded!");
      setForm({
        asset_id: "",
        personnel: "",
        qty: "",
        date: "",
        status: "Assigned",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    }
  };

  const gotoHistory = () => navigate("/assignment-history");

  return (
    <>
      <div className="page-container">
        <aside className="sidebar">
          <div className="icon-circle">
            <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
              <circle cx={26} cy={26} r={26} fill="#fff" />
              <ellipse cx={26} cy={25} rx={14} ry={13} fill="#232946" />
              <ellipse cx={26} cy={41} rx={14} ry={7} fill="#fff" />
            </svg>
          </div>
          <h1 className="page-title">Assign Equipment</h1>
          <p className="page-description">Assign or expend assets for your personnel.</p>
        </aside>

        <main className="main-content">
          <h2 className="heading">Assignments & Expenditures</h2>
          <form className="form" onSubmit={handleSubmit}>
            <select
              name="asset_id"
              value={form.asset_id}
              onChange={handleChange}
              required
              className="input"
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
              type="text"
              name="personnel"
              placeholder="Personnel"
              value={form.personnel}
              onChange={handleChange}
              required
              className="input"
            />

            <input
              type="number"
              name="qty"
              placeholder="Quantity"
              min={1}
              value={form.qty}
              onChange={handleChange}
              required
              className="input"
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="input"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >
              <option value="Assigned">Assigned</option>
              <option value="Expended">Expended</option>
            </select>

            <button type="submit" className="submit-button">
              Record Assignment
            </button>
          </form>

          <button className="history-button" onClick={gotoHistory}>
            View Assignment History
          </button>
        </main>
      </div>

      {/* Styles */}
      <style>{`
        .page-container {
          display: flex;
          gap: 20px;
          min-height: 100vh;
          padding: 20px;
          background: #f7fafc;
          box-sizing: border-box;
          justify-content: center;
        }
        .sidebar {
          width: 320px;
          background: #ffd600;
          border-radius: 24px 0 0 24px;
          padding: 36px 30px;
          box-shadow: 0 0 20px rgba(226, 230, 242, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #232946;
          text-align: center;
          user-select: none;
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
        .page-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .page-description {
          font-size: 16px;
          line-height: 1.4;
        }
        .main-content {
          flex-grow: 1;
          max-width: 600px;
          background: #fff;
          border-radius: 0 24px 24px 24px;
          padding: 40px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          height: 660px;
          overflow-y: auto;
        }
        .heading {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 14px;
          color: #2d3748;
          user-select: none;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-grow: 1;
        }
        .input {
          padding: 12px;
          font-size: 16px;
          border-radius: 6px;
          border: 1.5px solid #d1d7de;
          outline: none;
          transition: border-color 0.3s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 8px rgba(37, 99, 235, 0.5);
        }
        .submit-button {
          background: #2563eb;
          color: white;
          font-weight: 700;
          font-size: 18px;
          padding: 14px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          width: 160px;
          align-self: flex-end;
          user-select: none;
          transition: background-color 0.3s ease;
          margin-top: 10px;
        }
        .submit-button:hover {
          background: #1e43c4;
        }
        .history-button {
          background: #232946;
          color: white;
          font-weight: 700;
          font-size: 18px;
          padding: 14px 0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          width: 220px;
          margin: 25px auto 0;
          user-select: none;
          transition: background-color 0.3s ease;
        }
        .history-button:hover {
          background: #1a1e3a;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .page-container {
            flex-direction: column;
            padding: 20px 15px;
          }
          .sidebar,
          .main-content {
            width: 100%;
            max-width: none;
            border-radius: 20px;
            padding: 30px 24px;
            height: auto;
          }
          .submit-button,
          .history-button {
            width: 100%;
            align-self: stretch;
          }
          .history-button {
            margin: 20px 0 0;
          }
        }
      `}</style>
    </>
  );
}

export default Assignments;
