import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/productService";
import initialProducts from "../data/products.json";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);

    let productsData = productService.getProducts();

    // Appliquer les filtres si présents
    if (searchTerm || selectedCategory) {
      productsData = productService.searchProducts(
        searchTerm,
        selectedCategory
      );
    }

    setProducts(productsData);
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    loadProducts();
  };

  const forceResetProducts = () => {
    productService.saveProducts(initialProducts);
    loadProducts();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="product-list-page">
      {/* En-tête de la page */}
      <div className="page-header">
        <h1 className="page-title">Nos Produits Frais</h1>
        <p className="page-subtitle">
          Découvrez tous nos produits directement issus de l'agriculture locale
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-group">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍 Rechercher
            </button>
          </div>

          <div className="filters-group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="">Toutes les catégories</option>
              <option value="légumes">🥕 Légumes</option>
              <option value="fruits">🍎 Fruits</option>
              <option value="viandes">🥩 Viandes</option>
              <option value="produits laitiers">🧀 Produits laitiers</option>
              <option value="œufs">🥚 Œufs</option>
              <option value="céréales">🌾 Céréales</option>
            </select>

            <button
              type="button"
              onClick={handleReset}
              className="reset-button"
            >
              🔄 Réinitialiser
            </button>
          </div>
        </form>
      </div>

      {/* Message d'alerte si problème */}
      {products.length !== initialProducts.length &&
        !searchTerm &&
        !selectedCategory && (
          <div className="alert-warning">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <p className="alert-title">Problème détecté</p>
              <p className="alert-message">
                {products.length} produit(s) affiché(s) au lieu de{" "}
                {initialProducts.length}
              </p>
            </div>
            <button onClick={forceResetProducts} className="alert-button">
              Réinitialiser les données
            </button>
          </div>
        )}

      {/* Résultats de la recherche */}
      <div className="results-info">
        <p className="results-count">
          {products.length} produit(s) trouvé(s)
          {searchTerm && ` pour "${searchTerm}"`}
          {selectedCategory && ` dans la catégorie "${selectedCategory}"`}
        </p>
        <Link to="/cart" className="cart-link">
          🛒 Voir mon panier
        </Link>
      </div>

      {/* Grille des produits */}
      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h3 className="empty-title">Aucun produit trouvé</h3>
          <p className="empty-message">
            {searchTerm || selectedCategory
              ? "Essayez de modifier vos critères de recherche"
              : "Nos producteurs préparent de nouveaux produits frais"}
          </p>
          {(searchTerm || selectedCategory) && (
            <button onClick={handleReset} className="empty-button">
              Voir tous les produits
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Bouton pour voir plus de produits */}
          <div className="load-more-section">
            <p>Vous avez vu tous nos produits disponibles</p>
            <Link to="/" className="home-link">
              ← Retour à l'accueil
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
