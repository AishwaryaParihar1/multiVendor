import React from "react";
import { Box, Typography, Button, Stack, useTheme } from "@mui/material";
import ModernSofa from "../../assets/ModernSofa.jpg";
import AboutPage from "./AboutPage";

export default function About() {
  const theme = useTheme();

  return (
    <>
    <AboutPage/>
    <Box
      sx={{
        px: { xs: 2, md: 6 },
        py: { xs: 6, md: 10 },
        bgcolor: theme.palette.background.default,
        maxWidth: "100%",        // make full width
        width: "100%",           // full width
        mx: "auto",
        mb: { xs: 5, md: 8 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        gap: { xs: 4, md: 8 },
        borderRadius: 3,
        boxShadow: "none",       // shadow removed
        boxSizing: "border-box",
      }}
    >
      {/* LEFT: Image */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={ModernSofa} // your image path
          alt="About Interior"
          loading="lazy"
          sx={{
            width: { xs: 210, sm: 340, md: 360 },
            height: "auto",
            borderRadius: 2,
            boxShadow: "none", // no shadow here also
            bgcolor: "transparent", // transparent background for image container
          }}
        />
      </Box>

      {/* RIGHT: Content */}
      <Box flex={2}>
        <Typography
          variant="overline"
          sx={{
            color: theme.palette.secondary.main,
            fontSize: "1.02rem",
            letterSpacing: 1.8,
            fontWeight: 700,
            mb: 1,
            display: "block",
          }}
        >
          About MultiCvero
        </Typography>

        <Typography
          variant="h4"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 800,
            mb: 3,
            lineHeight: 1.13,
            letterSpacing: "0.06em",
            fontFamily: "'Cinzel', serif",
          }}
        >
          Curated Interiors & Inspired Living
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: "1.15rem", md: "1.18rem" },
            mb: 3,
            maxWidth: 540,
            lineHeight: 1.8,
          }}
        >
          MultiCvero brings together the best of <b>modern furniture</b>, innovative creators,
          and design-forward homeware in one place. Whether you're looking for a statement sofa, 
          a unique lamp, or expert design solutions, our mission is to make interiors fun, functional,
          and a joy to live in. <br /><br />
          Every piece is handpicked for quality and character, so you can create a home that’s truly your own.
        </Typography>

        <Stack direction="row" spacing={2} mt={2}>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: theme.palette.secondary.main,
              borderRadius: 0,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              px: 4,
              boxShadow: "none",
              letterSpacing: 1,
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Start Exploring
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              borderRadius: 0,
              fontWeight: 600,
              fontSize: "1rem",
              px: 3,
              letterSpacing: 1,
              bgcolor: "background.paper",
              "&:hover": {
                borderColor: theme.palette.secondary.main,
                color: theme.palette.secondary.main,
              },
            }}
            onClick={() => window.open("mailto:info@multicvero.com")}
          >
            Contact Us
          </Button>
        </Stack>
      </Box>
    </Box>
    </>
  );
}
