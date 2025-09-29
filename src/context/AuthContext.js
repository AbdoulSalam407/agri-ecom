import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const user = authService.getCurrentUser();
        console.log("🔄 AuthContext - Utilisateur chargé:", user);
        setCurrentUser(user);
      } catch (error) {
        console.error(
          "❌ AuthContext - Erreur lors du chargement de l'utilisateur:",
          error
        );
        setCurrentUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
        console.log("✅ AuthContext - Initialisation terminée");
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis" };
    }

    setLoading(true);
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      console.log("✅ AuthContext - Connexion réussie:", user.name);
      return { success: true, user };
    } catch (error) {
      console.error("❌ AuthContext - Erreur de connexion:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    const { email, password, name, role = "user" } = userData;

    if (!email || !password || !name) {
      return {
        success: false,
        error: "Tous les champs obligatoires doivent être remplis",
      };
    }

    setLoading(true);
    try {
      const user = await authService.register(userData);
      setCurrentUser(user);
      console.log("✅ AuthContext - Inscription réussie:", user.name);
      return { success: true, user };
    } catch (error) {
      console.error("❌ AuthContext - Erreur d'inscription:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      console.log("👋 AuthContext - Déconnexion de:", currentUser?.name);
      setCurrentUser(null);
      authService.logout();

      // Optionnel : Rediriger vers la page d'accueil après déconnexion
      setTimeout(() => {
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }, 100);
    } catch (error) {
      console.error("❌ AuthContext - Erreur lors de la déconnexion:", error);
    }
  };

  const updateProfile = async (userData) => {
    if (!currentUser) {
      return { success: false, error: "Aucun utilisateur connecté" };
    }

    try {
      const updatedUser = await authService.updateProfile(
        currentUser.id,
        userData
      );
      setCurrentUser(updatedUser);
      console.log("✅ AuthContext - Profil mis à jour:", updatedUser.name);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error(
        "❌ AuthContext - Erreur lors de la mise à jour du profil:",
        error
      );
      return { success: false, error: error.message };
    }
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    const hasRole = currentUser?.role === role;
    console.log(`🔍 AuthContext - Vérification rôle ${role}:`, hasRole);
    return hasRole;
  };

  // Vérifier si l'utilisateur a l'un des rôles spécifiés
  const hasAnyRole = (roles) => {
    const hasAny = roles.includes(currentUser?.role);
    console.log(`🔍 AuthContext - Vérification rôles ${roles}:`, hasAny);
    return hasAny;
  };

  // Vérifier si l'utilisateur est connecté
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

  // Obtenir le rôle de l'utilisateur
  const getUserRole = () => {
    const role = currentUser?.role || "guest";
    console.log(`🔍 AuthContext - Rôle utilisateur:`, role);
    return role;
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    loading,
    authChecked,
    hasRole,
    hasAnyRole,
    isAuthenticated,
    isBlocked,
    getUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
