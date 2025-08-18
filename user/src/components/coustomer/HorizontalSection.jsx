// HorizontalSection.jsx
import React from "react";
import ProductCard from "./ProductCard";

export default function HorizontalSection({ title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="my-1 mb-3">
      <h2 className="text-xl font-semibold mb-1 text-gray-900 tracking-tight">
        {title}
      </h2>
      <div className="flex overflow-x-auto space-x-6 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
