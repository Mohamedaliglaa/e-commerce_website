'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { ProductWithImages } from "@/types";


const ProductList = () => {
  const { router } = useAppContext();

  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProduct = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch");

      const data: ProductWithImages[] = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProduct();
  }, []);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Products</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        {product.images[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt="product Image"
                            className="w-16"
                            width={64}
                            height={64}
                            unoptimized
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">{product.category?.name ?? "N/A"}</td>
                    <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <button
                        onClick={() => router.push(`/product/${product.id}`)}
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
                      >
                        <span className="hidden md:block">Visit</span>
                        {/* Replace this with your icon or text */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
