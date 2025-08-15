"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

import type { Category, Product } from "@prisma/client";

type ProductWithImages = Product & {
  images: { id: string; url: string }[];
  category: Category;
};

// ReadMore component (unchanged)
const ReadMore: React.FC<{ text: string; maxLines?: number }> = ({ text, maxLines = 3 }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className={`text-gray-600 mt-3 leading-snug max-w-md whitespace-normal break-words overflow-wrap break-all ${
          !expanded ? `line-clamp-${maxLines}` : ""
        }`}
        style={{ wordBreak: "break-word" }}
      >
        {text}
      </p>
      {text.length > 150 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-orange-600 font-semibold mt-1 focus:outline-none"
          aria-expanded={expanded}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const Produit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, router } = useAppContext();

  const [productData, setProductData] = useState<ProductWithImages | null>(null);
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Échec de la récupération des produits");
      const data: ProductWithImages[] = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProductById = async (productId: string) => {
    try {
      const res = await fetch("/api/products/id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId }),
      });
      if (!res.ok) throw new Error("Échec de la récupération du produit");
      const data: ProductWithImages = await res.json();
      setProductData(data);
      if (data.images.length > 0) setMainImage(data.images[0].url);
    } catch (error) {
      console.error(error);
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProductById(id);
    }
  }, [id]);

  if (loading) return <Loading />;
  if (!productData) return <p>Produit introuvable.</p>;

  const ajouterAuPanier = () => {
    addToCart(productData.id);
    toast.success("Produit ajouté au panier !");
  };

  const acheterMaintenant = () => {
    addToCart(productData.id);
    router.push("/cart");
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Images du produit */}
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
              <Image
                src={mainImage || productData.images[0].url}
                alt={productData.name}
                className="w-full h-auto object-cover mix-blend-multiply"
                width={1280}
                height={720}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productData.images.map((image) => (
                <div
                  key={image.id}
                  onClick={() => setMainImage(image.url)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setMainImage(image.url);
                    }
                  }}
                >
                  <Image
                    src={image.url}
                    alt={`Image produit ${productData.name}`}
                    className="w-full h-auto object-cover mix-blend-multiply"
                    width={1280}
                    height={720}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Détails du produit */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {productData.name}
            </h1>

            {/* Rating simplifié avec étoiles */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-gray-400">★</span>
              </div>
              <p>(4.5)</p>
            </div>

            {/* ReadMore toggle for description */}
            <ReadMore text={productData.description || ""} maxLines={3} />

            <p className="text-3xl font-medium mt-6">{productData.price.toFixed(2)} TND</p>

            <hr className="bg-gray-600 my-6" />

            {/* Tableau de caractéristiques */}
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-72">
                <tbody>
                  <tr>
                    <td className="text-gray-600 font-medium">Marque</td>
                    <td className="text-gray-800/50">Generic</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">Couleur</td>
                    <td className="text-gray-800/50">Multi</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">Catégorie</td>
                    <td className="text-gray-800/50">{productData.category.name}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Boutons */}
            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={ajouterAuPanier}
                className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Ajouter au panier
              </button>
              <button
                onClick={acheterMaintenant}
                className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Acheter maintenant
              </button>
            </div>
          </div>
        </div>

        {/* Produits en vedette */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              Produits <span className="text-orange-600">en vedette</span>
            </p>
            <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <button
            onClick={() => router.push("/products")}
            className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
          >
            Voir plus
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Produit;
