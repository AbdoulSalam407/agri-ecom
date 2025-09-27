import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-6 mt-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 1 - Logo et slogan */}
        <div>
          <h2 className="text-2xl font-bold">🌱 AgriEcom</h2>
          <p className="mt-2 text-sm">
            Mettre en relation producteurs, éleveurs et acheteurs pour une
            agriculture plus connectée.
          </p>
        </div>

        {/* Section 2 - Liens rapides */}
        <div>
          <h3 className="font-semibold mb-2">Liens utiles</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-yellow-300">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-yellow-300">
                Produits
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-yellow-300">
                Panier
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-yellow-300">
                Mon profil
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 3 - Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p>
            Email :{" "}
            <a
              href="mailto:contact@agriecom.com"
              className="hover:text-yellow-300"
            >
              contact@agriecom.com
            </a>
          </p>
          <p>Téléphone : +221 77 000 00 00</p>
          <p>Adresse : Thiès, Sénégal</p>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="border-t border-green-600 mt-6 pt-4 text-center text-sm">
        © {new Date().getFullYear()} AgriEcom - Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
