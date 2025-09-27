const PRODUCTS_KEY = "agriecom_products";

export const productService = {
  // Récupérer tous les produits
  getProducts: () => {
    const products = localStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  },

  // Sauvegarder les produits
  saveProducts: (products) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  // Récupérer un produit par ID
  getProductById: (id) => {
    const products = productService.getProducts();
    return products.find((product) => product.id === id);
  },

  // Récupérer les produits d'un utilisateur
  getUserProducts: (userId) => {
    const products = productService.getProducts();
    return products.filter((product) => product.sellerId === userId);
  },

  // Ajouter un produit
  addProduct: (productData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = productService.getProducts();
        const newProduct = {
          id: Date.now().toString(),
          ...productData,
          createdAt: new Date().toISOString(),
        };

        const updatedProducts = [...products, newProduct];
        productService.saveProducts(updatedProducts);
        resolve(newProduct);
      }, 500);
    });
  },

  // Mettre à jour un produit
  updateProduct: (productId, productData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = productService.getProducts();
        const updatedProducts = products.map((product) =>
          product.id === productId ? { ...product, ...productData } : product
        );

        productService.saveProducts(updatedProducts);
        resolve(updatedProducts.find((product) => product.id === productId));
      }, 500);
    });
  },

  // Supprimer un produit
  deleteProduct: (productId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = productService.getProducts();
        const updatedProducts = products.filter(
          (product) => product.id !== productId
        );
        productService.saveProducts(updatedProducts);
        resolve(true);
      }, 500);
    });
  },

  // Rechercher des produits
  searchProducts: (query, category = "") => {
    const products = productService.getProducts();
    return products.filter((product) => {
      const matchesQuery =
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || product.category === category;
      return matchesQuery && matchesCategory;
    });
  },
};
