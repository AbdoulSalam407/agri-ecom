// Importation de React et du hook useState pour gérer l'état local du formulaire
import React, { useState } from "react";

// Importation des catégories depuis un fichier JSON
import categories from "../data/categories.json";

// Définition du composant ProductForm (formulaire d'ajout/modification de produit)
// Il reçoit deux props :
// - onSubmit: fonction à appeler quand le formulaire est soumis
// - initialData: données initiales pour pré-remplir le formulaire (vide par défaut)
const ProductForm = ({ onSubmit, initialData = {} }) => {
  // États pour chaque champ du formulaire avec valeurs initiales
  // Si initialData existe, on utilise ses valeurs, sinon on utilise des chaînes vides

  // État pour le titre du produit
  const [title, setTitle] = useState(initialData.title || "");

  // État pour la description du produit
  const [description, setDescription] = useState(initialData.description || "");

  // État pour le prix du produit
  const [price, setPrice] = useState(initialData.price || "");

  // État pour l'URL de l'image du produit
  const [image, setImage] = useState(initialData.image || "");

  // État pour la catégorie du produit
  const [category, setCategory] = useState(initialData.category || "");

  // Fonction appelée quand le formulaire est soumis
  const handleSubmit = (e) => {
    // Empêche le rechargement de la page (comportement par défaut des formulaires)
    e.preventDefault();

    // Création de l'objet produit avec toutes les données
    const newProduct = {
      // Si on modifie un produit existant, on garde son ID, sinon on en génère un nouveau
      id: initialData.id || Date.now(),
      title, // Titre saisi par l'utilisateur
      description, // Description saisie par l'utilisateur
      price: parseInt(price), // Conversion du prix en nombre entier
      image, // URL de l'image
      category, // Catégorie sélectionnée
      ownerId: initialData.ownerId || 1, // À remplacer par l'ID du producteur connecté
    };

    // Appel de la fonction onSubmit passée en prop avec le nouveau produit
    onSubmit(newProduct);

    // Réinitialisation du formulaire seulement si c'est un nouvel ajout (pas une modification)
    if (!initialData.id) {
      setTitle("");
      setDescription("");
      setPrice("");
      setImage("");
      setCategory("");
    }
  };

  // Rendu du composant
  return (
    // Formulaire avec styles Tailwind
    <form
      onSubmit={handleSubmit} // Quand le formulaire est soumis, appelle handleSubmit
      className="bg-white p-8 rounded-xl shadow-lg space-y-6 max-w-lg mx-auto border border-gray-100"
    >
      {/* Titre du formulaire (change selon ajout ou modification) */}
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        {initialData.id ? "Modifier un produit" : "Ajouter un produit"}
      </h2>

      {/* === CHAMP TITRE === */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Titre du produit *
        </label>
        <input
          type="text"
          placeholder="Ex: Tomates fraîches bio"
          value={title} // Valeur contrôlée par l'état title
          onChange={(e) => setTitle(e.target.value)} // Met à jour l'état title à chaque frappe
          required // Champ obligatoire
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
        />
      </div>

      {/* === CHAMP DESCRIPTION === */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          placeholder="Décrivez votre produit en détail..."
          value={description} // Valeur contrôlée par l'état description
          onChange={(e) => setDescription(e.target.value)} // Met à jour l'état description
          required // Champ obligatoire
          rows="4" // Hauteur fixe de 4 lignes
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-vertical"
        />
      </div>

      {/* === CHAMP PRIX === */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Prix (FCFA) *
        </label>
        <input
          type="number"
          placeholder="Ex: 1500"
          value={price} // Valeur contrôlée par l'état price
          onChange={(e) => setPrice(e.target.value)} // Met à jour l'état price
          required // Champ obligatoire
          min="1" // Prix minimum de 1 FCFA
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
        />
      </div>

      {/* === CHAMP IMAGE === */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          URL de l'image *
        </label>
        <input
          type="text"
          placeholder="https://exemple.com/image.jpg"
          value={image} // Valeur contrôlée par l'état image
          onChange={(e) => setImage(e.target.value)} // Met à jour l'état image
          required // Champ obligatoire
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
        />
      </div>

      {/* === CHAMP CATÉGORIE (SELECT) === */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Catégorie *
        </label>
        <select
          value={category} // Valeur contrôlée par l'état category
          onChange={(e) => setCategory(e.target.value)} // Met à jour l'état category
          required // Champ obligatoire
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
        >
          {/* Option par défaut (vide) */}
          <option value="" className="text-gray-400">
            -- Choisir une catégorie --
          </option>
          {/* Boucle sur toutes les catégories importées */}
          {categories.map((cat) => (
            <option
              key={cat.id} // Clé unique pour React
              value={cat.name} // Valeur de l'option = nom de la catégorie
              className="text-gray-700"
            >
              {cat.name} {/* Texte affiché pour l'option */}
            </option>
          ))}
        </select>
      </div>

      {/* === BOUTON DE SOUMISSION === */}
      <button
        type="submit" // Type submit pour soumettre le formulaire
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {/* Texte du bouton change selon ajout ou modification */}
        {initialData.id ? "Mettre à jour le produit" : "Ajouter le produit"}
      </button>
    </form>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default ProductForm;
