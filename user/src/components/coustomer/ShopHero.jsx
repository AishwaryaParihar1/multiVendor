import React from "react";
import { Box, Typography, Button } from "@mui/material";
import chair from "../../assets/chair1.png";

export default function ShopHero() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: 400, md: 350 },
        px: { xs: 2, md: 6 },
        // py: { xs: 3, md: 6 },
        display: "flex",
        flexDirection: "column", // vertical center
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        bgcolor: "#F8F6F2",
        overflow: "hidden",
      }}
    >
      {/* Top: Texts */}
      <Box sx={{ zIndex: 2, maxWidth: "700px" }}>
        <Typography
          variant="h1"
          sx={{
            color: "primary.main",
            fontWeight: 300,
            fontSize: { xs: "2rem", md: "2.65rem" },
      
            letterSpacing: 1,
          }}
        >
          Elevate Your Space
        </Typography>
        {/* <Typography
          variant="subtitle1"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "1rem", md: "1.2rem" },
            mb: 3,
          }}
        >
          Premium furniture & décor, handpicked for your inspiration. <br />
          Discover creative combinations for every corner of your home.
        </Typography> */}
      
      </Box>

      {/* Bottom: Chair with Circle Behind */}
      <Box
        sx={{
          mt: { xs: 1, md: 1 },
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Decorative Circle */}
        <Box
          sx={{
            position: "absolute",
            width: { xs: 220, md: 300 },
            height: { xs: 220, md: 300 },
            borderRadius: "50%",
            bgcolor: "rgba(76, 175, 80, 0.1)",
            zIndex: 1,
          }}
        />

        {/* Chair Image */}
        <Box
          component="img"
          src={chair}
          alt="Designer Chair"
          sx={{
            maxHeight: { xs: 180, md: 220 },
            maxWidth: { xs: 280, md: 360 },
            position: "relative",
            zIndex: 2,
          }}
        />
      </Box>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: "secondary.main",
            px: 4,
            borderRadius: 0,
            textTransform: "none",
            fontWeight: 400,
            fontSize: "1rem",
            boxShadow: 0,
            letterSpacing: 1,
          }}
        >
          Explore Collection
        </Button>
    </Box>
  );
}
