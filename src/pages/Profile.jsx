import React, { useState, useEffect } from "react";
import API from "../services/api";

const fieldLabel = {
  name: "Full Name",
  nick: "Nick Name",
  gender: "Gender",
  country: "Country",
  language: "Language",
  timezone: "Time Zone",
  email: "Email",
};

const genderOptions = ["Male", "Female", "Other"];
const countryOptions = ["India", "USA", "UK", "Germany", "Other"];
const languageOptions = ["English", "Hindi", "Tamil", "French", "Other"];
const timezoneOptions = [
  "IST (UTC+5:30)",
  "GMT (UTC+0)",
  "CET (UTC+1)",
  "EST (UTC-5)",
  "Other"
];

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    nick: "",
    gender: "",
    country: "",
    language: "",
    timezone: "",
    email: "",
    imageUrl: "",
    base: "",
    role: "",
  });
  const [editing, setEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(res.data);
      } catch (error) {
        // fallback to localStorage if API fails
        setProfile((p) => ({
          ...p,
          name: localStorage.getItem("name") || "",
          email: localStorage.getItem("email") || "",
          base: localStorage.getItem("base") || "",
          role: localStorage.getItem("role") || "",
        }));
      }
    }
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files);
      setProfile((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(e.target.files),
      }));
    }
  };

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(profile).forEach((key) => {
        if (key !== "imageUrl") formData.append(key, profile[key]);
      });
      if (newImage) formData.append("profileImage", newImage);

      await API.put("/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully.");
      setEditing(false);
    } catch (error) {
      alert("Failed to update profile.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e5ebfa 0%, #fff6e6 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingTop: 46,
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 48px #e2e8f0",
        maxWidth: 900,
        width: "100%",
        padding: 40,
        margin: "0 16px",
      }}>
        {/* Welcome Header */}
        <div style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#324158" }}>
              Welcome, {profile.name || "User"}
            </div>
            <div style={{ fontSize: 15, color: "#9fa6b2", marginTop: 4 }}>
              {new Date().toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>
        {/* Card Area */}
        <div style={{
          background: "linear-gradient(120deg, #f5f8fa 40%, #fbeee7 100%)",
          borderRadius: 16,
          padding: "22px 35px 32px 35px",
          minHeight: 300,
          boxShadow: "0 1px 10px #e9edf3",
          display: "flex",
          flexDirection: "column",
          gap: 0
        }}>
          {/* Profile Image & Name */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            marginBottom: 12,
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2.5px solid #d0d3e3",
                background: "#e0e5ef"
              }}>
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <svg width="100%" height="100%" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="48" fill="#c8d2e3" />
                    <ellipse cx="48" cy="44" rx="25" ry="20" fill="#8a9fc6" />
                    <ellipse cx="48" cy="78" rx="25" ry="10" fill="#e0e8f4" />
                  </svg>
                )}
              </div>
              <div>
                <div style={{
                  fontWeight: 700, fontSize: 21, color: "#222d3d"
                }}>{profile.name || "Your Name"}</div>
                <div style={{
                  color: "#929fb5",
                  fontSize: 15,
                  marginTop: 2
                }}>{profile.email}</div>
              </div>
            </div>
            <button
              onClick={() => setEditing((v) => !v)}
              style={{
                background: "#4787f3",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                padding: "10px 26px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                marginLeft: "auto"
              }}
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>
          {/* Form Fields */}
          <form onSubmit={handleUpdate} style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px 32px",
            opacity: editing ? 1 : 0.55,
            pointerEvents: editing ? "auto" : "none",
            transition: "opacity 0.3s"
          }}>
            {/* left */}
            <div>
              <label className="profile-label">Full Name</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!editing}
                style={inputStyle}
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label className="profile-label">Nick Name</label>
              <input
                name="nick"
                value={profile.nick}
                onChange={handleChange}
                disabled={!editing}
                style={inputStyle}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="profile-label">Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                disabled={!editing}
                style={inputStyle}
              >
                <option value="">Select</option>
                {genderOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="profile-label">Country</label>
              <select
                name="country"
                value={profile.country}
                onChange={handleChange}
                disabled={!editing}
                style={inputStyle}
              >
                <option value="">Select</option>
                {countryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="profile-label">Language</label>
              <select
                name="language"
                value={profile.language}
                onChange={handleChange}
                disabled={!editing}
                style={inputStyle}
              >
                <option value="">Select</option>
                {languageOptions.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="profile-label">Time Zone</label>
              <select
                name="timezone"
                value={profile.timezone}
                onChange={handleChange}
                disabled={!editing}
                style={inputStyle}
              >
                <option value="">Select</option>
                {timezoneOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {/* Only show image upload in edit mode */}
            {editing && (
              <div style={{ gridColumn: "1 / 3" }}>
                <label className="profile-label">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={!editing}
                  style={{ ...inputStyle, padding: 6 }}
                />
              </div>
            )}
            {editing && (
              <div style={{ gridColumn: "1 / 3", textAlign: "right" }}>
                <button
                  type="submit"
                  style={{
                    background: "#4787f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "11px 36px",
                    fontWeight: 700,
                    fontSize: 17,
                    cursor: "pointer",
                    marginTop: 8
                  }}
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
          {/* Non-editable details if not editing */}
          {!editing && (
            <div style={{
              marginTop: 30,
              display: "block",
              fontSize: 15,
              color: "#7f869d"
            }}>
              <div><b>Base:</b> {profile.base || "N/A"}</div>
              <div><b>Role:</b> {profile.role || "N/A"}</div>
              <div style={{ marginTop: 26 }}>
                <b style={{ color: "#22223b" }}>My Email Address:</b>
                <div style={{
                  marginTop: 5,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "#f7fafc",
                  borderRadius: 8,
                  padding: "12px 10px"
                }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      background: "#4787f3",
                      color: "#fff",
                      borderRadius: "50%",
                      fontWeight: 700
                    }}
                  >@</span>
                  <span style={{ fontSize: 15, color: "#444", fontWeight: 600 }}>
                    {profile.email}
                  </span>
                  <span style={{ marginLeft: "auto", color: "#aaa", fontSize: 13 }}>Active</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 8,
  border: "1.3px solid #d5d8e3",
  fontSize: 16,
  outline: "none",
  background: "#f5f7fb",
  color: "#222",
  marginTop: 5,
  marginBottom: 2,
  transition: "border-color 0.2s"
};
