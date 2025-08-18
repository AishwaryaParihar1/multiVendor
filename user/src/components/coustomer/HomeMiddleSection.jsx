import React from "react";

export default function HomeMiddleSection() {
  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center bg-background overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        <h2 className="text-secondary text-3xl md:text-5xl font-cinzel font-bold leading-snug mb-4">
          Upgrade Your Interiors <br /> With Exclusive Collections
        </h2>
        <p className="text-muted text-base md:text-lg mb-6 max-w-2xl mx-auto">
          Discover timeless designs and premium finishes crafted to bring elegance and warmth to your living spaces.  
          Subtle luxury, tailored for you.
        </p>
        <button
          onClick={() => (window.location.href = "/shop")}
          className="bg-primary text-white font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:bg-secondary transition shadow-md"
        >
          Shop Now
        </button>
      </div>

      {/* Soft blurred accents */}
      <div className="hidden md:block absolute top-16 left-16 w-40 h-40 bg-accent/20 rounded-full blur-2xl"></div>
      <div className="hidden md:block absolute bottom-16 right-16 w-56 h-56 bg-secondary/20 rounded-full blur-3xl"></div>
    </section>
  );
}
