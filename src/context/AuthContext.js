// Importation de React et des hooks nécessaires
import React, { createContext, useState, useContext, useEffect } from "react";

// Importation du service d'authentification qui gère les appels API
import { authService } from "../services/authService";

// Création du contexte d'authentification
// Un contexte permet de partager des données entre plusieurs composants sans passer par les props
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
// Ce hook permet d'accéder aux données et fonctions d'authentification depuis n'importe quel composant
export const useAuth = () => {
  // Récupère le contexte actuel
  const context = useContext(AuthContext);

  // Vérification de sécurité : s'assure qu'on utilise le hook dans un composant enfant de AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Retourne toutes les données et fonctions d'authentification
  return context;
};

// Composant Provider qui englobe l'application et fournit le contexte d'authentification
// Les "children" sont tous les composants enfants qui pourront utiliser useAuth()
export const AuthProvider = ({ children }) => {
  // État pour stocker l'utilisateur actuellement connecté (null si déconnecté)
  const [currentUser, setCurrentUser] = useState(null);

  // État pour gérer le chargement (pendant les requêtes login/register)
  const [loading, setLoading] = useState(true);

  // État pour savoir si la vérification d'authentification initiale est terminée
  const [authChecked, setAuthChecked] = useState(false);

  // ===== EFFET POUR CHARGER L'UTILISATEUR AU DÉMARRAGE DE L'APPLICATION =====
  // useEffect s'exécute après le premier rendu du composant
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Tente de récupérer l'utilisateur depuis le localStorage ou les cookies
        const user = authService.getCurrentUser();
        console.log("🔄 AuthContext - Utilisateur chargé:", user);

        // Met à jour l'état avec l'utilisateur récupéré
        setCurrentUser(user);
      } catch (error) {
        // En cas d'erreur, on déconnecte l'utilisateur
        console.error(
          "❌ AuthContext - Erreur lors du chargement de l'utilisateur:",
          error
        );
        setCurrentUser(null);
      } finally {
        // Dans tous les cas, on arrête le chargement et on marque la vérification comme terminée
        setLoading(false);
        setAuthChecked(true);
        console.log("✅ AuthContext - Initialisation terminée");
      }
    };

    // Appel de la fonction d'initialisation
    initializeAuth();
  }, []); // Le tableau vide [] signifie que cet effet ne s'exécute qu'une fois au montage du composant

  // ===== FONCTION DE CONNEXION =====
  const login = async (email, password) => {
    // Vérification que les champs obligatoires sont remplis
    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis" };
    }

    // Démarre le chargement
    setLoading(true);
    try {
      // Appel au service d'authentification pour se connecter
      const user = await authService.login(email, password);

      // Met à jour l'état avec le nouvel utilisateur connecté
      setCurrentUser(user);
      console.log("✅ AuthContext - Connexion réussie:", user.name);

      // Retourne un succès avec les données de l'utilisateur
      return { success: true, user };
    } catch (error) {
      // En cas d'erreur, retourne un message d'erreur
      console.error("❌ AuthContext - Erreur de connexion:", error);
      return { success: false, error: error.message };
    } finally {
      // Arrête le chargement dans tous les cas (succès ou erreur)
      setLoading(false);
    }
  };

  // ===== FONCTION D'INSCRIPTION =====
  const register = async (userData) => {
    // Destructuration des données utilisateur avec valeurs par défaut
    const { email, password, name, role = "user" } = userData;

    // Vérification que tous les champs obligatoires sont remplis
    if (!email || !password || !name) {
      return {
        success: false,
        error: "Tous les champs obligatoires doivent être remplis",
      };
    }

    // Démarre le chargement
    setLoading(true);
    try {
      // Appel au service d'authentification pour s'inscrire
      const user = await authService.register(userData);

      // Met à jour l'état avec le nouvel utilisateur
      setCurrentUser(user);
      console.log("✅ AuthContext - Inscription réussie:", user.name);

      // Retourne un succès avec les données de l'utilisateur
      return { success: true, user };
    } catch (error) {
      // En cas d'erreur, retourne un message d'erreur
      console.error("❌ AuthContext - Erreur d'inscription:", error);
      return { success: false, error: error.message };
    } finally {
      // Arrête le chargement dans tous les cas
      setLoading(false);
    }
  };

  // ===== FONCTION DE DÉCONNEXION =====
  const logout = () => {
    try {
      console.log("👋 AuthContext - Déconnexion de:", currentUser?.name);

      // Réinitialise l'utilisateur à null
      setCurrentUser(null);

      // Appelle le service pour nettoyer le localStorage/les cookies
      authService.logout();

      // Optionnel : Rediriger vers la page d'accueil après déconnexion
      // Le timeout permet de laisser le temps à l'interface de se mettre à jour
      setTimeout(() => {
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }, 100);
    } catch (error) {
      console.error("❌ AuthContext - Erreur lors de la déconnexion:", error);
    }
  };

  // ===== FONCTION DE MISE À JOUR DU PROFIL =====
  const updateProfile = async (userData) => {
    // Vérifie qu'un utilisateur est connecté
    if (!currentUser) {
      return { success: false, error: "Aucun utilisateur connecté" };
    }

    try {
      // Appel au service pour mettre à jour le profil
      const updatedUser = await authService.updateProfile(
        currentUser.id,
        userData
      );

      // Met à jour l'état avec les nouvelles données utilisateur
      setCurrentUser(updatedUser);
      console.log("✅ AuthContext - Profil mis à jour:", updatedUser.name);

      // Retourne un succès avec les données mises à jour
      return { success: true, user: updatedUser };
    } catch (error) {
      // En cas d'erreur, retourne un message d'erreur
      console.error(
        "❌ AuthContext - Erreur lors de la mise à jour du profil:",
        error
      );
      return { success: false, error: error.message };
    }
  };

  // ===== FONCTIONS DE VÉRIFICATION DES RÔLES ET PERMISSIONS =====

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    const hasRole = currentUser?.role === role;
    console.log(`🔍 AuthContext - Vérification rôle ${role}:`, hasRole);
    return hasRole;
  };

  // Vérifier si l'utilisateur a l'un des rôles spécifiés
  const hasAnyRole = (roles) => {
    // Vérifie si le rôle de l'utilisateur est inclus dans le tableau des rôles autorisés
    const hasAny = roles.includes(currentUser?.role);
    console.log(`🔍 AuthContext - Vérification rôles ${roles}:`, hasAny);
    return hasAny;
  };

  // Vérifier si l'utilisateur est connecté et non bloqué
  const isAuthenticated = () => {
    const isAuth = !!currentUser && !currentUser.blocked;
    console.log(`🔍 AuthContext - Utilisateur authentifié:`, isAuth);
    return isAuth;
  };

  // Vérifier si l'utilisateur est bloqué
  const isBlocked = () => {
    const blocked = currentUser?.blocked === true;
    console.log(`🔍 AuthContext - Utilisateur bloqué:`, blocked);
    return blocked;
  };

  // Obtenir le rôle de l'utilisateur (ou "guest" si non connecté)
  const getUserRole = () => {
    const role = currentUser?.role || "guest";
    console.log(`🔍 AuthContext - Rôle utilisateur:`, role);
    return role;
  };

  // ===== VALEUR FOURNIE PAR LE CONTEXTE =====
  // Toutes les données et fonctions que les composants enfants pourront utiliser
  const value = {
    // Données
    currentUser, // Utilisateur actuel ou null
    loading, // État de chargement
    authChecked, // Si la vérification initiale est terminée

    // Fonctions d'authentification
    login, // Fonction de connexion
    register, // Fonction d'inscription
    logout, // Fonction de déconnexion
    updateProfile, // Fonction de mise à jour du profil

    // Fonctions de vérification
    hasRole, // Vérifier un rôle spécifique
    hasAnyRole, // Vérifier plusieurs rôles
    isAuthenticated, // Vérifier si connecté et non bloqué
    isBlocked, // Vérifier si bloqué
    getUserRole, // Obtenir le rôle
  };

  // Le Provider rend ses enfants avec le contexte fourni
  // Tous les composants enfants pourront utiliser useAuth() pour accéder à "value"
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
