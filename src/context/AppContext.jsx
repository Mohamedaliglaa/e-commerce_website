'use client'

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

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

  // Fetch products from your API route (e.g. /api/products)
  const fetchProductData = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);

      // Extract unique categories from fetched products
      const uniqueCategories = ["All", ...new Set(
  data
    .map(p => p.category?.name) // extract just the category name
    .filter(Boolean)            // remove undefined/null
)];

      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch user data from your API route (e.g. /api/user)
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

  const addToCart = async (itemId) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
  };

  const updateCartQuantity = async (itemId, quantity) => {
    const cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, val) => acc + val, 0);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const id in cartItems) {
      const product = products.find(p => p._id === id);
      if (product) {
        totalAmount += product.offerPrice * cartItems[id];
      }
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

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
