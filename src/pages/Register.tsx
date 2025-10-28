// pages/Register.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  role: "client" | "producer";
  farmName: string;
  description: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  farmName?: string;
  submit?: string;
}

const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "client",
    farmName: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [message, setMessage] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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
    if (form.phone && !/^[\d\s\-+().]{10,}$/.test(form.phone)) {
      newErrors.phone = "Format de téléphone invalide (minimum 10 caractères)";
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

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    console.log("🟡 1. Début handleSubmit");

    if (!validateForm()) {
      console.log("🔴 2. Validation échouée", errors);
      return;
    }

    setLoading(true);
    setErrors({});
    setMessage({ type: "", text: "" });
    console.log("🟡 3. Loading activé");

    try {
      const userData: Partial<User> = {
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

      console.log("🟡 4. Données préparées:", userData);
      console.log("🟡 5. Appel de register...");

      const user = await register(userData);

      console.log("🟢 6. Register réussi:", user);

      setMessage({
        type: "success",
        text: `Bienvenue ${user.name} ! Votre compte a été créé avec succès. Redirection...`,
      });

      // Redirection après 2 secondes
      setTimeout(() => {
        console.log("🟡 7. Redirection vers /");
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log("🔴 8. Erreur dans catch:", error);
      const errorMessage = (error as Error).message;
      console.log("🔴 9. Message d'erreur:", errorMessage);

      let displayMessage = "Une erreur est survenue lors de l'inscription";

      if (errorMessage.includes("email existe déjà")) {
        displayMessage = "Un compte avec cet email existe déjà";
      } else if (errorMessage.includes("validation")) {
        displayMessage = "Veuillez vérifier les informations du formulaire";
      } else if (
        errorMessage.includes("réseau") ||
        errorMessage.includes("HTTP") ||
        errorMessage.includes("fetch")
      ) {
        displayMessage =
          "Erreur de connexion au serveur. Vérifiez que json-server est démarré sur http://localhost:5000";
      } else if (errorMessage.includes("serveur")) {
        displayMessage =
          "Erreur du serveur. Vérifiez que json-server fonctionne correctement.";
      } else {
        displayMessage = errorMessage || displayMessage;
      }

      setErrors({ submit: displayMessage });
    } finally {
      setLoading(false);
      console.log("🟡 10. Loading désactivé");
    }
  };

  const togglePasswordVisibility = (
    field: "password" | "confirmPassword"
  ): void => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const getRoleDescription = (role: "client" | "producer"): string => {
    switch (role) {
      case "client":
        return "Achetez des produits frais directement auprès des producteurs locaux";
      case "producer":
        return "Vendez vos produits agricoles et gérez votre exploitation";
      default:
        return "";
    }
  };

  // Si l'utilisateur est déjà authentifié, afficher un message
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
          <p className="text-gray-600 mb-4">Redirection en cours...</p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-3">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          {/* En-tête */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xl text-green-600">🌱</span>
              </div>
              <h1 className="text-2xl font-bold text-green-600">
                AgroBusiness
              </h1>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Créer votre compte
            </h2>
            <p className="text-gray-600 text-sm">
              Rejoignez notre communauté agricole
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

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
              <div className="flex items-center">
                <span className="text-red-500 mr-2 text-lg">❌</span>
                <span className="text-red-700">{errors.submit}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                Informations personnelles
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Votre nom complet"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                      errors.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                      errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+33 1 23 45 67 89"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                        errors.phone
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Votre adresse"
                      value={form.address}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Type de compte */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                Type de compte *
              </h3>
              <div className="flex gap-3">
                {(["client", "producer"] as const).map((role) => (
                  <label key={role} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={form.role === role}
                      onChange={handleChange}
                      disabled={loading}
                      className="hidden"
                    />
                    <div
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        form.role === role
                          ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                          : "border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="text-lg mb-1">
                        {role === "client" ? "🛒" : "👨‍🌾"}
                      </div>
                      <div className="font-medium text-sm">
                        {role === "client" ? "Client" : "Producteur"}
                      </div>
                      <div className="text-xs mt-1 opacity-75">
                        {getRoleDescription(role)}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Exploitation agricole (uniquement pour les producteurs) */}
            {form.role === "producer" && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                  Informations de l'exploitation
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nom de l'exploitation *
                    </label>
                    <input
                      type="text"
                      name="farmName"
                      placeholder="Nom de votre ferme ou exploitation"
                      value={form.farmName}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                        errors.farmName
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                    {errors.farmName && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.farmName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Décrivez votre exploitation, vos produits..."
                      value={form.description}
                      onChange={handleChange}
                      disabled={loading}
                      rows={3}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sécurité */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                Sécurité
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Votre mot de passe"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-12 ${
                        errors.password
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("password")}
                      disabled={loading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirmez votre mot de passe"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-12 ${
                        errors.confirmPassword
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg disabled:shadow-none"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Création en cours...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">🚀</span>
                  <span>Créer mon compte</span>
                </>
              )}
            </button>
          </form>

          {/* Liens supplémentaires */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
