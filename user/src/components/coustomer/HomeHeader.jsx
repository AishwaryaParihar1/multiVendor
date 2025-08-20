import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  useTheme,
} from "@mui/material";
import { gsap } from "gsap";

// TypingText component for typing animation
function TypingText({ text, speed = 120, loop = false }) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (loop) {
      const restartTimeout = setTimeout(() => {
        setDisplayedText("");
        setIndex(0);
      }, 1500);
      return () => clearTimeout(restartTimeout);
    }
  }, [index, text, speed, loop]);

  return <>{displayedText}</>;
}

const categories = ["Furniture", "Lighting", "Decor", "Services", "Design"];

export default function HomeHeader() {
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    // Starting with opacity 0 and y=40 for container animation
    gsap.set(containerRef.current, { opacity: 0, y: 40 });
    gsap.set(leftRef.current, { opacity: 0, y: 20 });
    gsap.set(rightRef.current, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(containerRef.current, { opacity: 1, y: 0, duration: 1.3 })
      .to(leftRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.4")
      .to(rightRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.4");
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      alert(`Search for: ${searchTerm.trim()}`);
    }
  };

  return (
    <Box
      component="header"
      ref={containerRef}
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "67vh",
        py: 12,
        px: { xs: 3, md: 6 },
        maxWidth: 1120,
        mx: "auto",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 6,
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 3,
        overflow: "hidden",
      }}
      aria-label="Home Page Featured Header"
    >
      <Box
        sx={{ flex: 1, maxWidth: { md: "50%" }, mb: { xs: 6, md: 0 } }}
        ref={leftRef}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 900,
            fontSize: { xs: "2.75rem", md: "4rem" },
            color: theme.palette.primary.main,
            mb: 3,
            letterSpacing: "0.1em",
          }}
        >
          <TypingText text="Transform Your Space" speed={120} loop={false} />
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 5,
            color: theme.palette.text.secondary,
            fontSize: { xs: "1.125rem", md: "1.25rem" },
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          Discover unique furniture, lighting, wall decor & more, curated from the
          best interior creators.
        </Typography>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" mb={5}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              variant="outlined"
              sx={{
                borderColor: theme.palette.accent?.main ?? "#CBAF7A",
                color: theme.palette.accent?.main ?? "#CBAF7A",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor:
                    theme.palette.accent?.main ?? "#CBAF7A",
                  color: theme.palette.background.default,
                  boxShadow: "0 6px 15px rgba(203,175,122,0.3)",
                },
              }}
              onClick={() => alert(`Explore category: ${cat}`)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter") alert(`Explore category: ${cat}`);
              }}
            />
          ))}
        </Stack>

        <Button
          variant="contained"
          size="large"
          sx={{
            px: 6,
            py: 1.8,
            fontWeight: 700,
            fontSize: "1.1rem",
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
            boxShadow: `0 6px 15px ${theme.palette.shadowColor ?? "rgba(0,64,48,0.3)"}`,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: `0 8px 20px ${theme.palette.shadowColor ?? "rgba(0,64,48,0.5)"}`,
            },
          }}
          aria-label="Explore services"
          onClick={() => alert("Explore services clicked")}
        >
          Explore Services
        </Button>
      </Box>

      <Stack
        direction="row"
        spacing={4}
        sx={{ flex: 1, maxWidth: { md: "50%" } }}
        ref={rightRef}
        justifyContent="center"
      >
        {/* Featured Product Card 1 */}
        <Box
          sx={{
            width: 180,
            borderRadius: 3,
            boxShadow: `0 10px 20px ${theme.palette.shadowColor ?? "rgba(0,64,48,0.15)"}`,
            cursor: "pointer",
            overflow: "hidden",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.07)",
              boxShadow: `0 15px 30px ${theme.palette.shadowColor ?? "rgba(0,64,48,0.3)"}`,
            },
          }}
        >
          <Box
            component="img"
            src="https://m.media-amazon.com/images/I/813q7VYwTDL.__AC_SY445_SX342_QL70_FMwebp_.jpg"
            alt="Modern Lamp"
            loading="lazy"
            sx={{ width: "100%", height: 160, objectFit: "cover" }}
          />
          <Box sx={{ textAlign: "center", p: 2, backgroundColor: theme.palette.background.paper }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
            >
              Modern Lamp
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Lighting
            </Typography>
          </Box>
        </Box>

        {/* Featured Product Card 2 */}
        <Box
          sx={{
            width: 180,
            borderRadius: 3,
            boxShadow: `0 10px 20px ${theme.palette.shadowColor ?? "rgba(0,64,48,0.15)"}`,
            cursor: "pointer",
            overflow: "hidden",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.07)",
              boxShadow: `0 15px 30px ${theme.palette.shadowColor ?? "rgba(0,64,48,0.3)"}`,
            },
          }}
        >
          <Box
            component="img"
            src="https://us.koala.com/cdn/shop/files/CushySofaBed_Gumleaf_Queen_1_cdd4e2d6-0df4-4a76-b879-15a7cb479b8f.jpg?v=1734421270&width=1660"
            alt="Cozy Sofa"
            loading="lazy"
            sx={{ width: "100%", height: 160, objectFit: "cover" }}
          />
          <Box sx={{ textAlign: "center", p: 2, backgroundColor: theme.palette.background.paper }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
            >
              Cozy Sofa
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Furniture
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
