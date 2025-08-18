import React from "react";
import ProductCard from "./ProductCard";

export default function HorizontalSection({ title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="my-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="flex overflow-x-auto space-x-6 py-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
