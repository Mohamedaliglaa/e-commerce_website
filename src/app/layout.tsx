import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import React, { ReactNode } from "react";
import prisma from "@/lib/prisma";
import { SessionProvider } from "next-auth/react";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "QuickCart - GreatStack",
  description: "E-Commerce with Next.js ",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <Toaster />
          <SessionProvider>
            <AppContextProvider>{children}</AppContextProvider>
          </SessionProvider>
      </body>
    </html>
  );
}
