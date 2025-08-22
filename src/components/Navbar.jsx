import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaHome, FaShoppingCart, FaExchangeAlt, FaClipboardList, FaBoxes } from "react-icons/fa";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const userName = localStorage.getItem("name");
  const userRole = localStorage.getItem("role");

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        ☰
      </button>
      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div style={{ display: "flex", minHeight: "100vh", background: "#F6F8FC" }}>
        {/* Sidebar */}
        <aside
          className={`sidebar ${sidebarOpen ? "open" : ""}`}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
          <div style={{ padding: "32px 0 0 0", textAlign: "center" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginLeft: 25,
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  background: "#ffcc2d",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <circle cx="11" cy="11" r="11" fill="#ffcc2d" />
                  <polygon points="11,3.4 12.7,8.9 18,8.9 13.6,12.3 15.2,17.5 11,14.6 6.8,17.5 8.4,12.3 4,8.9 9.3,8.9" fill="#fff" />
                </svg>
              </span>
              <span style={{ fontWeight: 800, fontSize: 23, color: "#18181b", letterSpacing: 2 }}>
                Military
              </span>
            </span>
            <div style={{ margin: "36px 0 0 0" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "#E3E3E3",
                  borderRadius: "50%",
                  margin: "0 auto",
                }}
              />
              <div style={{ marginTop: 14, fontWeight: 700, color: "#333", fontSize: 19 }}>
                {userName || "--"}
              </div>
              <div style={{ fontSize: 14, color: "#a6a8ad" }}>
                {userRole || "--"}
              </div>
            </div>
          </div>
          <nav style={{ marginTop: 32 }}>
            <SidebarLink icon={<FaHome />} to="/dashboard" selected={location.pathname === "/dashboard"}>
              Dashboard
            </SidebarLink>
            <SidebarLink icon={<FaShoppingCart />} to="/purchases" selected={location.pathname === "/purchases"}>
              Purchases
            </SidebarLink>
            <SidebarLink icon={<FaExchangeAlt />} to="/transfers" selected={location.pathname === "/transfers"}>
              Transfers
            </SidebarLink>
            <SidebarLink icon={<FaClipboardList />} to="/assignments" selected={location.pathname === "/assignments"}>
              Assignments
            </SidebarLink>
            <SidebarLink icon={<FaBoxes />} to="/assets" selected={location.pathname === "/assets"}>
              Assets
            </SidebarLink>
          </nav>
        </aside>
        {/* Main content */}
        <main style={{ flex: 1, minHeight: "100vh", background: "#F6F8FC", overflow: "auto" }}>
          <Outlet />
        </main>
      </div>
      {/* Responsive Sidebar CSS */}
      <style>{`
        .sidebar {
          width: 260px;
          background: #fff;
          box-shadow: 2px 0 10px #F0F1F5;
          border-top-right-radius: 32px;
          height: 100vh;
          overflow-y: auto;
          position: sticky;
          top: 0;
          left: 0;
          z-index: 100;
          transition: transform 0.3s;
        }
        .sidebar-close {
          display: none;
        }
        .hamburger {
          display: none;
        }
        .sidebar-overlay {
          display: none;
        }
        @media (max-width: 800px) {
          .sidebar {
            position: fixed;
            top: 0; left: 0;
            height: 100vh;
            transform: translateX(-105%);
            z-index: 1100;
          }
          .sidebar.open {
            transform: translateX(0);
            box-shadow: 2px 0 32px #8888;
          }
          .sidebar-close {
            display: block;
            background: none;
            border: none;
            font-size: 32px;
            position: absolute;
            right: 18px;
            top: 22px;
            z-index: 1120;
            color: #aaa;
            cursor: pointer;
          }
          .hamburger {
            display: block;
            position: fixed;
            top: 14px;
            left: 14px;
            z-index: 2000;
            background: #ffcc2d;
            border: none;
            border-radius: 6px;
            font-size: 30px;
            width: 48px;
            height: 48px;
            color: #222;
          }
          .sidebar-overlay {
            display: block;
            position: fixed;
            top: 0; left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.18);
            z-index: 1080;
          }
        }
      `}</style>
    </>
  );
}

function SidebarLink({ icon, to, selected, children }) {
  return (
    <Link
      to={to}
      style={{
        display: "flex",
        alignItems: "center",
        fontWeight: selected ? 700 : 500,
        fontSize: 18,
        gap: 16,
        color: selected ? "#22223b" : "#747484",
        background: selected ? "#FFFAE6" : "transparent",
        padding: "14px 40px 14px 36px",
        textDecoration: "none",
        borderRight: selected ? "5px solid #FFD600" : "none",
        borderRadius: "0 24px 24px 0",
        transition: "background 0.2s,color 0.2s",
      }}
    >
      <span style={{ fontSize: 23 }}>{icon}</span> {children}
    </Link>
  );
}
