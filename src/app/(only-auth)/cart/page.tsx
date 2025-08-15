'use client';

import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import OrderSummary from "@/components/OrderSummary";
import { useAppContext } from "@/context/AppContext";
import { assets } from "../../../../assets/assets";
import type { ProductWithImages } from "@/types"; // Adjust path if needed

const Cart: React.FC = () => {
  const {
    products,
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
  } = useAppContext();

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        {/* Left side - Cart Items */}
        <div className="flex-1">
          {/* Cart Header */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Votre <span className="font-medium text-orange-600">Panier</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">
              {getCartCount()} articles
            </p>
          </div>

          {/* Cart Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Détails Produit
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Prix
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Quantité
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Sous-total
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cartItems).map((itemId) => {
                  const product = products.find(
                    (p: ProductWithImages) => p.id === itemId
                  );

                  if (!product || cartItems[itemId] <= 0) return null;

                  const price = product.offerPrice ?? product.price;
                  const quantity = cartItems[itemId];
                  const subtotal = price * quantity;

                  return (
                    <tr key={itemId}>
                      {/* Product Details */}
                      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                            <Image
                              src={product.images[0]?.url || "/placeholder.png"}
                              alt={product.name}
                              width={1280}
                              height={720}
                              className="w-16 h-auto object-cover mix-blend-multiply"
                            />
                          </div>
                          <button
                            className="md:hidden text-xs text-orange-600 mt-1"
                            onClick={() => updateCartQuantity(product.id, 0)}
                          >
                            Supprimer
                          </button>
                        </div>
                        <div className="text-sm hidden md:block">
                          <p className="text-gray-800">{product.name}</p>
                          <button
                            className="text-xs text-orange-600 mt-1"
                            onClick={() => updateCartQuantity(product.id, 0)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        {price} {process.env.NEXT_PUBLIC_CURRENCY}
                      </td>

                      {/* Quantity */}
                      <td className="py-4 md:px-4 px-1">
                        <div className="flex items-center md:gap-2 gap-1">
                          <button
                            onClick={() =>
                              updateCartQuantity(product.id, quantity - 1)
                            }
                          >
                            <Image
                              src={assets.decrease_arrow}
                              alt="diminuer"
                              width={16}
                              height={16}
                            />
                          </button>
                          <input
                            type="number"
                            className="w-8 border text-center appearance-none"
                            value={quantity}
                            onChange={(e) =>
                              updateCartQuantity(
                                product.id,
                                Number(e.target.value)
                              )
                            }
                          />
                          <button onClick={() => addToCart(product.id)}>
                            <Image
                              src={assets.increase_arrow}
                              alt="augmenter"
                              width={16}
                              height={16}
                            />
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        {subtotal.toFixed(2)}{" "}
                        {process.env.NEXT_PUBLIC_CURRENCY}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Continue Shopping */}
          <button
            onClick={() => router.push("/all-products")}
            className="group flex items-center mt-6 gap-2 text-orange-600"
          >
            <Image
              src={assets.arrow_right_icon_colored}
              alt="continuer"
              width={20}
              height={20}
              className="group-hover:-translate-x-1 transition"
            />
            Continuer vos achats
          </button>
        </div>

        {/* Right side - Order Summary */}
        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
