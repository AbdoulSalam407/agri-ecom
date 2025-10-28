import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });

  const { login, currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LocationState)?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated() && currentUser) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, from]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setMessage({ type: "", text: "" });
    setLoading(true);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      setLoading(false);
      return;
    }

    try {
      const user = await login(email, password);
      if (user) {
        setMessage({
          type: "success",
          text: `Bienvenue ${user.name} !`,
        });
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } else {
        setError("Erreur de connexion - Aucun utilisateur retourné");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      const errorMessage = (error as Error).message;

      if (errorMessage.includes("bloqué")) {
        setError("Votre compte a été bloqué. Contactez l'administrateur.");
      } else if (errorMessage.includes("mot de passe")) {
        setError("Mot de passe incorrect");
      } else if (errorMessage.includes("email")) {
        setError("Aucun compte trouvé avec cet email");
      } else if (
        errorMessage.includes("réseau") ||
        errorMessage.includes("HTTP")
      ) {
        setError(
          "Erreur de connexion au serveur. Vérifiez votre connexion internet."
        );
      } else {
        setError(
          errorMessage ||
            "Une erreur inattendue est survenue lors de la connexion"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const clearForm = (): void => {
    setEmail("");
    setPassword("");
    setError("");
    setMessage({ type: "", text: "" });
  };

  if (isAuthenticated() && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <span className="text-3xl text-white">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Vous êtes connecté
          </h2>
          <p className="text-white/80 mb-6">Redirection en cours...</p>
          <Link
            to="/"
            className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30"
          >
            Aller à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-3">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        {/* En-tête */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">🌾</span>
            </div>
            <h1 className="text-2xl font-bold text-green-600">AgroBusiness</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Se connecter
          </h2>
          <p className="text-gray-600 text-sm">
            Accédez à votre compte AgroBusiness
          </p>
        </div>

        {/* Messages d'alerte */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg border text-sm ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <div className="flex items-center">
              <span className="mr-2 text-lg">
                {message.type === "success" ? "✅" : "ℹ️"}
              </span>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-500 mr-2 text-lg">❌</span>
                <span className="text-red-700">{error}</span>
              </div>
              <button
                onClick={clearForm}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                📧
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                🔒
              </span>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={loading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg transition-colors"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Indicateur de formulaire rempli */}
          {email && password && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 text-center">
              <div className="flex items-center justify-center">
                <span className="mr-2">✅</span>
                <span>Formulaire prêt - Cliquez sur "Se connecter"</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg disabled:shadow-none"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <span className="text-lg">🔑</span>
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>

        {/* Liens */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-gray-600 text-sm">
            Nouveau sur AgroBusiness ?{" "}
            <Link
              to="/register"
              className="text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              Créer un compte
            </Link>
          </p>
          <Link
            to="/"
            className="inline-block text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>

        {/* Sécurité */}
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <span>🛡️</span>
            <span>Connexion sécurisée et chiffrée</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
