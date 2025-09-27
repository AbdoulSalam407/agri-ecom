import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./assets/styles/global.css";

// Initialisation des données AVANT le rendu
import { authService } from "./services/authService";
import { productService } from "./services/productService";
import initialUsers from "./data/users.json";
import initialProducts from "./data/products.json";

// Charger les données initiales si elles n'existent pas
if (!localStorage.getItem("agriecom_users")) {
  authService.saveUsers(initialUsers);
}

if (!localStorage.getItem("agriecom_products")) {
  productService.saveProducts(initialProducts);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);