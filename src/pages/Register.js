// Importation de React et des hooks useState et useEffect
import React, { useState, useEffect } from "react";

// Importation des composants de navigation React Router
import { Link, useNavigate } from "react-router-dom";

// Importation du contexte d'authentification
import { useAuth } from "../context/AuthContext";

// Définition du composant Register (page d'inscription)
const Register = () => {
  // ===== ÉTATS POUR GÉRER LE FORMULAIRE =====

  // État pour stocker toutes les valeurs du formulaire
  const [form, setForm] = useState({
    name: "", // Nom complet
    email: "", // Adresse email
    password: "", // Mot de passe
    confirmPassword: "", // Confirmation du mot de passe
    phone: "", // Numéro de téléphone
    address: "", // Adresse postale
    role: "user", // Rôle (user, producer, admin)
    farmName: "", // Nom de l'exploitation (pour producteurs)
    description: "", // Description (pour producteurs)
  });

  // État pour stocker les erreurs de validation
  const [errors, setErrors] = useState({});

  // État pour gérer le chargement pendant l'inscription
  const [loading, setLoading] = useState(false);

  // États pour afficher/masquer les mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // État pour les messages de succès/info
  const [message, setMessage] = useState({ type: "", text: "" });

  // ===== UTILISATION DES HOOKS =====

  // Récupération des fonctions et données d'authentification
  const { register, currentUser, isAuthenticated } = useAuth();

  // Hook pour la navigation programmatique
  const navigate = useNavigate();

  // ===== EFFET POUR REDIRIGER SI DÉJÀ CONNECTÉ =====
  useEffect(() => {
    // Si l'utilisateur est déjà connecté, on le redirige vers l'accueil
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]); // Se ré-exécute quand l'authentification change

  // ===== FONCTION POUR GÉRER LES CHANGEMENTS DES CHAMPS =====
  const handleChange = (e) => {
    // Récupère le nom du champ et sa valeur
    const { name, value } = e.target;

    // Met à jour l'état du formulaire
    setForm((prev) => ({
      ...prev, // Conserve toutes les valeurs existantes
      [name]: value, // Met à jour seulement le champ modifié
    }));

    // Efface l'erreur du champ lorsqu'il est modifié
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "", // Réinitialise l'erreur pour ce champ
      }));
    }
  };

  // ===== FONCTION DE VALIDATION DU FORMULAIRE =====
  const validateForm = () => {
    const newErrors = {};

    // Validation du nom
    if (!form.name.trim()) {
      newErrors.name = "Le nom est obligatoire";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    // Validation de l'email
    if (!form.email) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation du mot de passe
    if (!form.password) {
      newErrors.password = "Le mot de passe est obligatoire";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    // Validation de la confirmation du mot de passe
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    // Validation du téléphone (optionnel)
    if (form.phone && !/^\+?[\d\s-]{10,}$/.test(form.phone)) {
      newErrors.phone = "Format de téléphone invalide";
    }

    // Validation spécifique pour les producteurs
    if (form.role === "producer") {
      if (!form.farmName.trim()) {
        newErrors.farmName =
          "Le nom de l'exploitation est obligatoire pour les producteurs";
      }
    }

    // Met à jour les erreurs
    setErrors(newErrors);

    // Retourne true si aucune erreur, false sinon
    return Object.keys(newErrors).length === 0;
  };

  // ===== FONCTION DE SOUMISSION DU FORMULAIRE =====
  const handleSubmit = async (e) => {
    // Empêche le rechargement de la page
    e.preventDefault();

    // Valide le formulaire avant soumission
    if (!validateForm()) {
      return; // Arrête si validation échoue
    }

    // Démarre le chargement et efface les erreurs précédentes
    setLoading(true);
    setErrors({});

    try {
      // Prépare les données pour l'inscription
      const userData = {
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        phone: form.phone.trim(),
        address: form.address.trim(),
        role: form.role,
        // Ajoute les champs spécifiques aux producteurs seulement si rôle = producer
        ...(form.role === "producer" && {
          farmName: form.farmName.trim(),
          description: form.description.trim(),
        }),
      };

      // Appel de la fonction d'inscription du contexte
      const result = await register(userData);

      if (result.success) {
        // Inscription réussie
        setMessage({
          type: "success",
          text: `Bienvenue ${result.user.name} ! Votre compte a été créé avec succès.`,
        });

        // Redirection après 2 secondes pour laisser voir le message
        setTimeout(() => navigate("/"), 2000);
      } else {
        // Erreur d'inscription
        setErrors({ submit: result.error });
      }
    } catch (error) {
      // Erreur imprévue
      setErrors({ submit: "Une erreur est survenue lors de l'inscription" });
      console.error("Erreur d'inscription:", error);
    } finally {
      // Arrête le chargement dans tous les cas
      setLoading(false);
    }
  };

  // ===== FONCTION POUR AFFICHER/MASQUER LES MOTS DE PASSE =====
  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // ===== FONCTION POUR OBTENIR LA DESCRIPTION D'UN RÔLE =====
  const getRoleDescription = (role) => {
    switch (role) {
      case "user":
        return "Achetez des produits frais directement auprès des producteurs locaux";
      case "producer":
        return "Vendez vos produits agricoles et gérez votre exploitation";
      case "admin":
        return "Administrez la plateforme et gérez les utilisateurs";
      default:
        return "";
    }
  };

  // ===== REDIRECTION SI DÉJÀ CONNECTÉ =====
  if (isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Vous êtes déjà connecté
          </h2>
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  // ===== RENDU PRINCIPAL DU COMPOSANT =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* === CARTE PRINCIPALE === */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          {/* === EN-TÊTE === */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">🌱</span>
              <h1 className="text-3xl font-bold text-green-600">AgriEcom</h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Créer votre compte
            </h2>
            <p className="text-gray-600">Rejoignez notre communauté agricole</p>
          </div>

          {/* === MESSAGES D'ALERTE === */}

          {/* Message de succès/information */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-blue-50 border-blue-200 text-blue-800"
              }`}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">
                  {message.type === "success" ? "✅" : "ℹ️"}
                </span>
                <span className="font-medium">{message.text}</span>
              </div>
            </div>
          )}

          {/* Message d'erreur général */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <span className="text-xl text-red-600 mr-3 mt-1">❌</span>
                <div>
                  <p className="font-semibold text-red-800">
                    Erreur d'inscription
                  </p>
                  <p className="text-red-700 mt-1">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          {/* === FORMULAIRE D'INSCRIPTION === */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* === SECTION INFORMATIONS PERSONNELLES === */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Informations personnelles
              </h3>

              <div className="space-y-4">
                {/* Champ Nom complet */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <span>👤</span>
                      Nom complet *
                    </span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Votre nom complet"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      errors.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Champ Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <span>📧</span>
                      Adresse email *
                    </span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
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
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+221 XX XXX XX XX"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      errors.phone
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Champ Adresse */}
                <div>
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
                    placeholder="Votre adresse complète"
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-vertical"
                  />
                </div>
              </div>
            </div>

            {/* === SECTION TYPE DE COMPTE === */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Type de compte *
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["user", "producer"].map((role) => (
                  <label key={role} className="cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={form.role === role}
                      onChange={handleChange}
                      className="hidden" // Cache l'input radio natif
                    />
                    <div
                      className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                        form.role === role
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 bg-gray-50 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icône du rôle */}
                        <div className="text-2xl">
                          {role === "user" ? "🛒" : "👨‍🌾"}
                        </div>
                        <div>
                          {/* Titre du rôle */}
                          <div className="font-semibold text-gray-800">
                            {role === "user" ? "Acheteur" : "Producteur"}
                          </div>
                          {/* Description du rôle */}
                          <div className="text-sm text-gray-600 mt-1">
                            {getRoleDescription(role)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* === SECTION INFORMATIONS EXPLOITATION (seulement pour producteurs) === */}
            {form.role === "producer" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Informations de l'exploitation
                </h3>

                <div className="space-y-4">
                  {/* Champ Nom de l'exploitation */}
                  <div>
                    <label
                      htmlFor="farmName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      <span className="flex items-center gap-2">
                        <span>🏡</span>
                        Nom de l'exploitation *
                      </span>
                    </label>
                    <input
                      id="farmName"
                      type="text"
                      name="farmName"
                      placeholder="Nom de votre ferme ou exploitation"
                      value={form.farmName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                        errors.farmName
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.farmName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.farmName}
                      </p>
                    )}
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
                      placeholder="Décrivez votre exploitation, vos spécialités, vos pratiques agricoles..."
                      value={form.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-vertical"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* === SECTION SÉCURITÉ (MOTS DE PASSE) === */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Sécurité
              </h3>

              <div className="space-y-4">
                {/* Champ Mot de passe */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <span>🔒</span>
                      Mot de passe *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Votre mot de passe"
                      value={form.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 pr-12 ${
                        errors.password
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {/* Bouton afficher/masquer mot de passe */}
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("password")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Champ Confirmation mot de passe */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <span>✅</span>
                      Confirmer le mot de passe *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirmez votre mot de passe"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 pr-12 ${
                        errors.confirmPassword
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {/* Bouton afficher/masquer confirmation mot de passe */}
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* === BOUTON D'INSCRIPTION === */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  {/* Spinner de chargement */}
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Création du compte...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🚀</span>
                  <span>Créer mon compte</span>
                </>
              )}
            </button>
          </form>

          {/* === LIENS SUPPLÉMENTAIRES === */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-600">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Se connecter
              </Link>
            </p>
            <Link
              to="/"
              className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              <span className="mr-1">←</span>
              Retour à l'accueil
            </Link>
          </div>

          {/* === CONDITIONS D'UTILISATION === */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-gray-600 text-sm">
              En créant un compte, vous acceptez nos{" "}
              <a
                href="#"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                conditions d'utilisation
              </a>{" "}
              et notre{" "}
              <a
                href="#"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                politique de confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default Register;
