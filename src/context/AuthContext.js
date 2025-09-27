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
        setCurrentUser(user);
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
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
      return { success: true, user };
    } catch (error) {
      console.error("Erreur de connexion:", error);
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
      const user = await authService.register({ email, password, name, role });
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      setCurrentUser(null);
      authService.logout();
      // Optionnel : Rediriger vers la page d'accueil après déconnexion
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
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
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      return { success: false, error: error.message };
    }
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  // Vérifier si l'utilisateur a l'un des rôles spécifiés
  const hasAnyRole = (roles) => {
    return roles.includes(currentUser?.role);
  };

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
    return !!currentUser && !currentUser.blocked;
  };

  // Vérifier si l'utilisateur est bloqué
  const isBlocked = () => {
    return currentUser?.blocked === true;
  };

  // Obtenir le rôle de l'utilisateur
  const getUserRole = () => {
    return currentUser?.role || "guest";
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
