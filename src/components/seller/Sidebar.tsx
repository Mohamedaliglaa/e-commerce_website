"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusCircle, List, ShoppingCart, Newspaper, Tag } from "lucide-react";

const SideBar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Add Product", path: "/seller", icon: PlusCircle },
    { name: "Product List", path: "/seller/product-list", icon: List },
    { name: "Orders", path: "/seller/orders", icon: ShoppingCart },
    { name: "Publications", path: "/seller/Publications", icon: Newspaper },
    { name: "Categories", path: "/seller/Add-categorie", icon: Tag },
  ];

  return (
    <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link href={item.path} key={item.name} passHref>
            <div
              className={`flex items-center py-3 px-4 gap-3 ${
                isActive
                  ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90"
                  : "hover:bg-gray-100/90 border-white"
              } cursor-pointer`}
            >
              {React.createElement(item.icon, { className: "w-7 h-7" })}
              <p className="md:block hidden text-center">{item.name}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
