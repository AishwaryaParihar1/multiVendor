import React from "react";
import { Box, Typography, Container, Button, useTheme } from "@mui/material";

export default function HomeMiddleSection() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "30vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.background.default,
        overflow: "hidden",
        px: 2,
        py: { xs: 8, md: 12 },
      }}
    >
      {/* Gradient Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}1A, ${theme.palette.accent?.main || theme.palette.secondary.main}1A, ${theme.palette.secondary.main}1A)`,
          zIndex: 0,
        }}
      />

      {/* Content Container */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 900,
            color: theme.palette.primary.main,
            mb: 3,
            fontSize: { xs: "2rem", md: "3.5rem" },
            lineHeight: 1.2,
          }}
        >
          Upgrade Your Interiors <br /> With Exclusive Collections
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: 600,
            mx: "auto",
            mb: 5,
            fontSize: { xs: "1rem", md: "1.125rem" },
          }}
        >
          Discover timeless designs and premium finishes crafted to bring elegance and warmth to your living spaces.  
          Subtle luxury, tailored for you.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => (window.location.href = "/shop")}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "#fff",
            px: { xs: 5, md: 7 },
            py: 1.5,
            borderRadius: 9999,
            fontWeight: 700,
            fontSize: "1.125rem",
            "&:hover": {
              bgcolor: theme.palette.secondary.main,
            },
            boxShadow: theme.shadows[4],
            transition: "background-color 0.3s ease",
          }}
        >
          Shop Now
        </Button>
      </Container>

      {/* Soft blurred accents */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "absolute",
          top: 64,
          left: 64,
          width: 160,
          height: 160,
          bgcolor: theme.palette.accent?.main + "33" || theme.palette.secondary.main + "33",
          borderRadius: "50%",
          filter: "blur(64px)",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "absolute",
          bottom: 64,
          right: 64,
          width: 224,
          height: 224,
          bgcolor: theme.palette.secondary.main + "33",
          borderRadius: "50%",
          filter: "blur(96px)",
          zIndex: 1,
        }}
      />
    </Box>
  );
}
