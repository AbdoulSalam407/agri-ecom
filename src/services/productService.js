// Clé pour stocker les produits dans le localStorage du navigateur
// Le localStorage est comme un petit coffre-fort dans le navigateur qui garde les données même après fermeture
const PRODUCTS_KEY = "agriecom_products";

// Exportation de l'objet productService qui contient toutes les fonctions pour gérer les produits
export const productService = {
  // ===== FONCTION POUR RÉCUPÉRER TOUS LES PRODUITS =====
  // Cette fonction lit tous les produits stockés dans le localStorage
  getProducts: () => {
    // Récupère les produits depuis le localStorage
    const products = localStorage.getItem(PRODUCTS_KEY);

    // Si des produits existent, les convertit de JSON en objet JavaScript
    // Sinon, retourne un tableau vide
    return products ? JSON.parse(products) : [];
  },

  // ===== FONCTION POUR SAUVEGARDER LES PRODUITS =====
  // Cette fonction enregistre la liste des produits dans le localStorage
  saveProducts: (products) => {
    // Convertit le tableau de produits en chaîne JSON et le sauvegarde
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  // ===== FONCTION POUR RÉCUPÉRER UN PRODUIT SPÉCIFIQUE PAR SON ID =====
  // Cette fonction trouve un produit particulier grâce à son identifiant unique
  getProductById: (id) => {
    // Récupère tous les produits
    const products = productService.getProducts();

    // Utilise la méthode find() pour chercher le produit avec l'ID correspondant
    // find() s'arrête dès qu'il trouve un produit qui correspond à la condition
    return products.find((product) => product.id === id);
  },

  // ===== FONCTION POUR RÉCUPÉRER LES PRODUITS D'UN UTILISATEUR SPÉCIFIQUE =====
  // Cette fonction retourne seulement les produits créés par un vendeur particulier
  getUserProducts: (userId) => {
    // Récupère tous les produits
    const products = productService.getProducts();

    // Utilise filter() pour garder seulement les produits du vendeur spécifié
    // filter() crée un nouveau tableau avec tous les éléments qui passent le test
    return products.filter((product) => product.sellerId === userId);
  },

  // ===== FONCTION POUR AJOUTER UN NOUVEAU PRODUIT =====
  // Cette fonction crée un nouveau produit et l'ajoute à la liste
  addProduct: (productData) => {
    // Retourne une Promise pour gérer l'opération asynchrone
    return new Promise((resolve) => {
      // Simule un délai de réseau de 500ms (comme une vraie API)
      setTimeout(() => {
        // Récupère la liste actuelle des produits
        const products = productService.getProducts();

        // Crée un nouvel objet produit avec toutes les données nécessaires
        const newProduct = {
          id: Date.now().toString(), // Génère un ID unique basé sur l'heure actuelle
          ...productData, // Copie toutes les données du formulaire
          createdAt: new Date().toISOString(), // Ajoute la date/heure de création
        };

        // Crée un nouveau tableau avec l'ancienne liste + le nouveau produit
        const updatedProducts = [...products, newProduct];

        // Sauvegarde la nouvelle liste dans le localStorage
        productService.saveProducts(updatedProducts);

        // Retourne le nouveau produit créé
        resolve(newProduct);
      }, 500); // Délai de 500 millisecondes
    });
  },

  // ===== FONCTION POUR METTRE À JOUR UN PRODUIT EXISTANT =====
  // Cette fonction modifie les informations d'un produit déjà existant
  updateProduct: (productId, productData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Récupère tous les produits
        const products = productService.getProducts();

        // Utilise map() pour créer un nouveau tableau
        // Pour chaque produit :
        // - Si c'est le produit à modifier, on le met à jour avec les nouvelles données
        // - Sinon, on garde le produit tel quel
        const updatedProducts = products.map(
          (product) =>
            product.id === productId
              ? { ...product, ...productData } // Fusionne l'ancien produit avec les nouvelles données
              : product // Garde les autres produits inchangés
        );

        // Sauvegarde la liste mise à jour
        productService.saveProducts(updatedProducts);

        // Trouve et retourne le produit mis à jour
        resolve(updatedProducts.find((product) => product.id === productId));
      }, 500);
    });
  },

  // ===== FONCTION POUR SUPPRIMER UN PRODUIT =====
  // Cette fonction retire un produit de la liste
  deleteProduct: (productId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Récupère tous les produits
        const products = productService.getProducts();

        // Utilise filter() pour créer un nouveau tableau sans le produit à supprimer
        // filter() garde seulement les produits dont l'ID est DIFFÉRENT de productId
        const updatedProducts = products.filter(
          (product) => product.id !== productId
        );

        // Sauvegarde la nouvelle liste (sans le produit supprimé)
        productService.saveProducts(updatedProducts);

        // Retourne true pour indiquer que la suppression a réussi
        resolve(true);
      }, 500);
    });
  },

  // ===== FONCTION POUR RECHERCHER DES PRODUITS =====
  // Cette fonction permet de filtrer les produits selon un mot-clé et/ou une catégorie
  searchProducts: (query, category = "") => {
    // Récupère tous les produits
    const products = productService.getProducts();

    // Utilise filter() pour garder seulement les produits qui correspondent aux critères
    return products.filter((product) => {
      // Vérifie si le produit correspond au mot-clé de recherche
      // Convertit tout en minuscules pour une recherche insensible à la casse
      const matchesQuery =
        product.title.toLowerCase().includes(query.toLowerCase()) || // Cherche dans le titre
        product.description.toLowerCase().includes(query.toLowerCase()); // Cherche dans la description

      // Vérifie si le produit correspond à la catégorie sélectionnée
      // Si aucune catégorie n'est spécifiée (category vide), ça retourne true
      const matchesCategory = !category || product.category === category;

      // Le produit est gardé seulement s'il correspond AUX DEUX critères
      return matchesQuery && matchesCategory;
    });
  },
};
