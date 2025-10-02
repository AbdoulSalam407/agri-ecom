// Importation de React et des hooks useEffect et useState
import React, { useEffect, useState } from "react";

// Importation des composants de navigation React Router
import { Link } from "react-router-dom";

// Importation du composant ProductCard pour afficher chaque produit
import ProductCard from "../components/ProductCard";

// Importation du service pour gérer les produits
import { productService } from "../services/productService";

// Importation des données initiales des produits depuis un fichier JSON
import initialProducts from "../data/products.json";

// Définition du composant ProductList (page liste des produits)
const ProductList = () => {
  // ===== ÉTATS POUR GÉRER LES DONNÉES ET L'INTERFACE =====

  // État pour stocker la liste des produits à afficher
  const [products, setProducts] = useState([]);

  // État pour gérer l'affichage du chargement
  const [loading, setLoading] = useState(true);

  // État pour stocker le terme de recherche
  const [searchTerm, setSearchTerm] = useState("");

  // État pour stocker la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState("");

  // ===== EFFET POUR CHARGER LES PRODUITS AU DÉMARRAGE =====
  useEffect(() => {
    loadProducts();
  }, []); // Le tableau vide [] signifie que cet effet ne s'exécute qu'une fois au démarrage

  // ===== FONCTION POUR CHARGER LES PRODUITS =====
  const loadProducts = () => {
    setLoading(true);

    // Récupère tous les produits depuis le service
    let productsData = productService.getProducts();

    // Applique les filtres si un terme de recherche ou une catégorie est sélectionné
    if (searchTerm || selectedCategory) {
      productsData = productService.searchProducts(
        searchTerm,
        selectedCategory
      );
    }

    // Met à jour l'état avec les produits filtrés
    setProducts(productsData);
    setLoading(false);
  };

  // ===== FONCTION POUR LANCER LA RECHERCHE =====
  const handleSearch = (e) => {
    // Empêche le rechargement de la page
    e.preventDefault();
    // Relance le chargement des produits avec les filtres
    loadProducts();
  };

  // ===== FONCTION POUR RÉINITIALISER LES FILTRES =====
  const handleReset = () => {
    // Réinitialise les états de recherche
    setSearchTerm("");
    setSelectedCategory("");
    // Recharge tous les produits sans filtre
    loadProducts();
  };

  // ===== FONCTION POUR FORCER LA RÉINITIALISATION DES DONNÉES =====
  const forceResetProducts = () => {
    // Sauvegarde les produits initiaux dans le service
    productService.saveProducts(initialProducts);
    // Recharge les produits
    loadProducts();
  };

  // ===== AFFICHAGE PENDANT LE CHARGEMENT =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        {/* Spinner de chargement */}
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Chargement des produits...</p>
      </div>
    );
  }

  // ===== RENDU PRINCIPAL DU COMPOSANT =====
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* === EN-TÊTE DE LA PAGE === */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Nos Produits Frais
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez tous nos produits directement issus de l'agriculture
            locale
          </p>
        </div>

        {/* === BARRE DE RECHERCHE ET FILTRES === */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Groupe de recherche */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Champ de recherche */}
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Rechercher un produit (tomates, lait, œufs...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>

              {/* Bouton de recherche */}
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                <span>🔍</span>
                Rechercher
              </button>
            </div>

            {/* Groupe de filtres */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Sélecteur de catégorie */}
              <div className="flex-grow">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                >
                  <option value="">🥕 Toutes les catégories</option>
                  <option value="légumes">🥕 Légumes</option>
                  <option value="fruits">🍎 Fruits</option>
                  <option value="viandes">🥩 Viandes</option>
                  <option value="produits laitiers">
                    🧀 Produits laitiers
                  </option>
                  <option value="œufs">🥚 Œufs</option>
                  <option value="céréales">🌾 Céréales</option>
                </select>
              </div>

              {/* Bouton réinitialiser */}
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                <span>🔄</span>
                Réinitialiser
              </button>
            </div>
          </form>
        </div>

        {/* === MESSAGE D'ALERTE SI PROBLÈME DE DONNÉES === */}
        {products.length !== initialProducts.length &&
          !searchTerm &&
          !selectedCategory && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-yellow-800">
                      Problème détecté
                    </p>
                    <p className="text-yellow-700 text-sm">
                      {products.length} produit(s) affiché(s) au lieu de{" "}
                      {initialProducts.length}
                    </p>
                  </div>
                </div>
                <button
                  onClick={forceResetProducts}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  Réinitialiser les données
                </button>
              </div>
            </div>
          )}

        {/* === INFORMATIONS SUR LES RÉSULTATS === */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          {/* Compteur de résultats */}
          <p className="text-gray-700 font-medium">
            {products.length} produit(s) trouvé(s)
            {searchTerm && (
              <span className="text-green-600"> pour "{searchTerm}"</span>
            )}
            {selectedCategory && (
              <span className="text-green-600"> dans "{selectedCategory}"</span>
            )}
          </p>

          {/* Lien vers le panier */}
          <Link
            to="/cart"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
          >
            <span>🛒</span>
            Voir mon panier
          </Link>
        </div>

        {/* === GRILLE DES PRODUITS === */}

        {/* Si aucun produit n'est trouvé */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCategory
                ? "Essayez de modifier vos critères de recherche"
                : "Nos producteurs préparent de nouveaux produits frais"}
            </p>

            {/* Bouton pour réinitialiser si des filtres sont actifs */}
            {(searchTerm || selectedCategory) && (
              <button
                onClick={handleReset}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Voir tous les produits
              </button>
            )}
          </div>
        ) : (
          /* === AFFICHAGE DE LA GRILLE DES PRODUITS === */
          <>
            {/* Grille des produits */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Section de fin de liste */}
            <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <p className="text-gray-600 mb-4 text-lg">
                {products.length === 1
                  ? "Vous avez vu notre seul produit disponible"
                  : `Vous avez vu tous nos ${products.length} produits disponibles`}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center"
                >
                  <span>←</span>
                  Retour à l'accueil
                </Link>
                <button
                  onClick={handleReset}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Voir tous les produits
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default ProductList;
