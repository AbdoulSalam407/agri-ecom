import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { currentUser, isAuthenticated, hasRole } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = () => {
    setLoading(true);
    setError("");

    try {
      const productData = productService.getProductById(id);

      if (productData) {
        setProduct(productData);
      } else {
        setError("Produit non trouvé");
      }
    } catch (error) {
      setError("Erreur lors du chargement du produit");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // Ajouter la quantité spécifiée
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }

      // Feedback visuel
      setMessage({
        type: "success",
        text: `Produit ajouté au panier (x${quantity}) !`,
      });
      setQuantity(1); // Réinitialiser la quantité
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const [message, setMessage] = useState({ type: "", text: "" });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <h2>Erreur</h2>
          <p>{error}</p>
          <Link to="/products" className="btn-primary">
            ← Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-icon">🔍</div>
          <h2>Produit introuvable</h2>
          <p>Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link to="/products" className="btn-primary">
            ← Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl =
    product.image ||
    "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="product-detail-container">
      {/* Fil d'Ariane */}
      <nav className="breadcrumb">
        <Link to="/" className="breadcrumb-link">
          Accueil
        </Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/products" className="breadcrumb-link">
          Produits
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.title}</span>
      </nav>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      <div className="product-detail-grid">
        {/* Galerie d'images */}
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={imageUrl}
              alt={product.title}
              className="product-image"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
              }}
            />
          </div>
          {product.available && (
            <div className="availability-badge available">✓ En stock</div>
          )}
        </div>

        {/* Informations principales */}
        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product.title}</h1>
            <div className="product-category">{product.category}</div>
          </div>

          <div className="product-price">
            <span className="price-amount">{product.price}€</span>
            {product.unit && (
              <span className="price-unit">/{product.unit}</span>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Sélecteur de quantité */}
          {isAuthenticated() && hasRole("user") && product.available && (
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantité :</label>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="quantity-btn"
                  disabled={quantity >= (product.stock || 10)}
                >
                  +
                </button>
              </div>
              {product.stock && (
                <span className="stock-info">{product.stock} disponibles</span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="product-actions">
            {isAuthenticated() && hasRole("user") && product.available ? (
              <button onClick={handleAddToCart} className="add-to-cart-btn">
                🛒 Ajouter au panier {quantity > 1 && `(x${quantity})`}
              </button>
            ) : (
              <div className="purchase-info">
                {!isAuthenticated() ? (
                  <>
                    <p>🔒 Connectez-vous pour ajouter ce produit au panier</p>
                    <Link to="/login" className="login-link">
                      Se connecter
                    </Link>
                  </>
                ) : !hasRole("user") ? (
                  <p>👨‍🌾 Seuls les clients peuvent acheter des produits</p>
                ) : (
                  <p>❌ Produit temporairement indisponible</p>
                )}
              </div>
            )}

            <Link to="/products" className="back-link">
              ← Retour aux produits
            </Link>
          </div>

          {/* Informations supplémentaires */}
          <div className="product-details">
            <div className="detail-item">
              <span className="detail-label">📦 Référence :</span>
              <span className="detail-value">#{product.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">📅 Ajouté le :</span>
              <span className="detail-value">
                {new Date(product.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations du vendeur */}
      <div className="seller-info">
        <h3>👨‍🌾 Informations du vendeur</h3>
        <div className="seller-details">
          <div className="seller-name">
            <strong>Nom :</strong> {product.sellerName}
          </div>
          {product.farmName && (
            <div className="seller-farm">
              <strong>Exploitation :</strong> {product.farmName}
            </div>
          )}
        </div>
      </div>

      {/* Section produits similaires */}
      <div className="related-products">
        <h2>🛍️ Produits similaires</h2>
        <p>Découvrez d'autres produits qui pourraient vous intéresser</p>
        <div className="related-grid">
          {/* Ici vous pourriez ajouter des produits similaires */}
          <div className="related-placeholder">
            <p>Aucun produit similaire pour le moment</p>
            <Link to="/products" className="btn-secondary">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
