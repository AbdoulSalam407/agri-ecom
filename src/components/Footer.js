import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Section 1 - Logo et slogan */}
          <div className="footer-section">
            <h2>🌱 AgriEcom</h2>
            <p>
              Mettre en relation producteurs, éleveurs et acheteurs pour une
              agriculture plus connectée.
            </p>
          </div>

          {/* Section 2 - Liens rapides */}
          <div className="footer-section">
            <h3>Liens utiles</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li>
                <Link to="/products">Produits</Link>
              </li>
              <li>
                <Link to="/cart">Panier</Link>
              </li>
              <li>
                <Link to="/profile">Mon profil</Link>
              </li>
            </ul>
          </div>

          {/* Section 3 - Contact */}
          <div className="footer-section">
            <h3>Contact</h3>
            <div className="footer-contact">
              <p>
                Email :{" "}
                <a href="mailto:contact@agriecom.com">contact@agriecom.com</a>
              </p>
              <p>Téléphone : +221 77 000 00 00</p>
              <p>Adresse : Thiès, Sénégal</p>
            </div>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} AgriEcom - Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
