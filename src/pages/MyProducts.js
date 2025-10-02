// Importation de React et du hook useState pour gérer l'état local
import React, { useState } from "react";

// Importation du composant ProductForm pour ajouter/modifier des produits
import ProductForm from "../components/ProductForm";

// Définition du composant MyProducts (page des produits du producteur)
const MyProducts = () => {
  // État pour stocker la liste des produits du producteur
  // Initialisé avec un tableau vide
  const [products, setProducts] = useState([]);

  // ===== FONCTION POUR AJOUTER UN NOUVEAU PRODUIT =====
  const addProduct = (newProduct) => {
    // Met à jour la liste des produits en ajoutant le nouveau produit
    // Date.now() génère un ID unique basé sur le timestamp actuel
    setProducts([...products, { id: Date.now(), ...newProduct }]);
  };

  // ===== FONCTION POUR SUPPRIMER UN PRODUIT =====
  const deleteProduct = (productId) => {
    // Filtre la liste pour garder tous les produits SAUF celui avec l'ID à supprimer
    setProducts(products.filter(product => product.id !== productId));
  };

  // ===== FONCTION POUR MODIFIER UN PRODUIT =====
  const updateProduct = (updatedProduct) => {
    // Met à jour le produit spécifique dans la liste
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  // ===== CALCUL DES STATISTIQUES =====
  
  // Nombre total de produits
  const totalProducts = products.length;
  
  // Chiffre d'affaires total (somme de tous les prix)
  const totalRevenue = products.reduce((total, product) => total + product.price, 0);
  
  // Produit le plus cher
  const mostExpensiveProduct = products.length > 0 
    ? products.reduce((max, product) => product.price > max.price ? product : max)
    : null;

  // ===== RENDU PRINCIPAL DU COMPOSANT =====
  return (
    // Conteneur principal avec fond gris clair
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* === EN-TÊTE DE LA PAGE === */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Mes Produits
              </h1>
              <p className="text-gray-600">
                Gérez votre inventaire de produits agricoles
              </p>
            </div>
            
            {/* Statistiques rapides */}
            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalProducts}</div>
                <div className="text-sm text-gray-500">Produits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalRevenue} FCFA</div>
                <div className="text-sm text-gray-500">Valeur totale</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === COLONNE DE GAUCHE - FORMULAIRE D'AJOUT === */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Ajouter un produit
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Remplissez les informations de votre nouveau produit agricole
              </p>
              
              {/* Composant ProductForm pour ajouter des produits */}
              <ProductForm onSubmit={addProduct} />
            </div>
          </div>

          {/* === COLONNE DE DROITE - LISTE DES PRODUITS === */}
          <div className="lg:col-span-2">
            
            {/* En-tête de la liste */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Mes produits en vente
                </h2>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {products.length} produit(s)
                </span>
              </div>
            </div>

            {/* === AFFICHAGE CONDITIONNEL === */}
            
            {/* Si aucun produit n'existe */}
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
                <div className="text-6xl mb-4">🌾</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Aucun produit pour le moment
                </h3>
                <p className="text-gray-600 mb-6">
                  Commencez par ajouter votre premier produit en utilisant le formulaire à gauche.
                </p>
                <div className="text-sm text-gray-500">
                  Vos produits apparaîtront ici une fois ajoutés
                </div>
              </div>
            ) : (
              /* === LISTE DES PRODUITS EXISTANTS === */
              <div className="space-y-4">
                {products.map((product) => (
                  // Carte pour chaque produit
                  <div 
                    key={product.id} 
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      
                      {/* Image du produit */}
                      <div className="flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Informations du produit */}
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                              {product.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              {product.price} FCFA
                            </div>
                            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {product.category}
                            </span>
                          </div>
                        </div>

                        {/* Métriques du produit */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <span>📅</span>
                            <span>Ajouté récemment</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>🏷️</span>
                            <span>En stock</span>
                          </div>
                        </div>

                        {/* Actions sur le produit */}
                        <div className="flex flex-wrap gap-2">
                          {/* Bouton Modifier */}
                          <button 
                            onClick={() => {/* Fonction de modification à implémenter */}}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                          >
                            <span>✏️</span>
                            Modifier
                          </button>
                          
                          {/* Bouton Supprimer */}
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                          >
                            <span>🗑️</span>
                            Supprimer
                          </button>
                          
                          {/* Bouton Voir les détails */}
                          <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2">
                            <span>👁️</span>
                            Voir détails
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* === PRODUIT LE PLUS CHER === */}
            {mostExpensiveProduct && (
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🏆</span>
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Produit le plus valorisé
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-yellow-800">
                      {mostExpensiveProduct.title}
                    </p>
                    <p className="text-yellow-700 text-sm">
                      {mostExpensiveProduct.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-yellow-800">
                      {mostExpensiveProduct.price} FCFA
                    </p>
                    <p className="text-yellow-700 text-sm">Prix unitaire</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default MyProducts;