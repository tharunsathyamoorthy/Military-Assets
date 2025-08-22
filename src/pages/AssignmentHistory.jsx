import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AssignmentHistory() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const assignmentsRes = await API.get("/assignments");
        setHistory(assignmentsRes.data);
      } catch (error) {
        console.error("Failed to fetch assignment history", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f5f7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 40,
      }}
    >
      <div style={{
        background: "#fff",
        borderRadius: 18,
        padding: 36,
        width: 550,
        boxShadow: "0 8px 28px #e0e6f2"
      }}>
        <h2>Assignment History</h2>
        <ul style={{ listStyle: "none", padding: 0, maxHeight: 380, overflowY: "auto" }}>
          {history.length === 0 && <li>No assignments found.</li>}
          {history.map(assignment => (
            <li
              key={assignment._id}
              style={{
                padding: 10,
                marginBottom: 7,
                backgroundColor: "#f7fafb",
                borderRadius: 8,
              }}
            >
              {assignment.qty} of {assignment.asset_id?.name || assignment.asset_id} to {assignment.personnel} on{" "}
              {assignment.date ? new Date(assignment.date).toLocaleDateString() : "-"} ({assignment.status})
            </li>
          ))}
        </ul>
        <button
          style={{
            ...buttonStyle,
            width: 180,
            marginTop: 24
          }}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#232946",
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
  padding: "10px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  alignSelf: "center",
  letterSpacing: 1,
};

export default AssignmentHistory;
