'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        {children}
      </div>
    </div>
  )
}

export default Layout