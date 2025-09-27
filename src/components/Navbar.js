import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { getCartItemsCount } = useCart();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          AgriEcom
        </Link>

        <div className="nav-menu">
          <Link to="/products" className="nav-link">
            Produits
          </Link>

          {currentUser ? (
            <>
              {currentUser.role === "producer" && (
                <Link to="/my-products" className="nav-link">
                  Mes Produits
                </Link>
              )}
              {currentUser.role === "admin" && (
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
              )}
              <Link to="/cart" className="nav-link">
                Panier ({getCartItemsCount()})
              </Link>
              <Link to="/profile" className="nav-link">
                Profil
              </Link>
              <button onClick={logout} className="nav-link">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Connexion
              </Link>
              <Link to="/register" className="nav-link">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
