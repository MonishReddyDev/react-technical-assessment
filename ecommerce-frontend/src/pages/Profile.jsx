// src/pages/Profile.jsx - Refactored with Material-UI and Address Fix
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getProfile, updateProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

// --- MUI Components ---
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
// ----------------------

const Profile = () => {
  const { isAuthenticated } = useAuth();

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

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load profile on mount
  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await getProfile();

      const body = res.data || {};
      const data = body.data || body;

      // *** FIX IMPLEMENTED HERE ***
      let addressValue = data.address || "";
      if (typeof data.address === "object" && data.address !== null) {
        // Convert the address object to a JSON string for display/editing
        addressValue = JSON.stringify(data.address);
      }
      // ****************************

      setProfile({
        email: data.email || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        address: addressValue,
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
      // Send the current string value of the address input back to the API
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        address: profile.address, // This is the string from the input
      };

      await updateProfile(payload);
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

  // --- RENDERING STATES ---

  const PageHeader = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Profile
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        View and update your personal information.
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <PageHeader />
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading profile...</Typography>
      </Box>
    );
  }

  // --- MAIN RENDER ---

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <PageHeader />

      <Paper
        elevation={2}
        sx={{
          maxWidth: 520,
          p: 4,
          borderRadius: 3,
          mx: { xs: 0, sm: "auto" },
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Email (read-only) */}
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={profile.email}
              disabled
              helperText="Email cannot be changed."
            />

            <TextField
              fullWidth
              label="First Name"
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Last Name"
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Phone"
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Address"
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              multiline
              rows={2}
              helperText="If the address contains structured data, edit the JSON string directly."
            />
          </Stack>

          {/* Feedback Messages */}
          <Box sx={{ mt: 3, mb: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </Box>

          {/* Save Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="green"
            size="large"
            disabled={saving}
            startIcon={saving ? null : <SaveIcon />}
            sx={{ borderRadius: 8, py: 1.5, mt: 1 }}
          >
            {saving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
