import React from 'react';
import { assets } from '../../../assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { signOut } from 'next-auth/react';
import LOGO from '../../../public/LOGO.png';
const Navbar = () => {
  const { router } = useAppContext();

  return (
    <div className="flex items-center px-4 md:px-8 py-3 justify-between border-b bg-white shadow-sm">
      <Image
        onClick={() => router.push('/')}
        className="w-44 lg:w-48 cursor-pointer"
        src={LOGO}
        alt="Logo"
      />
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="bg-gray-600 hover:bg-gray-700 transition-colors duration-200 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm shadow-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
