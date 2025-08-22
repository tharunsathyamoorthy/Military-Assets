import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6B7267", "#ffc658", "#a3e635", "#38bdf8"];

// Count-up animation hook (duration in ms, default 6000ms)
function useCountUp(target, duration = 6000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    let startTs;
    let raf;
    if (target === 0) {
      setCount(0);
      return;
    }
    function animate(ts) {
      if (!startTs) startTs = ts;
      let progress = Math.min(1, (ts - startTs) / duration);
      setCount(Math.floor(progress * (target - start) + start));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    }
    raf = requestAnimationFrame(animate);
    // Cleanup
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

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

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await API.get("/assets");
        const assetsWithDefaults = res.data.map((asset) => ({
          ...asset,
          purchases: asset.purchases ?? 0,
          transferIn: asset.transferIn ?? 0,
          transferOut: asset.transferOut ?? 0,
          assigned: asset.assigned ?? 0,
          expended: asset.expended ?? 0,
        }));
        setAssets(assetsWithDefaults);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    const opening = assets.reduce(
      (acc, asset) => acc + (asset.openingBalance || 0),
      0
    );
    const closing = assets.reduce(
      (acc, asset) => acc + (asset.closingBalance || 0),
      0
    );
    const netMovement = closing - opening;
    const assigned = assets.reduce(
      (acc, asset) => acc + (asset.assigned || 0),
      0
    );
    const expended = assets.reduce(
      (acc, asset) => acc + (asset.expended || 0),
      0
    );
    setMetrics({ opening, closing, netMovement, assigned, expended });
  }, [assets]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      await API.delete(`/assets/${id}`);
      setAssets((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert("Failed to delete asset.");
    }
  };

  // Animated Stat Card
  const StatCard = ({ label, value, color }) => {
    const [hover, setHover] = useState(false);
    const animatedValue = useCountUp(value, 6000);

    return (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: hover
            ? "0 8px 30px rgba(59, 130, 246, 0.2)"
            : "0 2px 12px rgba(59, 130, 246, 0.06)",
          padding: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          minWidth: 180,
          flexGrow: 1,
          cursor: "pointer",
          transform: hover ? "translateY(-8px)" : "translateY(0)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <span style={{ color: "#a1a1aa", fontWeight: 700, fontSize: 15 }}>
          {label}
        </span>
        <span
          style={{
            fontWeight: 800,
            color: "#18181b",
            fontSize: 44,
            margin: "16px 0 0",
            letterSpacing: "1px",
            lineHeight: 1,
          }}
        >
          {label === "Net Movement" && animatedValue > 0 ? "+" : ""}
          {animatedValue}
        </span>
        <span
          style={{
            marginTop: 16,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
          }}
        ></span>
      </div>
    );
  };

  const AssetCard = ({ asset, onDelete }) => {
    const [hover, setHover] = useState(false);
    return (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "#f8fafc",
          borderRadius: 18,
          boxShadow: hover
            ? "0 8px 30px rgba(59,130,246,0.2)"
            : "0 2px 12px rgba(59, 130, 246, 0.06)",
          padding: 22,
          marginRight: 16,
          width: 210,
          display: "inline-block",
          verticalAlign: "top",
          position: "relative",
          cursor: "pointer",
          transform: hover ? "translateY(-8px)" : "translateY(0)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <div style={{ fontWeight: 600, color: "#22c55e", fontSize: 13, marginBottom: 8 }}>
          {asset.type}
        </div>
        <div style={{ fontWeight: 800, fontSize: 18, color: "#22223b", marginBottom: 3 }}>
          {asset.name}
        </div>
        <div style={{ fontSize: 13, color: "#a3a3a3" }}>{asset.base}</div>
        <div style={{ display: "flex", gap: 10, fontSize: 12, marginTop: 8 }}>
          <span>Open: {asset.openingBalance}</span>
          <span>|</span>
          <span>Close: {asset.closingBalance}</span>
        </div>
        {/* Delete icon */}
        <button
          aria-label="Delete"
          onClick={() => onDelete(asset._id)}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <rect x="5" y="8" width="10" height="7" rx="2" fill="#e53e3e" />
            <rect x="9" y="3" width="2" height="2" rx="1" fill="#e53e3e" />
            <path d="M7 6h6" stroke="#e53e3e" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    );
  };

  // Bar chart for Asset Activity
  const AssetBarChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#6B7267" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  // Pie chart for Asset Categories
  const AssetPieChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={140}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={50} fill="#6B7267" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const assetActivityData = assets.slice(0, 5).map((a) => ({
    name: a.name,
    value: a.openingBalance + a.closingBalance,
  }));

  const categoryData = assets.reduce((acc, asset) => {
    const category = asset.type || "Other";
    const found = acc.find((item) => item.name === category);
    if (found) {
      found.value += 1;
    } else {
      acc.push({ name: category, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        flex: 1,
        fontFamily: "Inter, Segoe UI, sans-serif",
      }}
    >
      <main style={{ padding: "38px 44px 0", minWidth: 0 }}>
        <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ color: "#181825", fontWeight: 800, fontSize: 38, margin: 0, letterSpacing: 1.2 }}>
              Dashboard
            </h2>
            <div style={{ color: "#adb5bd", marginTop: 4, fontWeight: 500, fontSize: 18 }}>
              Welcome to Military Modern Admin Dashboard
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "linear-gradient(90deg,#3b82f6,#818cf8)",
              color: "#fff",
              border: "none",
              borderRadius: 17,
              padding: "17px 44px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: 2,
              boxShadow: "0 3px 20px rgba(59, 130, 246, 0.16)",
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 36, margin: "36px 0 38px" }}>
          <StatCard label="Opening Balance" value={metrics.opening} color="#60a5fa" />
          <StatCard label="Closing Balance" value={metrics.closing} color="#fbbf24" />
          <StatCard label="Net Movement" value={metrics.netMovement} color="#22c55e" />
          <StatCard label="Assigned" value={metrics.assigned} color="#f43f5e" />
          <StatCard label="Expended" value={metrics.expended} color="#8b5cf6" />
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: "#181825", margin: "0 0 14px 5px" }}>
            Popular Assets
          </div>
          <div style={{ display: "flex", overflowX: "auto", gap: 14, paddingBottom: 12 }}>
            {assets.slice(0, 5).map((asset) => (
              <AssetCard asset={asset} key={asset._id} onDelete={handleDelete} />
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 26, marginBottom: 36 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              padding: 22,
            }}
          >
            <div style={{ fontWeight: 800, color: "#22223b", marginBottom: 10 }}>Asset Activity</div>
            <AssetBarChart data={assetActivityData} />
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              padding: 22,
            }}
          >
            <div style={{ fontWeight: 800, color: "#22223b", marginBottom: 10 }}>Asset Categories</div>
            <AssetPieChart data={categoryData} />
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              padding: 22,
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: 800, color: "#22223b", marginBottom: 12 }}>Total Assets</div>
            <span style={{ fontWeight: 900, fontSize: 35, color: "#2563eb" }}>{assets.length}</span>
            <div style={{ fontSize: 13, color: "#a3a3a3", marginTop: 8 }}>Tracked Items</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
