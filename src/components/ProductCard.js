// Importation de la bibliothèque React
import React from "react";

// Importation des composants de navigation et des contextes
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Définition du composant ProductCard (carte de produit)
const ProductCard = ({ product }) => {
  // Récupération des données d'authentification
  // currentUser contient les infos de l'utilisateur connecté (ou null si déconnecté)
  const { currentUser } = useAuth();

  // Récupération de la fonction addToCart depuis le contexte du panier
  // Cette fonction permet d'ajouter un produit au panier
  const { addToCart } = useCart();

  // Définition de l'URL de l'image du produit
  // Si le produit a une image, on l'utilise, sinon on utilise une image par défaut
  const imageUrl =
    product.image ||
    "https://via.placeholder.com/300x200?text=Produit+Agricole";

  // Le composant retourne la structure de la carte produit
  return (
    // Conteneur principal de la carte avec styles Tailwind
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* === IMAGE DU PRODUIT === */}
      <img
        src={imageUrl} // Source de l'image (URL du produit ou image par défaut)
        alt={product.title} // Texte alternatif pour l'accessibilité
        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
      />

      {/* === CONTENU DE LA CARTE === */}
      <div className="p-6">
        {/* Titre du produit */}
        <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2">
          {product.title}
        </h3>

        {/* Description du produit (limitée à 2 lignes) */}
        <p className="text-gray-600 text-base mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* === INFORMATIONS PRIX ET CATÉGORIE === */}
        <div className="flex justify-between items-center mb-4">
          {/* Prix du produit en vert et en gras */}
          <span className="text-green-600 font-bold text-2xl">
            {product.price}€
          </span>
          {/* Catégorie du produit dans un badge */}
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Nom du vendeur */}
        <p className="text-gray-500 text-sm mb-4">
          Vendeur: <span className="font-semibold">{product.sellerName}</span>
        </p>

        {/* === BOUTONS D'ACTION === */}
        <div className="flex flex-col gap-3">
          {/* Lien pour voir les détails du produit */}
          <Link
            to={`/product/${product.id}`} // Lien vers la page détail du produit
            className="bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Voir détails
          </Link>

          {/* 
            Bouton "Ajouter au panier" conditionnel :
            - Seulement visible si l'utilisateur est connecté ET a le rôle "user"
            - Les producteurs et administrateurs ne voient pas ce bouton
          */}
          {currentUser && currentUser.role === "user" && (
            <button
              onClick={() => addToCart(product)} // Appel de la fonction addToCart quand on clique
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 px-4 rounded-lg font-medium transition-all duration-200"
            >
              Ajouter au panier
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default ProductCard;
