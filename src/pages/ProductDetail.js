// Importation de React et des hooks useEffect et useState
import React, { useEffect, useState } from "react";

// Importation des composants de navigation React Router
import { useParams, Link } from "react-router-dom";

// Importation du service pour récupérer les données des produits
import { productService } from "../services/productService";

// Importation des contextes d'authentification et de panier
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Définition du composant ProductDetail (page de détail d'un produit)
const ProductDetail = () => {
  // ===== RÉCUPÉRATION DES PARAMÈTRES DE L'URL =====
  // useParams() permet de récupérer les paramètres de l'URL (ici l'ID du produit)
  const { id } = useParams();

  // ===== ÉTATS POUR GÉRER LES DONNÉES ET L'INTERFACE =====

  // État pour stocker les données du produit
  const [product, setProduct] = useState(null);

  // État pour gérer l'affichage du chargement
  const [loading, setLoading] = useState(true);

  // État pour les messages d'erreur
  const [error, setError] = useState("");

  // État pour la quantité sélectionnée (par défaut 1)
  const [quantity, setQuantity] = useState(1);

  // État pour les messages de succès/info
  const [message, setMessage] = useState({ type: "", text: "" });

  // ===== UTILISATION DES CONTEXTES =====

  // Récupération des données d'authentification
  const { currentUser, isAuthenticated, hasRole } = useAuth();

  // Récupération de la fonction pour ajouter au panier
  const { addToCart } = useCart();

  // ===== EFFET POUR CHARGER LE PRODUIT AU DÉMARRAGE =====
  useEffect(() => {
    loadProduct();
  }, [id]); // Se ré-exécute quand l'ID change

  // ===== FONCTION POUR CHARGER LES DONNÉES DU PRODUIT =====
  const loadProduct = () => {
    setLoading(true);
    setError("");

    try {
      // Appel au service pour récupérer le produit par son ID
      const productData = productService.getProductById(id);

      if (productData) {
        // Si le produit existe, on le stocke dans l'état
        setProduct(productData);
      } else {
        // Si le produit n'existe pas, on affiche une erreur
        setError("Produit non trouvé");
      }
    } catch (error) {
      // Gestion des erreurs imprévues
      setError("Erreur lors du chargement du produit");
      console.error("Erreur:", error);
    } finally {
      // Désactive le chargement dans tous les cas
      setLoading(false);
    }
  };

  // ===== FONCTION POUR AJOUTER AU PANIER =====
  const handleAddToCart = () => {
    if (product) {
      // Ajoute le produit plusieurs fois selon la quantité sélectionnée
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }

      // Affiche un message de confirmation
      setMessage({
        type: "success",
        text: `Produit ajouté au panier (x${quantity}) !`,
      });
      setQuantity(1); // Réinitialise la quantité à 1
    }
  };

  // ===== FONCTION POUR MODIFIER LA QUANTITÉ =====
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    // Vérifie que la quantité est entre 1 et le stock disponible
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  // ===== AFFICHAGE PENDANT LE CHARGEMENT =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        {/* Spinner de chargement */}
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Chargement du produit...</p>
      </div>
    );
  }

  // ===== AFFICHAGE EN CAS D'ERREUR =====
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            ← Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  // ===== AFFICHAGE SI PRODUIT NON TROUVÉ =====
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-200">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-yellow-600">🔍</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Produit introuvable
          </h2>
          <p className="text-gray-600 mb-6">
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            ← Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  // ===== URL DE L'IMAGE (image du produit ou image par défaut) =====
  const imageUrl =
    product.image ||
    "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // ===== RENDU PRINCIPAL DU COMPOSANT =====
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* === FIL D'ARIANE (BREADCRUMB) === */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-green-600 transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-green-600 transition-colors"
          >
            Produits
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.title}</span>
        </nav>

        {/* === MESSAGE DE SUCCÈS === */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center">
              <span className="text-xl mr-3">
                {message.type === "success" ? "✅" : "❌"}
              </span>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* === GRID PRINCIPAL PRODUIT === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* === COLONNE DE GAUCHE - IMAGE === */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="relative">
              {/* Image principale */}
              <img
                src={imageUrl}
                alt={product.title}
                className="w-full h-96 object-cover rounded-xl"
                onError={(e) => {
                  // Si l'image ne charge pas, on utilise une image par défaut
                  e.target.src =
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                }}
              />

              {/* Badge de disponibilité */}
              {product.available && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ✓ En stock
                </div>
              )}
            </div>
          </div>

          {/* === COLONNE DE DROITE - INFORMATIONS === */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            {/* En-tête du produit */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {product.title}
              </h1>
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            {/* Prix */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-green-600 mb-1">
                {product.price}€
              </div>
              {product.unit && (
                <span className="text-gray-600 text-lg">/{product.unit}</span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Sélecteur de quantité (seulement pour les utilisateurs connectés avec rôle "user") */}
            {isAuthenticated() && hasRole("user") && product.available && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quantité :
                </label>
                <div className="flex items-center gap-4">
                  {/* Contrôles de quantité */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-800 text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={quantity >= (product.stock || 10)}
                    >
                      +
                    </button>
                  </div>

                  {/* Information stock */}
                  {product.stock && (
                    <span className="text-sm text-gray-500">
                      {product.stock} disponibles
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              {/* Bouton d'ajout au panier ou message d'information */}
              {isAuthenticated() && hasRole("user") && product.available ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <span className="text-xl">🛒</span>
                  Ajouter au panier {quantity > 1 && `(x${quantity})`}
                </button>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  {!isAuthenticated() ? (
                    <>
                      <p className="text-gray-600 mb-3">
                        🔒 Connectez-vous pour ajouter ce produit au panier
                      </p>
                      <Link
                        to="/login"
                        className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Se connecter
                      </Link>
                    </>
                  ) : !hasRole("user") ? (
                    <p className="text-gray-600">
                      👨‍🌾 Seuls les clients peuvent acheter des produits
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      ❌ Produit temporairement indisponible
                    </p>
                  )}
                </div>
              )}

              {/* Lien de retour */}
              <Link
                to="/products"
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <span className="mr-2">←</span>
                Retour aux produits
              </Link>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">📦 Référence :</span>
                  <span>#{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">📅 Ajouté le :</span>
                  <span>
                    {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === INFORMATIONS DU VENDEUR === */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>👨‍🌾</span>
            Informations du vendeur
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700">
                <strong>Nom :</strong> {product.sellerName}
              </p>
            </div>
            {product.farmName && (
              <div>
                <p className="text-gray-700">
                  <strong>Exploitation :</strong> {product.farmName}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* === PRODUITS SIMILAIRES === */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>🛍️</span>
            Produits similaires
          </h2>
          <p className="text-gray-600 mb-6">
            Découvrez d'autres produits qui pourraient vous intéresser
          </p>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🌾</div>
            <p className="text-gray-500 mb-4">
              Aucun produit similaire pour le moment
            </p>
            <Link
              to="/products"
              className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Voir tous les produits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default ProductDetail;
