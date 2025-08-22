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

function useSafeNumber(value) {
  const num = Number(value);
  return isFinite(num) ? num : 0;
}

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
          purchases: useSafeNumber(asset.purchases),
          transferIn: useSafeNumber(asset.transferIn),
          transferOut: useSafeNumber(asset.transferOut),
          assigned: useSafeNumber(asset.assigned),
          expended: useSafeNumber(asset.expended),
          openingBalance: useSafeNumber(asset.openingBalance),
          closingBalance: useSafeNumber(asset.closingBalance),
        }));
        setAssets(assetsWithDefaults);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    if (assets.length === 0) {
      setMetrics({ opening: 0, closing: 0, netMovement: 0, assigned: 0, expended: 0 });
      return;
    }
    const opening = assets.reduce((acc, asset) => acc + asset.openingBalance, 0);
    const closing = assets.reduce((acc, asset) => acc + asset.closingBalance, 0);
    const netMovement = closing - opening;
    const assigned = assets.reduce((acc, asset) => acc + asset.assigned, 0);
    const expended = assets.reduce((acc, asset) => acc + asset.expended, 0);
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

  const StatCard = ({ label, value, color }) => {
    const [hover, setHover] = useState(false);
    const animatedValue = useCountUp(value);

    // For Net Movement: always show positive, color red if negative
    const showValue =
      label === "Net Movement" ? Math.abs(animatedValue) : animatedValue;
    const showColor =
      label === "Net Movement" && value < 0 ? "#ef4444" : "#222";

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
        <span style={{ color: "#888aa0", fontWeight: 700, fontSize: 15 }}>
          {label}
        </span>
        <span
          style={{
            fontWeight: 900,
            color: showColor,
            fontSize: 44,
            margin: "12px 0 0",
            letterSpacing: "0.1em",
            lineHeight: 1,
          }}
        >
          {showValue}
        </span>
        <span
          style={{
            marginTop: 16,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
          }}
        />
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
            ? "0 8px 30px rgba(59, 130, 246, 0.2)"
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
        <div style={{ fontWeight: 800, fontSize: 18, color: "#222" }}>
          {asset.name}
        </div>
        <div style={{ fontSize: 13, color: "#888" }}>
          {asset.base}
        </div>
        <div style={{ display: "flex", gap: 10, fontSize: 12, marginTop: 8 }}>
          <span>Open: {asset.openingBalance}</span>
          <span>|</span>
          <span>Close: {asset.closingBalance}</span>
        </div>
        <button
          aria-label="Delete"
          onClick={() => onDelete(asset._id)}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <rect x="5" y="8" width="10" height="7" rx="2" fill="#ef4444" />
            <rect x="9" y="3" width="2" height="2" rx="1" fill="#ef4444" />
            <path d="M7 6h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    );
  };

  // Data preparation for charts
  const assetActivityData = assets.map(a => ({
    name: a.name,
    value: a.openingBalance + a.closingBalance,
  }));

  const categoryData = assets.reduce((acc, asset) => {
    const category = asset.type || "Other";
    const found = acc.find(item => item.name === category);
    if (found) {
      found.value += 1;
    } else {
      acc.push({ name: category, value: 1 });
    }
    return acc;
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter', sans-serif" }}>
      <main style={{ padding: "2rem 3rem" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#2d3748" }}>Dashboard</h2>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.8rem 2.3rem",
              fontSize: "1.25rem",
              color: "#fff",
              background: "linear-gradient(90deg,#3b82f6,#6366f1)",
              border: "none",
              borderRadius: "0.75rem",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(67,56,202,0.5)"
            }}
          >
            Logout
          </button>
        </header>

        <section style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          <StatCard label="Opening Balance" value={metrics.opening} color="#3b82f6" />
          <StatCard label="Closing Balance" value={metrics.closing} color="#f59e0b" />
          <StatCard label="Net Movement" value={metrics.netMovement} color={metrics.netMovement < 0 ? "#ef4444" : "#22c55e"} />
          <StatCard label="Assigned" value={metrics.assigned} color="#ef4444" />
          <StatCard label="Expended" value={metrics.expended} color="#8b5cf6" />
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a202c", marginBottom: "1rem" }}>Popular Assets</h3>
          <div style={{ overflowX: "auto", paddingBottom: "1rem", display: "flex", gap: "1rem" }}>
            {assets.slice(0, 10).map(asset => (
              <AssetCard key={asset._id} asset={asset} onDelete={handleDelete} />
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "2rem" }}>
          <div style={{ background: "#fff", borderRadius: "1rem", padding: "1.5rem" }}>
            <h4 style={{ fontWeight: 700, color: "#2d3748", marginBottom: "1rem" }}>Asset Activity</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={assetActivityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6B7280" radius={[10,10,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "#fff", borderRadius: "1rem", padding: "1.5rem" }}>
            <h4 style={{ fontWeight: 700, color: "#2d3748", marginBottom: "1rem" }}>Asset Categories</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={70} label>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "#fff", borderRadius: "1rem", padding: "1.5rem", textAlign: "center" }}>
            <h4 style={{ fontWeight: 700, color: "#2d3748", marginBottom: "1rem" }}>Total Assets</h4>
            <p style={{ fontSize: "3rem", fontWeight: 900, color: "#2563eb" }}>{assets.length}</p>
            <p style={{ fontSize: "1rem", color: "#718096" }}>Tracked Items</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
