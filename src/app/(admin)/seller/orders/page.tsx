'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { assets } from "../../../../../assets/assets";

import type { OrderWithItemsAndUser } from "@/types/index"; // Adjust path

const Orders = () => {
  const { currency } = useAppContext();

  const [orders, setOrders] = useState<OrderWithItemsAndUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: OrderWithItemsAndUser[] = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>
          <div className="max-w-4xl rounded-md">
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                  <div className="flex-1 flex gap-5 max-w-80">
                    <Image
                      className="max-w-16 max-h-16 object-cover"
                      src={assets.box_icon}
                      alt="box_icon"
                      width={64}
                      height={64}
                    />
                    <p className="flex flex-col gap-3">
                      <span className="font-medium">
                        {order.items.map((item) => `${item.product.name} x ${item.quantity}`).join(", ")}
                      </span>
                      <span>Items : {order.items.length}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">{order.user?.name ?? "Unknown"}</span>
                      <br />
                      {/* address is a string in your schema, so just output it */}
                      <span>{order.address}</span>
                      <br />
                      <span>{order.phone}</span>
                    </p>
                  </div>
                  <p className="font-medium my-auto">{currency}{order.totalAmount.toFixed(2)}</p>
                  <div>
                    <p className="flex flex-col">
                      <span>Method : COD</span>
                      <span>Date : {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>Payment : Pending</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
