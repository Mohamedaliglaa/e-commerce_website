import React from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import type { Product } from "@prisma/client";

type ProductWithImages = Product & { images: { id: string; url: string }[] };

interface ProductCardProps {
  product: ProductWithImages;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { currency, router } = useAppContext();

  return (
    <div
      onClick={() => {
        router.push("/product/" + product.id);
        scrollTo(0, 0);
      }}
      className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
    >
      <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
        <Image
          src={product.images.length > 0 ? product.images[0].url : "/fallback-image.png"}
          alt={product.name}
          className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
          width={800}
          height={800}
        />
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
          {/* Replace assets.heart_icon with a direct image URL or inline SVG */}
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>

      <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
      <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.description}</p>

      <div className="flex items-center gap-2">
        <p className="text-xs">{4.5}</p>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`h-3 w-3 ${index < 4 ? "text-yellow-400" : "text-gray-300"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.973c.3.922-.755 1.688-1.54 1.118l-3.379-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.785.57-1.838-.196-1.54-1.118l1.287-3.973a1 1 0 00-.364-1.118L2.035 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
            </svg>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium">
          {currency}
          {product.price.toFixed(2)}
        </p>
        <button className=" max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition">
          Buy now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
