// Importation de React
import React from "react";

// Importation des contextes pour accéder aux données du panier et de l'authentification
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Définition du composant Cart (page du panier)
const Cart = () => {
  // Récupération des fonctions et données du contexte du panier
  const {
    cartItems, // Tableau des articles dans le panier
    removeFromCart, // Fonction pour supprimer un article
    updateQuantity, // Fonction pour modifier la quantité
    getCartTotal, // Fonction pour calculer le total
    clearCart, // Fonction pour vider tout le panier
  } = useCart();

  // Récupération des données d'authentification
  const { currentUser } = useAuth();

  // === VÉRIFICATION SI L'UTILISATEUR N'EST PAS CONNECTÉ ===
  if (!currentUser) {
    return (
      // Message d'erreur stylisé avec Tailwind
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-200">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Accès non autorisé
          </h2>
          <p className="text-gray-600 mb-6">
            Veuillez vous connecter pour accéder à votre panier.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // === VÉRIFICATION SI LE PANIER EST VIDE ===
  if (cartItems.length === 0) {
    return (
      // Page panier vide stylisée
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-200">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Panier vide</h2>
          <p className="text-gray-600 mb-6">
            Votre panier est vide. Ajoutez des produits pour commencer vos
            achats !
          </p>
          <button
            onClick={() => (window.location.href = "/products")}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Découvrir les produits
          </button>
        </div>
      </div>
    );
  }

  // === FONCTION POUR GÉRER L'ACHAT ===
  const handlePurchase = () => {
    // Affiche une alerte de confirmation
    alert("Achat effectué avec succès! 🎉");
    // Vide le panier après l'achat
    clearCart();
  };

  // === RENDU PRINCIPAL QUAND LE PANIER CONTIENT DES ARTICLES ===
  return (
    // Conteneur principal avec fond gris clair
    <div className="min-h-screen bg-gray-50 p-6">
      {/* === EN-TÊTE DE LA PAGE === */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mon Panier</h1>
          <p className="text-gray-600">
            {cartItems.length} article(s) dans votre panier
          </p>
        </div>

        {/* === CONTENU PRINCIPAL - GRID AVEC ARTICLES ET RÉSUMÉ === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* === COLONNE DES ARTICLES (2/3 de largeur sur desktop) === */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              {/* Liste des articles du panier */}
              <div className="space-y-4">
                {/* Boucle sur chaque article du panier */}
                {cartItems.map((item) => (
                  // Carte pour chaque article
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Image du produit */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                    />

                    {/* Informations du produit */}
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-green-600 font-bold text-xl">
                        {item.price}€
                      </p>
                      <p className="text-gray-500 text-sm">Prix unitaire</p>
                    </div>

                    {/* Contrôles de quantité */}
                    <div className="flex items-center gap-3">
                      {/* Bouton diminuer quantité */}
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                      >
                        -
                      </button>

                      {/* Affichage de la quantité */}
                      <span className="w-12 text-center font-semibold text-gray-800 text-lg">
                        {item.quantity}
                      </span>

                      {/* Bouton augmenter quantité */}
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Bouton supprimer */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      <span>🗑️</span>
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === COLONNE RÉSUMÉ ET ACTIONS (1/3 de largeur sur desktop) === */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-6">
              {/* Titre du résumé */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Récapitulatif de commande
              </h3>

              {/* Détails du résumé */}
              <div className="space-y-3 mb-6">
                {/* Sous-total */}
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{getCartTotal().toFixed(2)}€</span>
                </div>

                {/* Livraison */}
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>

                {/* Ligne de séparation */}
                <div className="border-t border-gray-200 my-3"></div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>{getCartTotal().toFixed(2)}€</span>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-3">
                {/* Bouton vider le panier */}
                <button
                  onClick={clearCart}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  Vider le panier
                </button>

                {/* Bouton procéder à l'achat */}
                <button
                  onClick={handlePurchase}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>💰</span>
                  Procéder à l'achat
                </button>
              </div>

              {/* Message de sécurité */}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm text-center">
                  ✅ Paiement sécurisé - Livraison garantée
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default Cart;
