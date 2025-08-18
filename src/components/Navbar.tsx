"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoMenu, IoClose } from "react-icons/io5";
import { useSession, signIn, signOut } from "next-auth/react";
import LOGO from "../../public/LOGO.png";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = session?.user.isAdmin;

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 relative">
      {/* Logo */}
      <Image
        className="cursor-pointer w-32 sm:w-32 lg:w-48 h-auto"
        onClick={() => router.push("/")}
        src={LOGO}
        alt="logo"
        priority
      />

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6 lg:gap-8">
        <Link href="/" className="hover:text-gray-900 transition">
          Accueil
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Boutique
        </Link>
        <Link href="/cart" className="hover:text-gray-900 transition">
          Panier
        </Link>
        <Link href="/#contact" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {status === "authenticated" && isAdmin && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Tableau de bord vendeur
          </button>
        )}
      </div>

      {/* Desktop Account Section */}
      <ul className="hidden md:flex items-center gap-4">
        {status === "loading" && <p>Chargement...</p>}

        {status === "unauthenticated" && (
          <button
            onClick={() => signIn()}
            className="border px-3 py-1 rounded-full text-xs"
          >
            Se connecter
          </button>
        )}

        {status === "authenticated" && (
          <div className="flex items-center gap-4">
            <p className="text-sm">
              Bonjour, {session.user?.name || "Utilisateur"}
            </p>
            <button
              onClick={() => signOut()}
              className="border px-3 py-1 rounded-full text-xs"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </ul>

      {/* Mobile Menu Button */}
      <div className="flex items-center md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-2xl"
          aria-label="Menu mobile"
        >
          {mobileMenuOpen ? <IoClose /> : <IoMenu />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white shadow-lg border-t border-gray-200 flex flex-col items-start px-6 py-4 z-50 md:hidden">
          <Link
            href="/"
            className="py-3 text-lg font-medium w-full hover:text-orange-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link
            href="/all-products"
            className="py-3 text-lg font-medium w-full hover:text-orange-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            Boutique
          </Link>
          <Link
            href="/#about"
            className="py-3 text-lg font-medium w-full hover:text-orange-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            À propos
          </Link>
          <Link
            href="/#contact"
            className="py-3 text-lg font-medium w-full hover:text-orange-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>

          {status === "authenticated" && isAdmin && (
            <button
              onClick={() => {
                router.push("/seller");
                setMobileMenuOpen(false);
              }}
              className="mt-3 text-sm border px-4 py-2 rounded-full w-full text-left"
            >
              Tableau de bord vendeur
            </button>
          )}

          <div className="mt-4 flex flex-col gap-3 w-full">
            {status === "loading" && <p>Chargement...</p>}

            {status === "unauthenticated" && (
              <button
                onClick={() => {
                  signIn();
                  setMobileMenuOpen(false);
                }}
                className="border px-3 py-2 rounded-full text-sm w-full"
              >
                Se connecter
              </button>
            )}

            {status === "authenticated" && (
              <>
                <p className="text-sm">
                  Bonjour, {session.user?.name || "Utilisateur"}
                </p>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="border px-3 py-2 rounded-full text-sm w-full"
                >
                  Se déconnecter
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
