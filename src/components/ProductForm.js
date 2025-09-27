import React, { useState } from "react";
import categories from "../data/categories.json";

const ProductForm = ({ onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [price, setPrice] = useState(initialData.price || "");
  const [image, setImage] = useState(initialData.image || "");
  const [category, setCategory] = useState(initialData.category || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id: initialData.id || Date.now(),
      title,
      description,
      price: parseInt(price),
      image,
      category,
      ownerId: initialData.ownerId || 1 // à remplacer par l'ID du producteur connecté
    };

    onSubmit(newProduct);

    // Réinitialiser le formulaire si ajout
    if (!initialData.id) {
      setTitle("");
      setDescription("");
      setPrice("");
      setImage("");
      setCategory("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold text-center">
        {initialData.id ? "Modifier un produit" : "Ajouter un produit"}
      </h2>

      {/* Titre */}
      <input
        type="text"
        placeholder="Titre du produit"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      {/* Prix */}
      <input
        type="number"
        placeholder="Prix en FCFA"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      {/* Image */}
      <input
        type="text"
        placeholder="URL de l'image"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      {/* Catégorie */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full border p-2 rounded"
      >
        <option value="">-- Choisir une catégorie --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Bouton */}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {initialData.id ? "Mettre à jour" : "Ajouter"}
      </button>
    </form>
  );
};

export default ProductForm;
