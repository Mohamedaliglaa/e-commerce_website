'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import type { ProductWithImages } from "@/types"; // adjust path if needed
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

const OrderSummary: React.FC = () => {
  const { currency, router, cartItems, products, getCartCount } = useAppContext();
  const { data: session } = useSession();
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    // Build order items list based on cart
    const items: OrderItem[] = Object.entries(cartItems)
      .map(([productId, quantity]) => {
        const product = products.find(
          (p: ProductWithImages) => p.id === productId
        );
        if (!product) return null;

        return {
          productId,
          quantity: Number(quantity),
          unitPrice: product.offerPrice ?? product.price,
        };
      })
      .filter((item): item is OrderItem => item !== null);

    setOrderItems(items);
  }, [cartItems, products]);

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const livraisonFee = 5; // Fixed delivery fee

  const createOrder = async () => {
    if (!fullName || !address || !phone) {
      toast.error("Veuillez remplir tous les champs : nom complet, adresse et téléphone.");
      return;
    }
    const userId = session?.user?.id || (session as any)?.user?.uid;
console.log({
  userId: session?.user?.id,
  status: "PENDING",
  totalAmount: totalAmount + livraisonFee,
  address,
  phone,
  items: orderItems,
});
    const orderData = {
      userId, // Replace with logged-in user's id
      status: "PENDING",
      totalAmount: totalAmount + livraisonFee,
      address,
      phone,
      items: orderItems,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Erreur lors de la création de la commande");

      toast.success("Commande créée avec succès !");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de la commande.");
    }
  };

  return (
    <div className="w-full md:w-96 bg-gray-100 p-5 rounded-md shadow-md">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-4">
        Résumé de la commande
      </h2>

      {/* User details */}
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold text-gray-600">Nom complet</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Votre nom complet"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-600">Adresse</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Votre adresse complète"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-600">Téléphone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Votre numéro de téléphone"
          />
        </div>
      </div>

      <hr className="my-5 border-gray-300" />

      {/* Order total */}
      <div className="space-y-3">
        <div className="flex justify-between font-medium text-gray-700">
          <span>Articles ({getCartCount()})</span>
          <span>
            {currency}
            {totalAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between font-medium text-gray-700">
          <span>Livraison</span>
          <span>
            {currency}
            {livraisonFee.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-3">
          <span>Total</span>
          <span>
            {currency}
            {(totalAmount + livraisonFee).toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="mt-6 w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700 transition"
      >
        Passer la commande
      </button>
    </div>
  );
};

export default OrderSummary;
