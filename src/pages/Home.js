import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadProducts = () => {
      const allProducts = productService.getProducts();
      setProducts(allProducts.slice(0, 6)); // Afficher seulement 6 produits
      setLoading(false);
    };

    loadProducts();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="home">
      <section className="hero">
        <h1>Bienvenue sur AgriEcom</h1>
        <p>La plateforme qui connecte producteurs et acheteurs</p>
        {!currentUser && (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              Créer un compte
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Voir les produits
            </Link>
          </div>
        )}
      </section>

      <section className="featured-products">
        <h2>Produits récents</h2>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link to="/products" className="btn btn-primary">
          Voir tous les produits
        </Link>
      </section>
    </div>
  );
};

export default Home;
