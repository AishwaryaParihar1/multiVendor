import React, { useState } from "react";
import { Search } from "lucide-react";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Replace with your navigation logic or search function
      alert(`Search for: ${searchTerm.trim()}`);
    }
  };

  const categories = ["Furniture", "Lighting", "Decor", "Services", "Design"];

  return (
    <header className="relative bg-background pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Section: Headline & Search */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-4 font-cinzel">
            Transform Your Space
          </h1>
          <p className="text-lg text-primary mb-6 max-w-xl">
            Discover unique furniture, lighting, wall decor & more, curated from the best interior creators.
          </p>
          <form
            onSubmit={handleSearchSubmit}
            className="flex rounded-lg shadow bg-white px-5 py-3 mb-4 w-full max-w-md"
          >
            <input
              className="flex-1 outline-none text-gray-800 placeholder-muted"
              placeholder="Search for products or services..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for products or services"
            />
            <button
              type="submit"
              className="ml-3 px-5 py-2 rounded bg-accent text-primary font-semibold hover:bg-primary hover:text-accent transition"
              aria-label="Submit search"
            >
              <Search size={24} />
            </button>
          </form>
          {/* Categories Pills */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <div
                key={cat}
                className="px-4 py-1 rounded-full bg-background border border-accent text-primary font-semibold hover:bg-accent hover:text-background shadow transition cursor-pointer"
                tabIndex={0}
                role="button"
                onClick={() => alert(`Explore category: ${cat}`)} // Replace with navigation
                onKeyDown={(e) => {
                  if (e.key === "Enter") alert(`Explore category: ${cat}`);
                }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
        {/* Right Section: Featured Product Cards */}
        <div className="flex-1 flex items-center justify-center gap-6">
          <div className="bg-card rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer">
            <img
              src="https://m.media-amazon.com/images/I/813q7VYwTDL.__AC_SY445_SX342_QL70_FMwebp_.jpg"
              alt="Featured Modern Lamp"
              className="w-28 h-28 object-cover rounded-lg mb-3 shadow"
              loading="lazy"
            />
            <span className="text-lg font-bold text-heading mb-1">Modern Lamp</span>
            <span className="text-muted text-sm">Lighting</span>
          </div>
          <div className="bg-card rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer">
            <img
              src="https://us.koala.com/cdn/shop/files/CushySofaBed_Gumleaf_Queen_1_cdd4e2d6-0df4-4a76-b879-15a7cb479b8f.jpg?v=1734421270&width=1660"
              alt="Featured Sofa"
              className="w-28 h-28 object-cover rounded-lg mb-3 shadow"
              loading="lazy"
            />
            <span className="text-lg font-bold text-heading mb-1">Cozy Sofa</span>
            <span className="text-muted text-sm">Furniture</span>
          </div>
        </div>
      </div>
      {/* Floating CTA Button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <button className="bg-primary hover:bg-accent text-white font-semibold px-7 py-3 rounded-xl shadow-xl text-xl transition">
          Explore Collections
        </button>
      </div>
    </header>
  );
}
