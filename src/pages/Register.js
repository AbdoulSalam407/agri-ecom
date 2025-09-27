import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "user",
    farmName: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur du champ lorsqu'il est modifié
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

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

    // Validation du téléphone
    if (form.phone && !/^\+?[\d\s-]{10,}$/.test(form.phone)) {
      newErrors.phone = "Format de téléphone invalide";
    }

    // Validation pour les producteurs
    if (form.role === "producer") {
      if (!form.farmName.trim()) {
        newErrors.farmName =
          "Le nom de l'exploitation est obligatoire pour les producteurs";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const userData = {
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        phone: form.phone.trim(),
        address: form.address.trim(),
        role: form.role,
        ...(form.role === "producer" && {
          farmName: form.farmName.trim(),
          description: form.description.trim(),
        }),
      };

      const result = await register(userData);

      if (result.success) {
        setMessage({
          type: "success",
          text: `Bienvenue ${result.user.name} ! Votre compte a été créé avec succès.`,
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: "Une erreur est survenue lors de l'inscription" });
      console.error("Erreur d'inscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const [message, setMessage] = useState({ type: "", text: "" });

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

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
      <div className="auth-card register-card">
        {/* En-tête */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🌱</span>
            <h1>AgriEcom</h1>
          </div>
          <h2 className="auth-title">Créer votre compte</h2>
          <p className="auth-subtitle">Rejoignez notre communauté agricole</p>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.type === "success" ? "✅" : "ℹ️"} {message.text}
          </div>
        )}

        {errors.submit && (
          <div className="auth-error">
            <div className="error-icon">❌</div>
            <div className="error-content">
              <p className="error-title">Erreur d'inscription</p>
              <p className="error-message">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Formulaire d'inscription */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Informations de base */}
          <div className="form-section">
            <h3 className="section-title">Informations personnelles</h3>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <span className="label-icon">👤</span>
                Nom complet *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Votre nom complet"
                value={form.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? "error" : ""}`}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                Adresse email *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? "error" : ""}`}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <span className="label-icon">📞</span>
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="+221 XX XXX XX XX"
                value={form.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? "error" : ""}`}
              />
              {errors.phone && (
                <span className="error-text">{errors.phone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                <span className="label-icon">🏠</span>
                Adresse
              </label>
              <textarea
                id="address"
                name="address"
                placeholder="Votre adresse complète"
                value={form.address}
                onChange={handleChange}
                rows="3"
                className={`form-textarea ${errors.address ? "error" : ""}`}
              />
            </div>
          </div>

          {/* Type de compte */}
          <div className="form-section">
            <h3 className="section-title">Type de compte *</h3>
            <div className="role-selection">
              {["user", "producer"].map((role) => (
                <label key={role} className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={form.role === role}
                    onChange={handleChange}
                    className="role-input"
                  />
                  <div className="role-card">
                    <div className="role-icon">
                      {role === "user" ? "🛒" : "👨‍🌾"}
                    </div>
                    <div className="role-info">
                      <div className="role-title">
                        {role === "user" ? "Acheteur" : "Producteur"}
                      </div>
                      <div className="role-description">
                        {getRoleDescription(role)}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Informations pour les producteurs */}
          {form.role === "producer" && (
            <div className="form-section">
              <h3 className="section-title">Informations de l'exploitation</h3>

              <div className="form-group">
                <label htmlFor="farmName" className="form-label">
                  <span className="label-icon">🏡</span>
                  Nom de l'exploitation *
                </label>
                <input
                  id="farmName"
                  type="text"
                  name="farmName"
                  placeholder="Nom de votre ferme ou exploitation"
                  value={form.farmName}
                  onChange={handleChange}
                  className={`form-input ${errors.farmName ? "error" : ""}`}
                />
                {errors.farmName && (
                  <span className="error-text">{errors.farmName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  <span className="label-icon">📄</span>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Décrivez votre exploitation..."
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="form-textarea"
                />
              </div>
            </div>
          )}

          {/* Mot de passe */}
          <div className="form-section">
            <h3 className="section-title">Sécurité</h3>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="label-icon">🔒</span>
                Mot de passe *
              </label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Votre mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  className={`form-input password-input ${
                    errors.password ? "error" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="password-toggle"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <span className="label-icon">✅</span>
                Confirmer le mot de passe *
              </label>
              <div className="password-input-container">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirmez votre mot de passe"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`form-input password-input ${
                    errors.confirmPassword ? "error" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="password-toggle"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          {/* Bouton d'inscription */}
          <button
            type="submit"
            disabled={loading}
            className="auth-button register-button"
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Création du compte...
              </>
            ) : (
              <>
                <span className="button-icon">🚀</span>
                Créer mon compte
              </>
            )}
          </button>
        </form>

        {/* Liens supplémentaires */}
        <div className="auth-links">
          <p className="auth-link-text">
            Déjà un compte ?{" "}
            <Link to="/login" className="auth-link">
              Se connecter
            </Link>
          </p>
          <Link to="/" className="back-link">
            ← Retour à l'accueil
          </Link>
        </div>

        {/* Conditions */}
        <div className="terms-notice">
          <p>
            En créant un compte, vous acceptez nos{" "}
            <a href="#" className="terms-link">
              conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="terms-link">
              politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
