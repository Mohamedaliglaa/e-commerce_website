'use client'

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(true);

  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cartItems");
      return storedCart ? JSON.parse(storedCart) : {};
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const fetchProductData = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);

      const uniqueCategories = ["All", ...new Set(data.map(p => p.category?.name).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Add product to cart with stock validation
  const addToCart = (itemId) => {
    const product = products.find(p => p.id === itemId);
    if (!product) return;

    const currentQty = cartItems[itemId] || 0;

    if (currentQty + 1 > product.quantity) {
      toast.error(`Stock disponible : ${product.quantity}`);
      return;
    }

    setCartItems({ ...cartItems, [itemId]: currentQty + 1 });
  };

  // Update cart quantity with stock validation
  const updateCartQuantity = (itemId, quantity) => {
    const product = products.find(p => p.id === itemId);
    if (!product) return;

    if (quantity > product.quantity) {
      toast.error(`Stock disponible : ${product.quantity}`);
      return;
    }

    if (quantity <= 0) {
      const updatedCart = { ...cartItems };
      delete updatedCart[itemId];
      setCartItems(updatedCart);
    } else {
      setCartItems({ ...cartItems, [itemId]: quantity });
    }
  };

  const getCartCount = () => Object.values(cartItems).reduce((acc, val) => acc + val, 0);

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const id in cartItems) {
      const product = products.find(p => p.id === id);
      if (product) totalAmount += (product.offerPrice || product.price) * cartItems[id];
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
    fetchUserData();
  }, []);

  const value = {
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    categories,
    selectedCategory,
    setSelectedCategory,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
