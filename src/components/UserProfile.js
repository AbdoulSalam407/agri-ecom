// Importation de React et des hooks useContext et useState
import React, { useContext, useState } from "react";

// Importation du contexte d'authentification pour accéder aux données utilisateur
import { AuthContext } from "../context/AuthContext";

// Définition du composant UserProfile (page de profil utilisateur)
const UserProfile = () => {
  // Récupération des données et fonctions du contexte d'authentification
  // user: contient les informations de l'utilisateur connecté (ou null si déconnecté)
  // login: fonction pour mettre à jour les données de l'utilisateur
  const { user, login } = useContext(AuthContext);

  // États pour gérer les champs du formulaire d'édition
  // Ces états sont initialisés avec les valeurs actuelles de l'utilisateur
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "acheteur");

  // État pour gérer le mode édition (true = mode modification, false = mode affichage)
  const [editing, setEditing] = useState(false);

  // Fonction appelée quand on sauvegarde les modifications du profil
  const handleSave = (e) => {
    // Empêche le rechargement de la page
    e.preventDefault();

    // Création d'un objet utilisateur mis à jour avec les nouvelles valeurs
    const updatedUser = {
      ...user, // Conserve toutes les propriétés existantes de l'utilisateur
      username, // Nouveau nom d'utilisateur
      email, // Nouvel email
      role, // Nouveau rôle
    };

    // Met à jour l'utilisateur dans le contexte d'authentification
    login(updatedUser.username, updatedUser.role);

    // Sauvegarde l'utilisateur mis à jour dans le localStorage pour persister les données
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Quitte le mode édition
    setEditing(false);

    // Affiche un message de confirmation
    alert("Profil mis à jour avec succès ✅");
  };

  // Si aucun utilisateur n'est connecté, affiche un message
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            Accès non autorisé
          </h2>
          <p className="text-yellow-600">
            Veuillez vous connecter pour voir votre profil.
          </p>
        </div>
      </div>
    );
  }

  // Rendu principal du composant
  return (
    // Conteneur principal centré avec styles Tailwind
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10 border border-gray-100">
      {/* Titre de la page */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Mon Profil
      </h2>

      {/* === MODE AFFICHAGE (quand editing est false) === */}
      {!editing ? (
        <div className="space-y-4">
          {/* Affichage des informations utilisateur */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold text-green-600">
                Nom d'utilisateur :
              </span>
              <span className="ml-2 text-gray-800">{user.username}</span>
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold text-green-600">Email :</span>
              <span className="ml-2 text-gray-800">
                {user.email || "Non renseigné"}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-green-600">Rôle :</span>
              <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {user.role}
              </span>
            </p>
          </div>

          {/* Bouton pour passer en mode édition */}
          <button
            onClick={() => setEditing(true)} // Active le mode édition
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            ✏️ Modifier le profil
          </button>
        </div>
      ) : (
        /* === MODE ÉDITION (quand editing est true) === */
        <form onSubmit={handleSave} className="space-y-4">
          {/* Champ pour le nom d'utilisateur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom d'utilisateur *
            </label>
            <input
              type="text"
              placeholder="Votre nom d'utilisateur"
              value={username} // Valeur contrôlée par l'état username
              onChange={(e) => setUsername(e.target.value)} // Met à jour l'état
              required // Champ obligatoire
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
          </div>

          {/* Champ pour l'email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email} // Valeur contrôlée par l'état email
              onChange={(e) => setEmail(e.target.value)} // Met à jour l'état
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
          </div>

          {/* Sélecteur de rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              value={role} // Valeur contrôlée par l'état role
              onChange={(e) => setRole(e.target.value)} // Met à jour l'état
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
            >
              <option value="acheteur">Acheteur</option>
              <option value="producteur">Producteur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          {/* Bouton de sauvegarde */}
          <button
            type="submit" // Soumet le formulaire
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            💾 Enregistrer les modifications
          </button>

          {/* Bouton d'annulation */}
          <button
            type="button" // Type button pour ne pas soumettre le formulaire
            onClick={() => setEditing(false)} // Désactive le mode édition
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            ❌ Annuler
          </button>
        </form>
      )}
    </div>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default UserProfile;
