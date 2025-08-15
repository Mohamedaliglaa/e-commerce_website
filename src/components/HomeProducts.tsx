"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@prisma/client"; // Import Prisma type

// Extend Prisma Product type to include images, because Product.images is relation
type ProductWithImages = Product & { images: { id: string; url: string }[] };

const HomeProducts = () => {
  const [products, setProducts] = useState<ProductWithImages[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data: ProductWithImages[] = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center pt-10 px-4 sm:px-8 md:px-12 lg:px-20 w-full">
      <div className="w-full flex justify-between items-center mb-6">
        <p className="text-xl sm:text-2xl font-medium">Popular Products</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 w-full">
        {products.slice(0, 10).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <button
        onClick={() => (window.location.href = "/all-products")}
        className="mt-8 px-8 sm:px-10 py-2.5 border rounded text-gray-600 text-sm sm:text-base hover:bg-gray-100 transition"
      >
        See More
      </button>
    </div>
  );
};

export default HomeProducts;
