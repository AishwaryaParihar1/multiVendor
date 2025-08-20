import { Box, Typography, Button, Stack } from "@mui/material";
import lamp from "../../assets/lamp.png";

export default function HomeThird() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
        overflow: "hidden",
        mb: 6,
      }}
    >
      {/* Left Content */}
      <Stack spacing={3} sx={{ zIndex: 2, maxWidth: "600px", p: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.dark">
          Elevate Your Space 
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover premium furniture & interior designs that bring style and
          comfort to your home.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            to="/shop"
            size="large"
            sx={{ px: 4, borderRadius: 3 }}
          >
            Shop Now
          </Button>
          <Button
          
            variant="outlined"
            color="secondary"
            to="/shop"
            size="large"
            sx={{ px: 4, borderRadius: 3 }}
          >
            Explore
          </Button>
        </Stack>
      </Stack>

      {/* Right Side Chair Image */}
      <Box
        component="img"
        src={lamp}
        alt="Chair"
        sx={{
          position: "absolute",
          right: { xs: -40, md: 60 },
          bottom: 0,
          height: { xs: "280px", md: "420px" },
          objectFit: "contain",
          zIndex: 1,
        }}
      />

      {/* Decorative Circle BG */}
      <Box
        sx={{
          position: "absolute",
          right: -100,
          bottom: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          bgcolor: "secondary.light",
          opacity: 0.3,
          zIndex: 0,
        }}
      />
    </Box>
  );
}
