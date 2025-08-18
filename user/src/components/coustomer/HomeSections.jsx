import React, { useEffect, useState } from "react";
import HorizontalSection from "./HorizontalSection";
import API from "../../utils/api";
import HomeMiddleSection from "./HomeMiddleSection";

export default function HomeSections() {
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    API.get("/products/trending").then((res) => setTrending(res.data));
    API.get("/products/new-arrival").then((res) => setNewArrivals(res.data));
    API.get("/products/best-seller").then((res) => setBestSeller(res.data));
  }, []);

  const SectionHeader = ({ children }) => (
    <div className="mb-4">
      <h2
        className={`
          text-3xl font-cinzel text-center font-bold text-secondary
        `}
      >
        {children}
      </h2>
      <div className="w-20 h-1 bg-accent mx-auto mt-2 rounded-full"></div>
    </div>
  );

  return (
    <div className="bg-background">
      {/* Trending Section */}
      <div className="px-6 md:px-12 lg:px-20 py-8">
        <SectionHeader>Trending</SectionHeader>
        <HorizontalSection products={trending} />
      </div>

      {/* Full Width Middle Section */}
      <HomeMiddleSection />

      {/* New Arrivals Section */}
      <div className="px-6 md:px-12 lg:px-20 py-8">
        <SectionHeader>New Arrivals</SectionHeader>
        <HorizontalSection products={newArrivals} />
      </div>

      {/* Best Sellers Section */}
      <div className="px-6 md:px-12 lg:px-20 py-8">
        <SectionHeader>Best Sellers</SectionHeader>
        <HorizontalSection products={bestSeller} />
      </div>
    </div>
  );
}
