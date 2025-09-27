import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  const imageUrl =
    product.image ||
    "https://via.placeholder.com/300x200?text=Produit+Agricole";

  return (
    <div className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={imageUrl}
        alt={product.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-green-600 font-bold text-xl">
            {product.price}€
          </span>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-3">
          Vendeur: {product.sellerName}
        </p>

        <div className="flex flex-col gap-2">
          <Link
            to={`/product/${product.id}`}
            className="btn btn-primary text-center py-2"
          >
            Voir détails
          </Link>

          {currentUser && currentUser.role === "user" && (
            <button
              onClick={() => addToCart(product)}
              className="btn btn-secondary py-2"
            >
              Ajouter au panier
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
