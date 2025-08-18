import React, { useEffect, useState } from "react";
import HorizontalSection from "./HorizontalSection";
import API from "../../utils/api";

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
    <div className="px-6 md:px-12 lg:px-20">
      <HorizontalSection title="🔥 Trending Products" products={trending} />
      <HorizontalSection title="✨ New Arrivals" products={newArrivals} />
      <HorizontalSection title="🏆 Best Sellers" products={bestSeller} />
    </div>
  );
}
