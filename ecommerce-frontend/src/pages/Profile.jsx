// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getProfile, updateProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if not logged in (extra safety; route is also protected)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false); // for initial GET
  const [saving, setSaving] = useState(false); // for PUT
  const [error, setError] = useState(""); // error message
  const [success, setSuccess] = useState(""); // success message

  // Load profile on mount
  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await getProfile();
      console.log("Profile response:", res.data);

      // Backend shape: { success, data: { ...userProfileFields } }
      const body = res.data || {};
      const data = body.data || body;

      setProfile({
        email: data.email || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (err) {
      console.error("Error loading profile:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to load profile.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // We send only updatable fields (email usually not updated here)
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        address: profile.address,
      };

      const res = await updateProfile(payload);
      console.log("Update profile response:", res.data);

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Error updating profile:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h2 className="page-header-title">Profile</h2>
        </div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header-title">Profile</h2>
          <p className="page-header-subtitle">
            View and update your personal information.
          </p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: "520px" }}>
        <form onSubmit={handleSubmit}>
          {/* Email (read-only) */}
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={profile.email}
              disabled
            />
          </div>

          <div className="form-field">
            <label className="form-label">First Name</label>
            <input
              className="form-input"
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Last Name</label>
            <input
              className="form-input"
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Phone</label>
            <input
              className="form-input"
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Address</label>
            <input
              className="form-input"
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {success && (
            <p style={{ color: "#15803d", fontSize: "0.85rem" }}>{success}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ marginTop: "0.25rem" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
