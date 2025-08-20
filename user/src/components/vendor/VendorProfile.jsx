import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Stack,
  Chip,
  useTheme,
  CircularProgress,
  Badge,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import InfoIcon from "@mui/icons-material/Info";
import VerifiedIcon from "@mui/icons-material/Verified";

export default function VendorProfile() {
  const [profile, setProfile] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch {
        setProfile(null);
      }
    }
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <CircularProgress color="primary" />
        <Typography sx={{ ml: 2, color: theme.palette.text.secondary }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={8}
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: 4,
        mt: 6,
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        borderLeft: `6px solid ${theme.palette.primary.dark}`,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        fontWeight="700"
        color={theme.palette.primary.dark}
        gutterBottom
        sx={{ mb: 6, letterSpacing: 2 }}
      >
        Your Vendor Profile
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* Profile Image or User Icon */}
        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              profile.vendorStatus === "approved" ? (
                <VerifiedIcon
                  sx={{
                    bgcolor: theme.palette.primary.dark,
                    borderRadius: "50%",
                    color: "#fff",
                    p: 0.5,
                    fontSize: 30,
                    boxShadow: theme.shadows[3],
                  }}
                />
              ) : null
            }
          >
            <Avatar
              alt={profile.name}
              src={profile.profileImage || ""}
              sx={{
                width: 160,
                height: 160,
                mx: "auto",
                mb: 2,
                boxShadow: theme.shadows[4],
                bgcolor: profile.profileImage ? "transparent" : theme.palette.primary.dark,
                color: profile.profileImage ? "inherit" : "#fff",
                fontSize: 64,
              }}
            >
              {!profile.profileImage && (
                <PersonIcon fontSize="inherit" />
              )}
            </Avatar>
          </Badge>
          <Typography
            variant="h5"
            color={theme.palette.primary.dark}
            fontWeight="700"
            mt={1}
            mb={0.5}
          >
            {profile.name}
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            Member Since: {new Date(profile.createdAt).toLocaleDateString()}
          </Typography>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <ProfileField icon={<PersonIcon htmlColor={theme.palette.primary.dark} />} label="Name" value={profile.name} />
            <ProfileField icon={<BusinessIcon htmlColor={theme.palette.primary.dark} />} label="Business Name" value={profile.businessName} />
            <ProfileField icon={<EmailIcon htmlColor={theme.palette.primary.dark} />} label="Email" value={profile.email} />
            <ProfileField icon={<PhoneIcon htmlColor={theme.palette.primary.dark} />} label="Phone" value={profile.phone || "Optional"} />
            <ProfileField
              icon={<VerifiedIcon htmlColor={theme.palette.primary.dark} />}
              label="Status"
              value={<StatusBadge status={profile.vendorStatus} />}
            />
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

const ProfileField = ({ icon, label, value }) => (
  <Stack
    direction="row"
    spacing={3}
    alignItems="center"
    sx={{
      p: 2,
      mb: 3,
      borderRadius: 2,
      bgcolor: "background.default",
      boxShadow: 1,
      border: (theme) => `1px solid ${theme.palette.divider}`,
    }}
  >
    <Avatar sx={{ bgcolor: "transparent", width: 56, height: 56 }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom fontWeight="medium">
        {label}
      </Typography>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography variant="h6" fontWeight="700" color="text.primary" sx={{ mt: 0.5 }}>
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  </Stack>
);

const StatusBadge = ({ status }) => {
  let color = "default";
  let label = "Unknown";

  if (status) {
    label = status.charAt(0).toUpperCase() + status.slice(1);
    if (status === "approved") color = "success";
    else if (status === "pending") color = "warning";
    else if (status === "rejected") color = "error";
  }

  return <Chip label={label} color={color} variant="filled" sx={{ fontWeight: 700 }} />;
};
