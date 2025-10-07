// Importation de React et des hooks
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { addToCart } = useCart();

  // Charger le produit au montage
  useEffect(() => {
    setLoading(true);
    setError("");
    try {
      const data = productService.getProductById(id);
      if (data) setProduct(data);
      else setError("Produit non trouvé");
    } catch (err) {
      setError("Erreur lors du chargement du produit");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fonction : ajout au panier
  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) addToCart(product);
      setMessage({
        type: "success",
        text: `✅ ${quantity} ${
          quantity > 1 ? "articles ajoutés" : "article ajouté"
        } au panier !`,
      });
      setQuantity(1);
    }
  };

  // Gérer la quantité
  const handleQuantityChange = (change) => {
    const newQty = quantity + change;
    if (newQty >= 1 && newQty <= (product?.stock || 10)) setQuantity(newQty);
  };

  // États : chargement / erreur
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
        <p>Chargement du produit...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <div className="text-5xl mb-3">❌</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/products"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ← Retour aux produits
          </Link>
        </div>
      </div>
    );

  if (!product) return null;

  const imageUrl =
    product.image ||
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Fil d’Ariane */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-green-600">
            Accueil
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-green-600">
            Produits
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.title}</span>
        </nav>

        {/* Message de confirmation */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image produit */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-96 object-cover rounded-xl"
              onError={(e) =>
                (e.target.src =
                  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80")
              }
            />
            {product.available && (
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ✓ En stock
              </div>
            )}
          </div>

          {/* Infos produit */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.title}
            </h1>
            <p className="text-gray-600 mb-4">{product.category}</p>
            <div className="text-4xl font-bold text-green-600 mb-4">
              {product.price}€
              {product.unit && (
                <span className="text-lg text-gray-600">/{product.unit}</span>
              )}
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Sélecteur de quantité */}
            {product.available && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Quantité :
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full font-bold"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full font-bold"
                    disabled={quantity >= (product.stock || 10)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Bouton ajouter au panier */}
            {product.available ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-transform transform hover:scale-105"
              >
                🛒 Ajouter au panier {quantity > 1 && `(x${quantity})`}
              </button>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-600">
                  ❌ Produit temporairement indisponible
                </p>
              </div>
            )}

            {/* Lien retour */}
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center text-gray-600 hover:text-gray-800"
              >
                ← Retour aux produits
              </Link>
            </div>
          </div>
        </div>

        {/* Informations vendeur */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            👨‍🌾 Informations du vendeur
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <strong>Nom :</strong> {product.sellerName}
            </p>
            {product.farmName && (
              <p>
                <strong>Exploitation :</strong> {product.farmName}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
