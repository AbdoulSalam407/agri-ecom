// Importation de React et des hooks useState et useEffect
import React, { useState, useEffect } from "react";

// Importation du contexte d'authentification pour accéder aux données utilisateur
import { useAuth } from "../context/AuthContext";

// Définition du composant Profile (page de profil utilisateur)
const Profile = () => {
  // ===== UTILISATION DU CONTEXTE D'AUTHENTIFICATION =====
  // currentUser : contient les informations de l'utilisateur connecté
  // updateProfile : fonction pour mettre à jour le profil
  const { currentUser, updateProfile } = useAuth();

  // ===== ÉTATS POUR GÉRER LE PROFIL ET L'INTERFACE =====

  // État pour stocker les données du formulaire de profil
  const [profile, setProfile] = useState({
    name: "", // Nom complet
    email: "", // Adresse email
    phone: "", // Numéro de téléphone
    address: "", // Adresse postale
    farmName: "", // Nom de l'exploitation (pour les producteurs)
    description: "", // Description (pour les producteurs)
  });

  // État pour gérer le mode édition (true = modification, false = consultation)
  const [isEditing, setIsEditing] = useState(false);

  // État pour gérer le chargement pendant la sauvegarde
  const [loading, setLoading] = useState(false);

  // État pour les messages de succès/erreur
  const [message, setMessage] = useState({ type: "", text: "" });

  // ===== EFFET POUR CHARGER LES DONNÉES DE L'UTILISATEUR =====
  // useEffect s'exécute après le rendu du composant et quand currentUser change
  useEffect(() => {
    // Quand l'utilisateur est disponible, on remplit le formulaire avec ses données
    if (currentUser) {
      setProfile({
        name: currentUser.name || "", // Nom avec valeur par défaut
        email: currentUser.email || "", // Email avec valeur par défaut
        phone: currentUser.phone || "", // Téléphone avec valeur par défaut
        address: currentUser.address || "", // Adresse avec valeur par défaut
        farmName: currentUser.farmName || "", // Nom ferme avec valeur par défaut
        description: currentUser.description || "", // Description avec valeur par défaut
      });
    }
  }, [currentUser]); // Se ré-exécute quand currentUser change

  // ===== FONCTION POUR GÉRER LES CHANGEMENTS DES CHAMPS =====
  const handleChange = (e) => {
    // Récupère le nom du champ et sa valeur depuis l'événement
    const { name, value } = e.target;

    // Met à jour l'état du profil en conservant les autres valeurs
    // prev représente l'état précédent du profil
    setProfile((prev) => ({
      ...prev, // Conserve toutes les propriétés existantes
      [name]: value, // Met à jour seulement la propriété qui a changé
    }));
  };

  // ===== FONCTION POUR SAUVEGARDER LE PROFIL =====
  const handleSave = async () => {
    // Si on n'est pas en mode édition, on active simplement le mode édition
    if (!isEditing) {
      setIsEditing(true);
      return; // Arrête l'exécution de la fonction
    }

    // Démarre le chargement et efface les messages précédents
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Bloc try-catch pour gérer les erreurs
    try {
      // Appel de la fonction de mise à jour du contexte d'authentification
      const result = await updateProfile(profile);

      // Vérifie si la mise à jour a réussi
      if (result.success) {
        // Succès : affiche un message et désactive le mode édition
        setMessage({
          type: "success",
          text: "Profil mis à jour avec succès !",
        });
        setIsEditing(false);
      } else {
        // Erreur : affiche le message d'erreur retourné par l'API
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      // Erreur imprévue lors de la mise à jour
      setMessage({
        type: "error",
        text: "Erreur lors de la mise à jour du profil",
      });
    } finally {
      // Arrête le chargement dans tous les cas (succès ou erreur)
      setLoading(false);
    }
  };

  // ===== FONCTION POUR ANNULER LES MODIFICATIONS =====
  const handleCancel = () => {
    // Réinitialise le formulaire avec les données originales de l'utilisateur
    setProfile({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      farmName: currentUser.farmName || "",
      description: currentUser.description || "",
    });
    // Désactive le mode édition et efface les messages
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  // ===== AFFICHAGE SI L'UTILISATEUR N'EST PAS CONNECTÉ =====
  if (!currentUser) {
    return (
      // Conteneur principal avec fond gris et centrage
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        {/* Carte d'erreur */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-200">
          {/* Icône de verrou */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          {/* Titre et message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Non connecté
          </h2>
          <p className="text-gray-600 mb-6">
            Veuillez vous connecter pour accéder à votre profil
          </p>
        </div>
      </div>
    );
  }

  // ===== RENDU PRINCIPAL DU COMPOSANT =====
  return (
    // Conteneur principal avec fond gris clair
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Conteneur centré avec largeur maximale */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* === EN-TÊTE DU PROFIL === */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          {/* Flex container responsive */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar de l'utilisateur */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl">
                👤
              </div>
            </div>

            {/* Informations principales */}
            <div className="flex-grow text-center md:text-left">
              {/* Titre principal */}
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Mon Profil
              </h1>

              {/* Badge du rôle avec couleur conditionnelle */}
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                  currentUser.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : currentUser.role === "producer"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {/* Icône du rôle */}
                <span className="mr-2">
                  {currentUser.role === "admin" && "👨‍💼"}
                  {currentUser.role === "producer" && "👨‍🌾"}
                  {currentUser.role === "user" && "👤"}
                </span>
                {/* Texte du rôle */}
                {currentUser.role === "admin" && "Administrateur"}
                {currentUser.role === "producer" && "Producteur"}
                {currentUser.role === "user" && "Client"}
              </div>

              {/* Date d'inscription */}
              <p className="text-gray-600">
                Membre depuis le{" "}
                <span className="font-medium">
                  {new Date(currentUser.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* === MESSAGES D'ALERTE === */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {/* Icône conditionnelle */}
              <span className="text-xl mr-3">
                {message.type === "success" ? "✅" : "❌"}
              </span>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* === FORMULAIRE DE PROFIL === */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          {/* Section Informations personnelles */}
          <div className="mb-8">
            {/* Titre de section avec bordure en bas */}
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Informations personnelles
            </h3>

            {/* Grille des champs - 2 colonnes sur desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Champ Nom complet (prend 2 colonnes) */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <span className="flex items-center gap-2">
                    <span>📝</span>
                    Nom complet
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Votre nom complet"
                />
              </div>

              {/* Champ Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <span className="flex items-center gap-2">
                    <span>📧</span>
                    Adresse email
                  </span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Champ Téléphone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <span className="flex items-center gap-2">
                    <span>📞</span>
                    Téléphone
                  </span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="+221 XX XXX XX XX"
                />
              </div>

              {/* Champ Adresse (prend 2 colonnes) */}
              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <span className="flex items-center gap-2">
                    <span>🏠</span>
                    Adresse
                  </span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
                  placeholder="Votre adresse complète"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Section Informations de l'exploitation (seulement pour les producteurs) */}
          {currentUser.role === "producer" && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Informations de l'exploitation
              </h3>

              <div className="grid grid-cols-1 gap-6">
                {/* Champ Nom de l'exploitation */}
                <div>
                  <label
                    htmlFor="farmName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <span>🏡</span>
                      Nom de l'exploitation
                    </span>
                  </label>
                  <input
                    type="text"
                    id="farmName"
                    name="farmName"
                    value={profile.farmName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nom de votre ferme ou exploitation"
                  />
                </div>

                {/* Champ Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <span>📄</span>
                      Description
                    </span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={profile.description}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
                    placeholder="Décrivez votre exploitation, vos pratiques agricoles, vos spécialités..."
                    rows="4"
                  />
                </div>
              </div>
            </div>
          )}

          {/* === BOUTONS D'ACTION === */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            {/* Mode édition activé */}
            {isEditing ? (
              <>
                {/* Bouton Sauvegarder */}
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    // Affichage pendant le chargement
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sauvegarde...
                    </>
                  ) : (
                    // Affichage normal
                    <>
                      <span>💾</span>
                      Sauvegarder
                    </>
                  )}
                </button>

                {/* Bouton Annuler */}
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>❌</span>
                  Annuler
                </button>
              </>
            ) : (
              /* Mode consultation - Bouton Modifier */
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>✏️</span>
                Modifier le profil
              </button>
            )}
          </div>
        </div>

        {/* === STATISTIQUES DU COMPTE === */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Statistiques du compte
          </h3>

          {/* Grille des statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Statistique 1 - Produits ou Achats */}
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-3xl mb-3">
                {currentUser.role === "producer" ? "📦" : "🛒"}
              </div>
              <div className="text-gray-600 font-medium mb-2">
                {currentUser.role === "producer"
                  ? "Produits publiés"
                  : "Achats effectués"}
              </div>
              <div className="text-2xl font-bold text-gray-800">0</div>
            </div>

            {/* Statistique 2 - Évaluation */}
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-3xl mb-3">⭐</div>
              <div className="text-gray-600 font-medium mb-2">Évaluation</div>
              <div className="text-2xl font-bold text-gray-800">-</div>
            </div>

            {/* Statistique 3 - Dernière connexion */}
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-3xl mb-3">📅</div>
              <div className="text-gray-600 font-medium mb-2">
                Dernière connexion
              </div>
              <div className="text-lg font-bold text-gray-800">
                {currentUser.lastLogin
                  ? new Date(currentUser.lastLogin).toLocaleDateString("fr-FR")
                  : "Jamais"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default Profile;
