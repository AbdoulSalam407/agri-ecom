// Importation de la bibliothèque React
import React from "react";

// Importation des composants de navigation et des contextes
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Définition du composant Navbar (barre de navigation)
const Navbar = () => {
  // Récupération des données d'authentification depuis le contexte
  // currentUser contient les infos de l'utilisateur connecté (ou null si déconnecté)
  // logout est la fonction pour se déconnecter
  const { currentUser, logout } = useAuth();

  // Récupération des données du panier depuis le contexte
  // getCartItemsCount() retourne le nombre total d'articles dans le panier
  const { getCartItemsCount } = useCart();

  // Le composant retourne la structure de la navbar
  return (
    // Barre de navigation principale avec fond blanc, ombre et position fixe en haut
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      {/* Conteneur principal avec largeur maximale et centrage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* === LOGO - Cliquable pour retourner à l'accueil === */}
          <Link
            to="/"
            className="flex items-center text-xl font-bold text-green-700 hover:text-green-800 transition-colors"
          >
            {/* Emoji de plante + nom de l'application */}
            🌱 AgriEcom
          </Link>

          {/* === MENU DE NAVIGATION === */}
          <div className="flex items-center space-x-4">
            {/* Lien vers la page des produits (toujours visible) */}
            <Link
              to="/products"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Produits
            </Link>

            {/* === CONTENU CONDITIONNEL - Dépend si l'utilisateur est connecté ou non === */}
            {currentUser ? (
              // === UTILISATEUR CONNECTÉ ===
              <>
                {/* Si l'utilisateur est un producteur, afficher le lien "Mes Produits" */}
                {currentUser.role === "producer" && (
                  <Link
                    to="/my-products"
                    className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Mes Produits
                  </Link>
                )}

                {/* Si l'utilisateur est un administrateur, afficher le lien "Admin" */}
                {currentUser.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}

                {/* Lien vers le panier avec le nombre d'articles (toujours visible pour les utilisateurs connectés) */}
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Panier
                  {/* Badge avec le nombre d'articles dans le panier */}
                  <span className="absolute -top-2 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                </Link>

                {/* Lien vers le profil de l'utilisateur */}
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Profil
                </Link>

                {/* Bouton de déconnexion */}
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              // === UTILISATEUR NON CONNECTÉ ===
              <>
                {/* Lien vers la page de connexion */}
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Connexion
                </Link>

                {/* Lien vers la page d'inscription avec un style de bouton */}
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default Navbar;
