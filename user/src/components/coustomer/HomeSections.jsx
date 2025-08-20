import React, { useEffect, useState } from "react";
import HorizontalSection from "./HorizontalSection";
import API from "../../utils/api";
import HomeMiddleSection from "./HomeMiddleSection";
import { Box, Typography } from "@mui/material";
import HomeThird from "./HomeThird";

const SectionHeader = ({ children }) => (
  <Box
    mb={1}
    textAlign="center"
    sx={{ display: "inline-block", width: "100%" }}
  >
    <Typography
      variant="h4"
      component="h2"
      sx={{
        fontFamily: "'Cinzel', serif",
        fontWeight: "bold",
        color: "primary.main",
        letterSpacing: 1.3,
        mb: 1,
      }}
    >
      {children}
    </Typography>
    <Box
    sx={{
    width: "100vw",   // viewport full width
    maxWidth: "100vw", // restrict max width same as viewport
    marginLeft: "calc(-50vw + 50%)",  // remove parent centered container padding effect
    px: 0,  // no padding
    backgroundColor: "background.default",
  }}
    />
  </Box>
);

export default function HomeSections() {
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    API.get("/products/trending").then((res) => setTrending(res.data));
    API.get("/products/new-arrival").then((res) => setNewArrivals(res.data));
    API.get("/products/best-seller").then((res) => setBestSeller(res.data));
  }, []);

  return (
    <Box sx={{ backgroundColor: "background.default" }}>
   <Box sx={{ width: "99%", py: 1, px: 6 }}>
  <SectionHeader>Trending</SectionHeader>
  <HorizontalSection products={trending} />
</Box>


      <Box sx={{ width: "100%", py: 2 }}>
        <HomeMiddleSection />
      </Box>

    <Box sx={{ width: "99%", py: 1, px: 6 }}>
        <SectionHeader>New Arrivals</SectionHeader>
        <HorizontalSection products={newArrivals} />
      </Box>
 <Box sx={{ width: "100%", py: 2 }}>
        <HomeThird />
      </Box>

      

      <Box sx={{ width: "99%", py: 1, px: 6 }}>
        <SectionHeader>Best Sellers</SectionHeader>
        <HorizontalSection products={bestSeller} />
      </Box>
    </Box>
  );
}
