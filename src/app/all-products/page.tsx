'use client';
import React, { useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import type { ProductWithImages } from "@/types"; // Ajuste le chemin si besoin
import { useSearchParams } from "next/navigation";

const AllProducts: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory
  } = useAppContext() as {
    products: ProductWithImages[];
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
  };

 useEffect(() => {
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl, categories, setSelectedCategory]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category?.name === selectedCategory);

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-32 gap-8">
        {/* Section Produits */}
        <div className="flex-1">
          <div className="flex flex-col items-end pt-12">
            <p className="text-2xl font-medium">All products</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14 w-full">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id ?? index} // fallback sur index si id absent
                product={product}
              />
            ))}
          </div>
        </div>

        {/* Filtre catégorie (sidebar droite) */}
        <div className="w-full md:w-64 lg:w-72 border-l pl-6 mt-12">
          <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-left px-3 py-2 rounded-md transition
                  ${selectedCategory === cat
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
