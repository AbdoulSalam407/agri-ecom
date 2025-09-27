import initialUsers from "../data/users.json";

const STORAGE_KEY = "agriecom_users";
const CURRENT_USER_KEY = "agriecom_current_user";

// Validation des données utilisateur
const validateUserData = (userData, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || userData.email !== undefined) {
    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push('Email invalide');
    }
  }

  if (!isUpdate && (!userData.password || userData.password.length < 6)) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }

  if (!isUpdate || userData.name !== undefined) {
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
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
      console.log("✅ Utilisateurs initialisés depuis users.json:", initialUsers.length, "utilisateurs");
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des utilisateurs:", error);
  }
};

// Appeler l'initialisation au chargement du module
initializeUsers();

export const authService = {
  // Récupérer tous les utilisateurs
  getUsers: () => {
    try {
      const users = localStorage.getItem(STORAGE_KEY);
      if (users) {
        const parsedUsers = JSON.parse(users);
        console.log("📊 Utilisateurs chargés depuis localStorage:", parsedUsers.length);
        return parsedUsers;
      } else {
        console.log("📁 localStorage vide, retour aux données initiales");
        return initialUsers;
      }
    } catch (error) {
      console.error("❌ Erreur lors de la lecture des utilisateurs:", error);
      return initialUsers;
    }
  },

  // Sauvegarder les utilisateurs
  saveUsers: (users) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      console.log("💾 Utilisateurs sauvegardés:", users.length);
      return true;
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde des utilisateurs:", error);
      return false;
    }
  },

  // Connexion
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Validation des entrées
          if (!email || !password) {
            reject(new Error("Email et mot de passe requis"));
            return;
          }

          const users = authService.getUsers();
          const cleanEmail = email.toLowerCase().trim();
          const cleanPassword = password.trim();

          console.log("🔍 Tentative de connexion:", { email: cleanEmail });
          console.log("📋 Utilisateurs disponibles:", users.map(u => ({ 
            email: u.email, 
            role: u.role,
            blocked: u.blocked 
          })));

          // Recherche de l'utilisateur
          const user = users.find(u => {
            const userEmail = u.email ? u.email.toLowerCase().trim() : '';
            const passwordMatch = u.password === cleanPassword;
            const emailMatch = userEmail === cleanEmail;
            const notBlocked = !u.blocked;
            
            console.log(`🔎 Comparaison ${userEmail} : emailMatch=${emailMatch}, passwordMatch=${passwordMatch}, notBlocked=${notBlocked}`);
            
            return emailMatch && passwordMatch && notBlocked;
          });

          if (user) {
            console.log("✅ Connexion réussie pour:", user.name);
            
            // Mettre à jour la dernière connexion
            const updatedUser = {
              ...user,
              lastLogin: new Date().toISOString()
            };

            const updatedUsers = users.map(u => 
              u.id === user.id ? updatedUser : u
            );
            authService.saveUsers(updatedUsers);

            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
            resolve(updatedUser);
          } else {
            // Diagnostic détaillé de l'échec
            const userByEmail = users.find(u => 
              u.email.toLowerCase().trim() === cleanEmail
            );

            if (userByEmail) {
              if (userByEmail.blocked) {
                reject(new Error("Votre compte a été bloqué. Contactez l'administrateur."));
              } else if (userByEmail.password !== cleanPassword) {
                reject(new Error("Mot de passe incorrect"));
              }
            } else {
              reject(new Error("Aucun compte trouvé avec cet email"));
            }
          }
        } catch (error) {
          console.error("❌ Erreur lors de la connexion:", error);
          reject(new Error("Erreur technique lors de la connexion"));
        }
      }, 500);
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
          const cleanEmail = userData.email.toLowerCase().trim();
          
          const existingUser = users.find(u => 
            u.email.toLowerCase().trim() === cleanEmail
          );

          if (existingUser) {
            reject(new Error("Un utilisateur avec cet email existe déjà"));
            return;
          }

          const newUser = {
            id: Date.now().toString(),
            email: cleanEmail,
            password: userData.password.trim(),
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
          console.log("✅ Nouvel utilisateur créé:", newUser.name);
          resolve(newUser);
        } catch (error) {
          console.error("❌ Erreur lors de l'inscription:", error);
          reject(new Error("Erreur lors de l'inscription"));
        }
      }, 500);
    });
  },

  // Déconnexion
  logout: () => {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
      console.log("👋 Utilisateur déconnecté");
      return true;
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error);
      return false;
    }
  },

  // Récupérer l'utilisateur courant
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(CURRENT_USER_KEY);
      const parsedUser = user ? JSON.parse(user) : null;
      console.log("👤 Utilisateur courant:", parsedUser ? parsedUser.name : "Non connecté");
      return parsedUser;
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  },

  // Mettre à jour le profil
  updateProfile: (userId, userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
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

          if (userData.email) {
            const cleanEmail = userData.email.toLowerCase().trim();
            const emailExists = users.some(
              (user, index) =>
                index !== userIndex &&
                user.email.toLowerCase().trim() === cleanEmail
            );

            if (emailExists) {
              reject(new Error("Cet email est déjà utilisé par un autre utilisateur"));
              return;
            }
          }

          const updatedUser = {
            ...users[userIndex],
            ...userData,
            id: users[userIndex].id,
            role: users[userIndex].role,
            blocked: users[userIndex].blocked,
            createdAt: users[userIndex].createdAt,
          };

          // Nettoyage des champs
          Object.keys(updatedUser).forEach((key) => {
            if (updatedUser[key] === undefined) {
              updatedUser[key] = users[userIndex][key];
            }
          });

          users[userIndex] = updatedUser;
          authService.saveUsers(users);

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

  // Bloquer/débloquer un utilisateur
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
          authService.saveUsers(users);

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

  // Rechercher des utilisateurs
  searchUsers: (query) => {
    try {
      const users = authService.getUsers();
      if (!query) return users;

      const cleanQuery = query.toLowerCase().trim();
      return users.filter(
        (user) =>
          user.name.toLowerCase().includes(cleanQuery) ||
          user.email.toLowerCase().includes(cleanQuery) ||
          (user.farmName && user.farmName.toLowerCase().includes(cleanQuery))
      );
    } catch (error) {
      console.error("Erreur lors de la recherche des utilisateurs:", error);
      return [];
    }
  },

  // Supprimer un utilisateur
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

          authService.saveUsers(filteredUsers);

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

  // Réinitialiser les données (debug)
  resetData: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      initializeUsers();
      console.log("🔄 Données réinitialisées");
      return true;
    } catch (error) {
      console.error("❌ Erreur lors de la réinitialisation:", error);
      return false;
    }
  }
};