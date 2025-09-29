import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { login, currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer la redirection prévue depuis l'état de la localisation
  const from = location.state?.from?.pathname || "/";

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isAuthenticated() && currentUser) {
      console.log(
        "🔄 Redirection depuis Login - utilisateur déjà connecté:",
        currentUser.name
      );
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage({ type: "", text: "" });
    setLoading(true);

    // Validation basique
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    // Validation de l'email
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);

      if (result.success) {
        // Connexion réussie - message de bienvenue
        setMessage({
          type: "success",
          text: `Bienvenue ${result.user.name} !`,
        });

        // Redirection après un court délai pour voir le message
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } else {
        setError(result.error || "Erreur de connexion");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Une erreur inattendue est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  // Comptes de test pour faciliter les démonstrations - CORRIGÉ
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
      role: "client", // CORRECTION : "Client" → "client"
      phone: "+33 6 11 22 33 44",
      address: "15 Avenue des Champs, 75008 Paris",
      blocked: false,
      createdAt: "2024-01-04T00:00:00.000Z",
    },
  ];

  const fillTestAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
    setMessage({
      type: "info",
      text: `Compte ${account.role} pré-rempli - Cliquez sur "Se connecter"`,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setError("");
    setMessage({ type: "", text: "" });
  };

  // Si l'utilisateur est déjà authentifié, afficher un message de redirection
  if (isAuthenticated() && currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-success">
            <div className="success-icon">✅</div>
            <h2>Vous êtes déjà connecté</h2>
            <p>Redirection vers la page d'accueil...</p>
            <button
              onClick={() => navigate("/")}
              className="auth-button"
              style={{ marginTop: "1rem" }}
            >
              Aller à l'accueil maintenant
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* En-tête */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🌱</span>
            <h1>AgriEcom</h1>
          </div>
          <h2 className="auth-title">Connexion à votre compte</h2>
          <p className="auth-subtitle">Accédez à votre espace personnel</p>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.type === "success" ? "✅" : "ℹ️"} {message.text}
          </div>
        )}

        {error && (
          <div className="auth-error">
            <div className="error-icon">❌</div>
            <div className="error-content">
              <p className="error-title">Erreur de connexion</p>
              <p className="error-message">{error}</p>
            </div>
            <button
              onClick={clearForm}
              className="clear-form-button"
              type="button"
            >
              ✕
            </button>
          </div>
        )}

        {/* Comptes de test */}
        <div className="test-accounts">
          <h3 className="test-accounts-title">Comptes de démonstration</h3>
          <p className="test-accounts-subtitle">
            Cliquez pour vous connecter rapidement
          </p>
          <div className="test-accounts-grid">
            {testAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillTestAccount(account)}
                className="test-account-card"
                disabled={loading}
              >
                <div className="account-role">{account.role}</div>
                <div className="account-email">{account.email}</div>
                <div className="account-description">{account.description}</div>
                <div className="account-hint">Cliquez pour remplir</div>
              </button>
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div className="form-separator">
          <span>Ou connectez-vous manuellement</span>
        </div>

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <span className="label-icon">📧</span>
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <span className="label-icon">🔒</span>
              Mot de passe
            </label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="form-input password-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
                disabled={loading}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="auth-button"
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Connexion en cours...
              </>
            ) : (
              <>
                <span className="button-icon">🔑</span>
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Liens supplémentaires */}
        <div className="auth-links">
          <p className="auth-link-text">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="auth-link"
              state={{ from: location.state?.from }}
            >
              Créer un compte
            </Link>
          </p>
          <Link to="/" className="back-link">
            ← Retour à l'accueil
          </Link>
        </div>

        {/* Sécurité */}
        <div className="security-notice">
          <div className="security-icon">🛡️</div>
          <p>Vos informations de connexion sont sécurisées et cryptées</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
