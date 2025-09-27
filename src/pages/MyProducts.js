import React, { useState } from "react";
import ProductForm from "../components/ProductForm";

const MyProducts = () => {
  const [products, setProducts] = useState([]);

  const addProduct = (newProduct) => {
    setProducts([...products, { id: Date.now(), ...newProduct }]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Produits</h1>
      <ProductForm onSave={addProduct} />
      <ul className="mt-6">
        {products.map((p) => (
          <li key={p.id}>
            {p.title} - {p.price} FCFA
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProducts;
