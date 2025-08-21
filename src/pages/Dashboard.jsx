import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [metrics, setMetrics] = useState({
    opening: 0,
    closing: 0,
    netMovement: 0,
    assigned: 0,
    expended: 0,
  });
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await API.get("/assets");
        setAssets(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    const opening = assets.reduce((acc, asset) => acc + (asset.openingBalance || 0), 0);
    const closing = assets.reduce((acc, asset) => acc + (asset.closingBalance || 0), 0);
    const netMovement = closing - opening;
    const assigned = assets.reduce((acc, asset) => acc + (asset.assigned || 0), 0);
    const expended = assets.reduce((acc, asset) => acc + (asset.expended || 0), 0);
    setMetrics({ opening, closing, netMovement, assigned, expended });
  }, [assets]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Placeholder chart (replace with chart library if needed)
  const ChartPlaceholder = ({ height = 180 }) => (
    <div style={{
      height,
      background: "linear-gradient(90deg,#e6eafc 60%,#f4f8fb 100%)",
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#b3b3c9",
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: 1
    }}>
      Chart Placeholder
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8fb", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: "#232946",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        minHeight: "100vh",
        boxShadow: "2px 0 8px #e2e8f0",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
      }}>
        <div style={{
          width: "100%",
          padding: "38px 0 24px 0",
          background: "#232946",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderBottom: "1px solid #3a3a4e"
        }}>
          <div style={{
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 2,
            color: "#fff",
            marginBottom: 18,
            background: "#393e6c",
            padding: "12px 0",
            width: "100%",
            textAlign: "center",
            borderTop: "2px solid #6B7267"
          }}>
            MILITARY
          </div>
        </div>
        <nav style={{ width: "100%", marginTop: 18 }}>
          <Link to="/dashboard" style={sidebarLinkStyle}>Dashboard</Link>
          <Link to="/purchases" style={sidebarLinkStyle}>Purchases</Link>
          <Link to="/transfers" style={sidebarLinkStyle}>Transfers</Link>
          <Link to="/assignments" style={sidebarLinkStyle}>Assignments</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: 240,
        padding: "36px 36px 36px 36px",
        minHeight: "100vh",
        background: "#f4f8fb",
        overflowY: "auto"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24
        }}>
          <div>
            <h2 style={{ color: "#232946", fontWeight: 700, fontSize: 32, margin: 0 }}>
              Dashboard
            </h2>
            <div style={{ color: "#6B7267", fontWeight: 500, fontSize: 18, marginTop: 4 }}>
              Welcome {name} <span style={{ color: "#4299e1", fontWeight: 400 }}>({role})</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "linear-gradient(90deg,#4299e1,#3182ce)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 32px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 17,
              boxShadow: "0 2px 8px #e2e8f0",
              transition: "background 0.2s",
            }}
          >
            Logout
          </button>
        </div>

        {/* Cards */}
        <div style={{
          display: "flex",
          gap: 24,
          marginBottom: 32,
          flexWrap: "wrap"
        }}>
          <div style={cardStyle}>
            <div style={{ color: "#6B7267", fontWeight: 600, fontSize: 16 }}>Opening Balance</div>
            <div style={{ color: "#232946", fontWeight: 800, fontSize: 28, marginTop: 8 }}>
              {metrics.opening}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ color: "#6B7267", fontWeight: 600, fontSize: 16 }}>Closing Balance</div>
            <div style={{ color: "#232946", fontWeight: 800, fontSize: 28, marginTop: 8 }}>
              {metrics.closing}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ color: "#6B7267", fontWeight: 600, fontSize: 16 }}>Net Movement</div>
            <div style={{ color: "#232946", fontWeight: 800, fontSize: 28, marginTop: 8 }}>
              {metrics.netMovement}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ color: "#6B7267", fontWeight: 600, fontSize: 16 }}>Assigned</div>
            <div style={{ color: "#232946", fontWeight: 800, fontSize: 28, marginTop: 8 }}>
              {metrics.assigned}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ color: "#6B7267", fontWeight: 600, fontSize: 16 }}>Expended</div>
            <div style={{ color: "#232946", fontWeight: 800, fontSize: 28, marginTop: 8 }}>
              {metrics.expended}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 320 }}>
            <div style={{ fontWeight: 600, color: "#232946", marginBottom: 10 }}>Earnings Overview</div>
            <ChartPlaceholder height={200} />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 600, color: "#232946", marginBottom: 10 }}>Revenue Sources</div>
            <ChartPlaceholder height={200} />
          </div>
        </div>

        {/* Assets Table */}
        <div style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 1px 4px #e2e8f0",
          padding: 24,
          marginBottom: 32
        }}>
          <h3 style={{ color: "#232946", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Assets</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 16,
              background: "#fff"
            }}>
              <thead>
                <tr style={{ background: "#f7fafc" }}>
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
                  <tr key={asset._id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                    <td style={tdStyle}>{asset.name}</td>
                    <td style={tdStyle}>{asset.type}</td>
                    <td style={tdStyle}>{asset.base}</td>
                    <td style={tdStyle}>{asset.openingBalance}</td>
                    <td style={tdStyle}>{asset.closingBalance}</td>
                    <td style={tdStyle}>{asset.purchases || 0}</td>
                    <td style={tdStyle}>{asset.transferIn || 0}</td>
                    <td style={tdStyle}>{asset.transferOut || 0}</td>
                    <td style={tdStyle}>{asset.assigned || 0}</td>
                    <td style={tdStyle}>{asset.expended || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const sidebarLinkStyle = {
  display: "block",
  width: "100%",
  padding: "18px 32px",
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: 18,
  border: "none",
  background: "none",
  borderRadius: 0,
  textAlign: "left",
  transition: "background 0.2s, color 0.2s",
  marginBottom: 2,
};

const cardStyle = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 1px 4px #e2e8f0",
  padding: "24px 32px",
  minWidth: 180,
  minHeight: 90,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  flex: "1 1 180px",
};

const thStyle = {
  padding: "10px 12px",
  color: "#232946",
  fontWeight: 700,
  fontSize: 15,
  borderBottom: "2px solid #e2e8f0",
  textAlign: "left",
  background: "#f7fafc"
};

const tdStyle = {
  padding: "10px 12px",
  color: "#232946",
  fontWeight: 500,
  fontSize: 15,
  background: "#fff"
};

export default Dashboard;

