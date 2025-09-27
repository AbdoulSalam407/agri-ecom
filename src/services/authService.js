// Simulation d'une API avec localStorage

// Importer les données initiales en premier (règle import/first)
import initialUsers from "../data/users.json";

const STORAGE_KEY = "agriecom_users";
const CURRENT_USER_KEY = "agriecom_current_user";

// Validation des données utilisateur (définie avant utilisation)
const validateUserData = (userData, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || userData.email !== undefined) {
    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push("Email invalide");
    }
  }

  if (!isUpdate && (!userData.password || userData.password.length < 6)) {
    errors.push("Le mot de passe doit contenir au moins 6 caractères");
  }

  if (!isUpdate || userData.name !== undefined) {
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push("Le nom doit contenir au moins 2 caractères");
    }
  }

  return errors;
};

// Fonction d'initialisation
const initializeUsers = () => {
  try {
    const existingUsers = localStorage.getItem(STORAGE_KEY);
    if (!existingUsers || JSON.parse(existingUsers).length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
      console.log("Utilisateurs initialisés depuis users.json");
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation des utilisateurs:", error);
  }
};

// Appeler l'initialisation au chargement du module
initializeUsers();

export const authService = {
  // Récupérer tous les utilisateurs
  getUsers: () => {
    try {
      const users = localStorage.getItem(STORAGE_KEY);
      return users ? JSON.parse(users) : initialUsers; // Fallback sur les données initiales
    } catch (error) {
      console.error("Erreur lors de la lecture des utilisateurs:", error);
      return initialUsers; // Retourner les données initiales en cas d'erreur
    }
  },

  // Sauvegarder les utilisateurs
  saveUsers: (users) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des utilisateurs:", error);
      return false;
    }
  },

  // Connexion
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!email || !password) {
            reject(new Error("Email et mot de passe requis"));
            return;
          }

          const users = authService.getUsers();
          console.log("Utilisateurs disponibles pour la connexion:", users); // Debug

          const user = users.find(
            (u) =>
              u.email.toLowerCase() === email.toLowerCase() &&
              u.password === password &&
              !u.blocked
          );

          if (user) {
            console.log("Utilisateur trouvé:", user); // Debug
            // Mettre à jour la dernière connexion
            const updatedUser = {
              ...user,
              lastLogin: new Date().toISOString(),
            };

            const updatedUsers = users.map((u) =>
              u.id === user.id ? updatedUser : u
            );
            authService.saveUsers(updatedUsers);

            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
            resolve(updatedUser);
          } else {
            // Vérifier si l'utilisateur existe mais est bloqué
            const blockedUser = users.find(
              (u) =>
                u.email.toLowerCase() === email.toLowerCase() &&
                u.password === password &&
                u.blocked
            );

            if (blockedUser) {
              reject(
                new Error(
                  "Votre compte a été bloqué. Contactez l'administrateur."
                )
              );
            } else {
              console.log("Aucun utilisateur trouvé pour:", email); // Debug
              reject(new Error("Email ou mot de passe incorrect"));
            }
          }
        } catch (error) {
          console.error("Erreur lors de la connexion:", error);
          reject(new Error("Erreur lors de la connexion"));
        }
      }, 1000);
    });
  },

  // Inscription
  register: (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Validation des données
          const validationErrors = validateUserData(userData);
          if (validationErrors.length > 0) {
            reject(new Error(validationErrors.join(", ")));
            return;
          }

          const users = authService.getUsers();
          const existingUser = users.find(
            (u) => u.email.toLowerCase() === userData.email.toLowerCase()
          );

          if (existingUser) {
            reject(new Error("Un utilisateur avec cet email existe déjà"));
            return;
          }

          const newUser = {
            id: Date.now().toString(),
            email: userData.email.toLowerCase(),
            password: userData.password,
            name: userData.name.trim(),
            role: userData.role || "user",
            phone: userData.phone || "",
            address: userData.address || "",
            farmName: userData.farmName || "",
            description: userData.description || "",
            blocked: false,
            createdAt: new Date().toISOString(),
            lastLogin: null,
          };

          const updatedUsers = [...users, newUser];
          const saveSuccess = authService.saveUsers(updatedUsers);

          if (!saveSuccess) {
            reject(new Error("Erreur lors de la création du compte"));
            return;
          }

          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
          resolve(newUser);
        } catch (error) {
          reject(new Error("Erreur lors de l'inscription"));
        }
      }, 1000);
    });
  },

  // Déconnexion
  logout: () => {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
      return true;
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      return false;
    }
  },

  // Récupérer l'utilisateur courant
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  },

  // Mettre à jour le profil
  updateProfile: (userId, userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Validation des données (pour la mise à jour)
          const validationErrors = validateUserData(userData, true);
          if (validationErrors.length > 0) {
            reject(new Error(validationErrors.join(", ")));
            return;
          }

          const users = authService.getUsers();
          const userIndex = users.findIndex((user) => user.id === userId);

          if (userIndex === -1) {
            reject(new Error("Utilisateur non trouvé"));
            return;
          }

          // Vérifier si l'email est déjà utilisé par un autre utilisateur
          if (userData.email) {
            const emailExists = users.some(
              (user, index) =>
                index !== userIndex &&
                user.email.toLowerCase() === userData.email.toLowerCase()
            );

            if (emailExists) {
              reject(
                new Error("Cet email est déjà utilisé par un autre utilisateur")
              );
              return;
            }
          }

          const updatedUser = {
            ...users[userIndex],
            ...userData,
            // Ne pas permettre la modification de certains champs via updateProfile
            id: users[userIndex].id,
            role: users[userIndex].role,
            blocked: users[userIndex].blocked,
            createdAt: users[userIndex].createdAt,
            lastLogin: users[userIndex].lastLogin,
          };

          // Nettoyer les champs undefined
          Object.keys(updatedUser).forEach((key) => {
            if (updatedUser[key] === undefined) {
              updatedUser[key] = users[userIndex][key];
            }
          });

          users[userIndex] = updatedUser;
          const saveSuccess = authService.saveUsers(users);

          if (!saveSuccess) {
            reject(new Error("Erreur lors de la mise à jour du profil"));
            return;
          }

          // Mettre à jour l'utilisateur courant si c'est le même
          const currentUser = authService.getCurrentUser();
          if (currentUser && currentUser.id === userId) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
          }

          resolve(updatedUser);
        } catch (error) {
          reject(new Error("Erreur lors de la mise à jour du profil"));
        }
      }, 500);
    });
  },

  // Bloquer/débloquer un utilisateur (admin)
  toggleBlockUser: (userId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = authService.getUsers();
          const userIndex = users.findIndex((user) => user.id === userId);

          if (userIndex === -1) {
            reject(new Error("Utilisateur non trouvé"));
            return;
          }

          const updatedUser = {
            ...users[userIndex],
            blocked: !users[userIndex].blocked,
          };

          users[userIndex] = updatedUser;
          const saveSuccess = authService.saveUsers(users);

          if (!saveSuccess) {
            reject(new Error("Erreur lors de la modification du statut"));
            return;
          }

          // Déconnecter l'utilisateur si bloqué
          if (updatedUser.blocked) {
            const currentUser = authService.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
              authService.logout();
            }
          }

          resolve(updatedUser);
        } catch (error) {
          reject(new Error("Erreur lors de la modification du statut"));
        }
      }, 500);
    });
  },

  // Rechercher des utilisateurs (admin)
  searchUsers: (query) => {
    try {
      const users = authService.getUsers();
      if (!query) return users;

      return users.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          (user.farmName &&
            user.farmName.toLowerCase().includes(query.toLowerCase()))
      );
    } catch (error) {
      console.error("Erreur lors de la recherche des utilisateurs:", error);
      return [];
    }
  },

  // Supprimer un utilisateur (admin)
  deleteUser: (userId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = authService.getUsers();
          const filteredUsers = users.filter((user) => user.id !== userId);

          if (filteredUsers.length === users.length) {
            reject(new Error("Utilisateur non trouvé"));
            return;
          }

          const saveSuccess = authService.saveUsers(filteredUsers);

          if (!saveSuccess) {
            reject(new Error("Erreur lors de la suppression"));
            return;
          }

          // Déconnecter l'utilisateur si c'est le compte courant
          const currentUser = authService.getCurrentUser();
          if (currentUser && currentUser.id === userId) {
            authService.logout();
          }

          resolve(true);
        } catch (error) {
          reject(new Error("Erreur lors de la suppression"));
        }
      }, 500);
    });
  },
};
