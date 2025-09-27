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
  const { currentUser } = useAuth();
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
      addToCart(product);
      alert("Produit ajouté au panier !");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Chargement du produit...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link to="/products" className="btn btn-primary mt-4">
          ← Retour aux produits
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Produit introuvable
        </div>
        <Link to="/products" className="btn btn-primary mt-4">
          ← Retour aux produits
        </Link>
      </div>
    );
  }

  const imageUrl =
    product.image ||
    "https://via.placeholder.com/500x300?text=Produit+Agricole";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Fil d'Ariane */}
      <nav className="mb-6">
        <Link to="/" className="text-green-600 hover:underline">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="text-green-600 hover:underline">
          Produits
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-500">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image du produit */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Informations du produit */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          <div className="mb-4">
            <span className="text-2xl font-bold text-green-600">
              {product.price}€
            </span>
            {product.unit && (
              <span className="text-gray-600 ml-2">/ {product.unit}</span>
            )}
          </div>

          <div className="mb-4">
            <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
              {product.category}
            </span>
            {product.available && (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full ml-2">
                ✓ En stock
              </span>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Informations du vendeur */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Informations du vendeur</h3>
            <p className="text-gray-700">
              <strong>Nom :</strong> {product.sellerName}
            </p>
            {product.farmName && (
              <p className="text-gray-700">
                <strong>Exploitation :</strong> {product.farmName}
              </p>
            )}
          </div>

          {/* Détails supplémentaires */}
          <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Référence :</strong> #{product.id}
            </div>
            {product.stock && (
              <div>
                <strong>Stock disponible :</strong> {product.stock}{" "}
                {product.unit}
              </div>
            )}
            <div>
              <strong>Ajouté le :</strong>{" "}
              {new Date(product.createdAt).toLocaleDateString("fr-FR")}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {currentUser && currentUser.role === "user" && (
              <button
                onClick={handleAddToCart}
                className="btn btn-primary flex-1 py-3 text-lg"
                disabled={!product.available}
              >
                🛒 Ajouter au panier
              </button>
            )}

            {(!currentUser || currentUser.role !== "user") && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-3 rounded text-center">
                {!currentUser
                  ? "Connectez-vous pour ajouter au panier"
                  : "Seuls les clients peuvent acheter des produits"}
              </div>
            )}

            <Link
              to="/products"
              className="btn btn-secondary py-3 text-lg text-center"
            >
              ← Retour aux produits
            </Link>
          </div>
        </div>
      </div>

      {/* Produits similaires (optionnel) */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
        {/* Vous pourriez ajouter une fonction pour trouver des produits similaires */}
      </div>
    </div>
  );
};

export default ProductDetail;
