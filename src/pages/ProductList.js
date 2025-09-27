import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/productService";
import initialProducts from "../data/products.json";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    debugData();
    loadProducts();
  }, []);

  // FONCTION DE DIAGNOSTIC
  const debugData = () => {
    console.log("=== DIAGNOSTIC DES DONNÉES ===");

    // Vérifier les données initiales
    console.log("Données initiales (JSON):", initialProducts);
    console.log("Nombre dans JSON:", initialProducts.length);

    // Vérifier le localStorage
    const storedProducts = localStorage.getItem("agriecom_products");
    console.log("Données dans localStorage:", storedProducts);

    if (storedProducts) {
      const parsed = JSON.parse(storedProducts);
      console.log("Nombre dans localStorage:", parsed.length);
      console.log("Détail des produits:", parsed);
    }

    // Vérifier le service
    const serviceProducts = productService.getProducts();
    console.log("Produits du service:", serviceProducts);
    console.log("Nombre du service:", serviceProducts.length);

    console.log("=== FIN DIAGNOSTIC ===");
  };

  const loadProducts = () => {
    setLoading(true);

    let productsData = productService.getProducts();
    console.log("Produits à afficher:", productsData);

    // SI AUCUN PRODUIT, FORCER L'INITIALISATION
    if (productsData.length === 0) {
      console.log("Aucun produit trouvé, initialisation...");
      productService.saveProducts(initialProducts);
      productsData = initialProducts;
    }

    setProducts(productsData);
    setLoading(false);
  };

  // FONCTION DE RÉINITIALISATION FORCÉE
  const forceResetProducts = () => {
    console.log("Réinitialisation forcée...");
    productService.saveProducts(initialProducts);
    loadProducts();
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Tous les Produits ({products.length})
      </h1>

      {/* MESSAGE D'ALERTE SI PROBLÈME */}
      {products.length !== initialProducts.length && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700">
            ⚠️ Problème détecté : {products.length} produit(s) affiché(s) au
            lieu de {initialProducts.length}
          </p>
          <button onClick={forceResetProducts} className="btn btn-warning mt-2">
            🔄 Forcer la réinitialisation des données
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
