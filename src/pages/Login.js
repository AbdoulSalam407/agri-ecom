// Importation de React et des hooks useState et useEffect
import React, { useState, useEffect } from "react";

// Importation des composants de navigation React Router
import { Link, useNavigate, useLocation } from "react-router-dom";

// Importation du contexte d'authentification
import { useAuth } from "../context/AuthContext";

// Définition du composant Login (page de connexion)
const Login = () => {
  // ===== ÉTATS POUR GÉRER LE FORMULAIRE =====

  // État pour l'email
  const [email, setEmail] = useState("");

  // État pour le mot de passe
  const [password, setPassword] = useState("");

  // État pour les messages d'erreur
  const [error, setError] = useState("");

  // État pour gérer le chargement pendant la connexion
  const [loading, setLoading] = useState(false);

  // État pour afficher/masquer le mot de passe
  const [showPassword, setShowPassword] = useState(false);

  // État pour les messages de succès/info
  const [message, setMessage] = useState({ type: "", text: "" });

  // ===== UTILISATION DES HOOKS =====

  // Récupération des fonctions et données d'authentification
  const { login, currentUser, isAuthenticated } = useAuth();

  // Hook pour la navigation programmatique
  const navigate = useNavigate();

  // Hook pour accéder aux informations de l'URL actuelle
  const location = useLocation();

  // Récupérer la page d'origine depuis laquelle l'utilisateur a été redirigé
  // Si aucune redirection n'est spécifiée, on va vers la page d'accueil ("/")
  const from = location.state?.from?.pathname || "/";

  // ===== EFFET POUR REDIRIGER SI DÉJÀ CONNECTÉ =====
  useEffect(() => {
    // Si l'utilisateur est déjà connecté, on le redirige
    if (isAuthenticated() && currentUser) {
      console.log(
        "🔄 Redirection depuis Login - utilisateur déjà connecté:",
        currentUser.name
      );
      // Navigue vers la page d'origine en remplaçant l'historique
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, from]);

  // ===== FONCTION DE SOUMISSION DU FORMULAIRE =====
  const handleSubmit = async (e) => {
    // Empêche le rechargement de la page
    e.preventDefault();

    // Réinitialise les messages d'erreur et d'information
    setError("");
    setMessage({ type: "", text: "" });

    // Active le statut de chargement
    setLoading(true);

    // ===== VALIDATION DES CHAMPS =====

    // Vérification que les champs ne sont pas vides
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    // Validation du format de l'email avec une expression régulière
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      setLoading(false);
      return;
    }

    // ===== TENTATIVE DE CONNEXION =====
    try {
      // Appel de la fonction login du contexte d'authentification
      const result = await login(email, password);

      // Si la connexion réussit
      if (result.success) {
        // Affiche un message de bienvenue
        setMessage({
          type: "success",
          text: `Bienvenue ${result.user.name} !`,
        });

        // Redirige après un court délai pour laisser voir le message
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } else {
        // Affiche l'erreur retournée par le service
        setError(result.error || "Erreur de connexion");
      }
    } catch (error) {
      // Gestion des erreurs imprévues
      console.error("Erreur de connexion:", error);
      setError("Une erreur inattendue est survenue lors de la connexion");
    } finally {
      // Désactive le chargement dans tous les cas
      setLoading(false);
    }
  };

  // ===== COMPTES DE TEST POUR LA DÉMONSTRATION =====
  const testAccounts = [
    {
      id: "1",
      name: "Admin AgriEcom",
      email: "admin@agriecom.com",
      password: "admin123",
      role: "admin",
      phone: "+33 1 23 45 67 89",
      address: "123 Rue de l'Agriculture, Paris",
      blocked: false,
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      name: "Jean Dupont",
      email: "jean@ferme.fr",
      password: "ferme123",
      role: "producer",
      phone: "+33 6 12 34 56 78",
      address: "Ferme de la Vallée, 78000 Versailles",
      farmName: "Ferme de la Vallée",
      description: "Producteur bio depuis 15 ans",
      blocked: false,
      createdAt: "2024-01-02T00:00:00.000Z",
    },
    {
      id: "3",
      name: "Marie Lambert",
      email: "marie@exploitation.fr",
      password: "exploit123",
      role: "producer",
      phone: "+33 6 98 76 54 32",
      address: "Exploitation Lambert, 69000 Lyon",
      farmName: "Exploitation Lambert",
      description: "Éleveuse de bovins et productrice de céréales",
      blocked: false,
      createdAt: "2024-01-03T00:00:00.000Z",
    },
    {
      id: "4",
      name: "Pierre Martin",
      email: "pierre.martin@email.com",
      password: "client123",
      role: "client",
      phone: "+33 6 11 22 33 44",
      address: "15 Avenue des Champs, 75008 Paris",
      blocked: false,
      createdAt: "2024-01-04T00:00:00.000Z",
    },
  ];

  // ===== FONCTION POUR REMPLIR AUTOMATIQUEMENT UN COMPTE DE TEST =====
  const fillTestAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
    setMessage({
      type: "info",
      text: `Compte ${account.role} pré-rempli - Cliquez sur "Se connecter"`,
    });
  };

  // ===== FONCTION POUR AFFICHER/MASQUER LE MOT DE PASSE =====
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ===== FONCTION POUR VIDER LE FORMULAIRE =====
  const clearForm = () => {
    setEmail("");
    setPassword("");
    setError("");
    setMessage({ type: "", text: "" });
  };

  // ===== REDIRECTION SI DÉJÀ CONNECTÉ =====
  // Si l'utilisateur est déjà authentifié, on affiche un message de redirection
  if (isAuthenticated() && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Vous êtes déjà connecté
            </h2>
            <p className="text-gray-600 mb-6">
              Redirection vers la page d'accueil...
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Aller à l'accueil maintenant
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDU PRINCIPAL DU COMPOSANT =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Carte principale du formulaire */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full border border-gray-200">
        {/* === EN-TÊTE === */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">🌱</span>
            <h1 className="text-3xl font-bold text-green-600">AgriEcom</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Connexion à votre compte
          </h2>
          <p className="text-gray-600">Accédez à votre espace personnel</p>
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

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <span className="text-xl text-red-600 mr-3 mt-1">❌</span>
                <div>
                  <p className="font-semibold text-red-800">
                    Erreur de connexion
                  </p>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={clearForm}
                className="text-red-500 hover:text-red-700 text-lg font-bold transition-colors"
                type="button"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* === COMPTES DE DÉMONSTRATION === */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Comptes de démonstration
          </h3>
          <p className="text-gray-600 text-center mb-4 text-sm">
            Cliquez pour vous connecter rapidement
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillTestAccount(account)}
                className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      account.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : account.role === "producer"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {account.role}
                  </span>
                  <span className="text-xs text-gray-500">Test</span>
                </div>
                <div className="font-medium text-gray-800 text-sm mb-1">
                  {account.email}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {account.description}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  Cliquez pour remplir
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* === SÉPARATEUR === */}
        <div className="flex items-center mb-8">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">
            Ou connectez-vous manuellement
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* === FORMULAIRE DE CONNEXION === */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <span className="inline-flex items-center">
                <span className="mr-2">📧</span>
                Adresse email
              </span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              autoComplete="email"
            />
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <span className="inline-flex items-center">
                <span className="mr-2">🔒</span>
                Mot de passe
              </span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed pr-12"
                autoComplete="current-password"
              />
              {/* Bouton pour afficher/masquer le mot de passe */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                disabled={loading}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                {/* Spinner de chargement */}
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <span className="text-xl">🔑</span>
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>

        {/* === LIENS SUPPLEMENTAIRES === */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              state={{ from: location.state?.from }}
            >
              Créer un compte
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

        {/* === MESSAGE DE SÉCURITÉ === */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 text-blue-800">
            <span className="text-lg">🛡️</span>
            <p className="text-sm font-medium">
              Vos informations de connexion sont sécurisées et cryptées
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default Login;
