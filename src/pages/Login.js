import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation basique
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
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
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion");
      console.error("Erreur de connexion:", error);
    } finally {
      setLoading(false);
    }
  };

  const [message, setMessage] = useState({ type: "", text: "" });

  // Comptes de test pour faciliter les démonstrations
  const testAccounts = [
    {
      email: "admin@agriecom.com",
      password: "admin123",
      role: "Admin",
      description: "Accès complet à la plateforme",
    },
    {
      email: "jean@ferme.fr",
      password: "ferme123",
      role: "Producteur",
      description: "Gestion des produits et ventes",
    },
    {
      email: "pierre.martin@email.com",
      password: "client123",
      role: "Client",
      description: "Achat de produits frais",
    },
  ];

  const fillTestAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
    setMessage({ type: "info", text: `Compte ${account.role} pré-rempli` });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isAuthenticated()) {
    return (
      <div className="auth-container">
        <div className="auth-success">
          <div className="success-icon">✅</div>
          <h2>Vous êtes déjà connecté</h2>
          <p>Redirection en cours...</p>
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
              >
                <div className="account-role">{account.role}</div>
                <div className="account-email">{account.email}</div>
                <div className="account-description">{account.description}</div>
              </button>
            ))}
          </div>
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
              required
              className="form-input"
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
                required
                className="form-input password-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-button">
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
            <Link to="/register" className="auth-link">
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
