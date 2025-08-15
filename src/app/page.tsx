'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import FeaturedProduct from "@/components/FeaturedProduct";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContactUs from "@/components/contact-us";

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeaderSlider/>
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <ContactUs />
      </div>
      <Footer />
    </>
  );
};

export default Home;
