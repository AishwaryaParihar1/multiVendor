import React, { useRef } from "react";
import { Box, Typography, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function HorizontalSection({ title, products }) {
  const theme = useTheme();
  const containerRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!products || products.length === 0) return null;

  // Card width + gap
  const cardWidth = 288;
  const gap = 4; 
  const scrollAmount = isMobile ? cardWidth + gap : (cardWidth + gap) * 3;

  const scrollBy = (distance) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: distance, behavior: "smooth" });
    }
  };

  return (
    <section style={{ position: "relative", padding: "1rem 0" }}>
      {title && (
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            pt: 2,
            color: theme.palette.primary.main,
            fontFamily: "'Cinzel', serif",
            letterSpacing: 1.1,
          }}
        >
          {title}
        </Typography>
      )}

      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: gap,
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          pb: 1,
          "& > *": { scrollSnapAlign: "start", flex: "0 0 auto" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {products.map((product) => (
          <Box
            key={product._id}
            sx={{
              minWidth: isMobile ? cardWidth : 288,
              scrollSnapAlign: "start",
              flexShrink: 0,
            }}
          >
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>

      <IconButton
        aria-label="Scroll left"
        onClick={() => scrollBy(-scrollAmount)}
        sx={{
          position: "absolute",
          top: "50%",
          left: 8,
          transform: "translateY(-50%)",
          bgcolor: "background.paper",
          boxShadow: theme.shadows[3],
          "&:hover": { bgcolor: theme.palette.primary.light },
          zIndex: 10,
          display: products.length <= 1 ? "none" : "flex",
        }}
      >
        <ChevronLeft size={24} />
      </IconButton>

      <IconButton
        aria-label="Scroll right"
        onClick={() => scrollBy(scrollAmount)}
        sx={{
          position: "absolute",
          top: "50%",
          right: 8,
          transform: "translateY(-50%)",
          bgcolor: "background.paper",
          boxShadow: theme.shadows[3],
          "&:hover": { bgcolor: theme.palette.primary.light },
          zIndex: 10,
          display: products.length <= 1 ? "none" : "flex",
        }}
      >
        <ChevronRight size={24} />
      </IconButton>
    </section>
  );
}
