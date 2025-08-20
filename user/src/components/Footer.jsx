import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "secondary.main",
        color: "common.white",
        py: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 6 },
        textAlign: "center",
        fontWeight: 500,
        fontSize: { xs: "0.875rem", sm: "1rem" },
        boxShadow: `0 -2px 6px ${theme.palette.secondary.dark}80`,
        userSelect: "none",
      }}
    >
      <Typography component="p" variant="body2" sx={{ userSelect: "none" }}>
        © 2025 MultiCvero. All rights reserved.
      </Typography>
    </Box>
  );
}
