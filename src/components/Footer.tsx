import React from "react";
import { assets } from "../../assets/assets";
import Image from "next/image";
import LOGO from '../../public/LOGO.png';
const Footer = () => {
  return (
    <footer id="contact-us">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={LOGO} alt="logo"/>
          <p className="mt-6 text-sm">
            MoncefBey SHOP est votre destination en ligne de confiance pour des produits
             de qualité à des prix avantageux. Des derniers appareils électroniques aux essentiels du quotidien, 
             nous rendons vos achats simples, sécurisés et rapides. Profitez de promotions exclusives, 
             de paiements sécurisés et d’une livraison rapide directement chez vous.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium  text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">Acceuil</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">About us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#contact">Contacter nous</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+216 24 096 377</p>
              <p>mohamedaliglaa71@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © GreatStack.dev All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;