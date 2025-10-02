// Importation des données utilisateurs initiales depuis un fichier JSON
import initialUsers from "../data/users.json";

// Clés pour le stockage localStorage
const STORAGE_KEY = "agriecom_users"; // Clé pour stocker tous les utilisateurs
const CURRENT_USER_KEY = "agriecom_current_user"; // Clé pour l'utilisateur connecté

// ===== FONCTION DE VALIDATION DES DONNÉES UTILISATEUR =====
// Cette fonction vérifie que les données utilisateur sont valides
const validateUserData = (userData, isUpdate = false) => {
  const errors = []; // Tableau pour stocker les erreurs

  // Validation de l'email (seulement si nouveau ou si email modifié)
  if (!isUpdate || userData.email !== undefined) {
    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push("Email invalide");
    }
  }

  // Validation du mot de passe (seulement pour les nouvelles inscriptions)
  if (!isUpdate && (!userData.password || userData.password.length < 6)) {
    errors.push("Le mot de passe doit contenir au moins 6 caractères");
  }

  // Validation du nom (seulement si nouveau ou si nom modifié)
  if (!isUpdate || userData.name !== undefined) {
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push("Le nom doit contenir au moins 2 caractères");
    }
  }

  return errors; // Retourne la liste des erreurs
};

// ===== FONCTION D'INITIALISATION DES DONNÉES =====
// Cette fonction prépare les données utilisateurs au démarrage de l'application
const initializeUsers = () => {
  try {
    // Vérifie si des utilisateurs existent déjà dans le localStorage
    const existingUsers = localStorage.getItem(STORAGE_KEY);

    // Si aucun utilisateur n'existe ou si la liste est vide, on initialise avec les données JSON
    if (!existingUsers || JSON.parse(existingUsers).length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
      console.log(
        "✅ Utilisateurs initialisés depuis users.json:",
        initialUsers.length,
        "utilisateurs"
      );
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'initialisation des utilisateurs:",
      error
    );
  }
};

// ===== INITIALISATION AU CHARGEMENT DU MODULE =====
// Appelle la fonction d'initialisation dès que ce fichier est importé
initializeUsers();

// ===== EXPORTATION DU SERVICE D'AUTHENTIFICATION =====
// Cet objet contient toutes les fonctions pour gérer l'authentification
export const authService = {
  // ===== RÉCUPÉRER TOUS LES UTILISATEURS =====
  getUsers: () => {
    try {
      // Récupère les utilisateurs depuis le localStorage
      const users = localStorage.getItem(STORAGE_KEY);

      if (users) {
        // Convertit la chaîne JSON en objet JavaScript
        const parsedUsers = JSON.parse(users);
        return parsedUsers;
      } else {
        // Si le localStorage est vide, retourne les données initiales
        console.log("📁 localStorage vide, retour aux données initiales");
        return initialUsers;
      }
    } catch (error) {
      // En cas d'erreur, retourne les données initiales
      console.error("❌ Erreur lors de la lecture des utilisateurs:", error);
      return initialUsers;
    }
  },

  // ===== SAUVEGARDER LES UTILISATEURS =====
  saveUsers: (users) => {
    try {
      // Convertit les utilisateurs en JSON et les sauvegarde
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      return true; // Succès
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde des utilisateurs:", error);
      return false; // Échec
    }
  },

  // ===== FONCTION DE CONNEXION =====
  // Cette fonction vérifie les identifiants et connecte l'utilisateur
  login: (email, password) => {
    // Retourne une Promise (objet pour gérer les opérations asynchrones)
    return new Promise((resolve, reject) => {
      // Simule un délai réseau de 500ms
      setTimeout(() => {
        try {
          // Validation basique des champs
          if (!email || !password) {
            reject(new Error("Email et mot de passe requis"));
            return;
          }

          // Récupère tous les utilisateurs
          const users = authService.getUsers();
          // Nettoie et normalise l'email
          const cleanEmail = email.toLowerCase().trim();
          // Nettoie le mot de passe
          const cleanPassword = password.trim();

          console.log("🔄 LOGIN - Recherche utilisateur:", cleanEmail);
          console.log(
            "📋 Utilisateurs en base:",
            users.map((u) => ({
              id: u.id,
              email: u.email,
              role: u.role,
              blocked: u.blocked,
            }))
          );

          let userFound = null; // Utilisateur trouvé
          let rejectionReason = null; // Raison du rejet

          // Parcourt tous les utilisateurs pour trouver une correspondance
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const userEmail = user.email ? user.email.toLowerCase().trim() : "";

            console.log(`🔍 Vérification: ${userEmail} vs ${cleanEmail}`);

            // Vérifie si l'email correspond
            if (userEmail === cleanEmail) {
              // Email trouvé, vérification du mot de passe
              if (user.password === cleanPassword) {
                // Vérifie si le compte n'est pas bloqué
                if (!user.blocked) {
                  userFound = user;
                  break; // Sort de la boucle
                } else {
                  rejectionReason =
                    "Votre compte a été bloqué. Contactez l'administrateur.";
                  break;
                }
              } else {
                rejectionReason = "Mot de passe incorrect";
                break;
              }
            }
          }

          // Si un utilisateur valide est trouvé
          if (userFound) {
            console.log("✅ CONNEXION RÉUSSIE:", userFound.name);

            // Met à jour la date de dernière connexion
            const updatedUser = {
              ...userFound, // Copie toutes les propriétés de userFound
              lastLogin: new Date().toISOString(), // Ajoute la date actuelle
            };

            // Met à jour l'utilisateur dans la liste
            const updatedUsers = users.map((u) =>
              u.id === userFound.id ? updatedUser : u
            );

            // Sauvegarde la liste mise à jour
            authService.saveUsers(updatedUsers);
            // Sauvegarde l'utilisateur connecté dans le localStorage
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

            // Résout la Promise avec l'utilisateur mis à jour
            resolve(updatedUser);
          } else {
            // Aucun utilisateur trouvé
            if (rejectionReason) {
              reject(new Error(rejectionReason));
            } else {
              reject(new Error(`Aucun compte trouvé avec l'email: ${email}`));
            }
          }
        } catch (error) {
          // Gestion des erreurs techniques
          console.error("❌ Erreur technique lors de la connexion:", error);
          reject(new Error("Erreur technique lors de la connexion"));
        }
      }, 500); // Délai de 500ms
    });
  },

  // ===== FONCTION DE DÉBOGAGE POUR TESTER LA CONNEXION =====
  debugLogin: (email, password) => {
    console.log("🧪 DÉBUT DU DÉBOGAGE LOGIN");

    const users = authService.getUsers();
    const cleanEmail = email.toLowerCase().trim();

    // Affiche tous les utilisateurs pour le débogage
    console.log("📊 LISTE COMPLÈTE DES UTILISATEURS:");
    users.forEach((user) => {
      console.log(
        `- ID: ${user.id}, Email: "${user.email}", Password: "${user.password}", Role: ${user.role}`
      );
    });

    console.log(
      `🔍 RECHERCHE: "${cleanEmail}" avec mot de passe: "${password}"`
    );

    // Recherche l'utilisateur avec email et mot de passe exacts
    const foundUser = users.find((user) => {
      const userEmail = user.email.toLowerCase().trim();
      return userEmail === cleanEmail && user.password === password;
    });

    if (foundUser) {
      console.log("✅ UTILISATEUR TROUVÉ:", foundUser);
      return { success: true, user: foundUser };
    } else {
      console.log("❌ UTILISATEUR NON TROUVÉ");

      // Vérification étape par étape pour comprendre l'erreur
      const userByEmail = users.find(
        (user) => user.email.toLowerCase().trim() === cleanEmail
      );

      if (userByEmail) {
        console.log("📧 Email trouvé mais problème de mot de passe");
        console.log(`🔑 Mot de passe fourni: "${password}"`);
        console.log(`🔑 Mot de passe stocké: "${userByEmail.password}"`);
        console.log(`✅ Correspondance: ${userByEmail.password === password}`);

        if (userByEmail.blocked) {
          console.log("🚫 Compte bloqué");
        }
      } else {
        console.log("📧 Email non trouvé dans la base");
        console.log(
          "📧 Emails disponibles:",
          users.map((u) => u.email.toLowerCase())
        );
      }

      return { success: false, user: null };
    }
  },

  // ===== VÉRIFICATION RAPIDE DES DONNÉES =====
  checkData: () => {
    const users = authService.getUsers();
    console.log("🔍 VÉRIFICATION DES DONNÉES:");
    console.log("Nombre d'utilisateurs:", users.length);

    // Affiche chaque utilisateur avec ses informations principales
    users.forEach((user) => {
      console.log(
        `- ${user.email} (${user.role}): ${user.blocked ? "BLOQUÉ" : "ACTIF"}`
      );
    });

    return users;
  },

  // ===== FONCTION D'INSCRIPTION =====
  register: (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Validation des données du formulaire
          const validationErrors = validateUserData(userData);
          if (validationErrors.length > 0) {
            reject(new Error(validationErrors.join(", ")));
            return;
          }

          const users = authService.getUsers();
          const cleanEmail = userData.email.toLowerCase().trim();

          // Vérifie si l'email existe déjà
          const existingUser = users.find(
            (u) => u.email.toLowerCase().trim() === cleanEmail
          );

          if (existingUser) {
            reject(new Error("Un utilisateur avec cet email existe déjà"));
            return;
          }

          // Crée un nouvel utilisateur
          const newUser = {
            id: Date.now().toString(), // ID unique basé sur le timestamp
            email: cleanEmail,
            password: userData.password.trim(),
            name: userData.name.trim(),
            role: userData.role || "user", // Rôle par défaut: "user"
            phone: userData.phone || "",
            address: userData.address || "",
            farmName: userData.farmName || "",
            description: userData.description || "",
            blocked: false, // Nouveau compte non bloqué
            createdAt: new Date().toISOString(), // Date de création
            lastLogin: null, // Pas encore connecté
          };

          // Ajoute le nouvel utilisateur à la liste
          const updatedUsers = [...users, newUser];
          const saveSuccess = authService.saveUsers(updatedUsers);

          if (!saveSuccess) {
            reject(new Error("Erreur lors de la création du compte"));
            return;
          }

          // Connecte automatiquement le nouvel utilisateur
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

  // ===== FONCTION DE DÉCONNEXION =====
  logout: () => {
    try {
      // Supprime l'utilisateur connecté du localStorage
      localStorage.removeItem(CURRENT_USER_KEY);
      console.log("👋 Utilisateur déconnecté");
      return true;
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error);
      return false;
    }
  },

  // ===== RÉCUPÉRER L'UTILISATEUR ACTUELLEMENT CONNECTÉ =====
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(CURRENT_USER_KEY);
      const parsedUser = user ? JSON.parse(user) : null;
      return parsedUser;
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération de l'utilisateur:",
        error
      );
      return null;
    }
  },

  // ===== METTRE À JOUR LE PROFIL =====
  updateProfile: (userId, userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Validation des données (mode mise à jour)
          const validationErrors = validateUserData(userData, true);
          if (validationErrors.length > 0) {
            reject(new Error(validationErrors.join(", ")));
            return;
          }

          const users = authService.getUsers();
          // Trouve l'index de l'utilisateur à modifier
          const userIndex = users.findIndex((user) => user.id === userId);

          if (userIndex === -1) {
            reject(new Error("Utilisateur non trouvé"));
            return;
          }

          // Vérifie si le nouvel email n'est pas déjà utilisé
          if (userData.email) {
            const cleanEmail = userData.email.toLowerCase().trim();
            const emailExists = users.some(
              (user, index) =>
                index !== userIndex && // Ignore l'utilisateur actuel
                user.email.toLowerCase().trim() === cleanEmail
            );

            if (emailExists) {
              reject(
                new Error("Cet email est déjà utilisé par un autre utilisateur")
              );
              return;
            }
          }

          // Crée l'utilisateur mis à jour
          const updatedUser = {
            ...users[userIndex], // Conserve les anciennes données
            ...userData, // Applique les nouvelles données
            id: users[userIndex].id, // Garde le même ID
            role: users[userIndex].role, // Ne change pas le rôle
            blocked: users[userIndex].blocked, // Ne change pas le statut bloqué
            createdAt: users[userIndex].createdAt, // Garde la date de création
          };

          // Nettoie les champs undefined
          Object.keys(updatedUser).forEach((key) => {
            if (updatedUser[key] === undefined) {
              updatedUser[key] = users[userIndex][key];
            }
          });

          // Met à jour la liste des utilisateurs
          users[userIndex] = updatedUser;
          authService.saveUsers(users);

          // Si l'utilisateur modifié est celui connecté, met à jour la session
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

  // ===== BLOQUER/DÉBLOQUER UN UTILISATEUR =====
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

          // Inverse le statut bloqué
          const updatedUser = {
            ...users[userIndex],
            blocked: !users[userIndex].blocked,
          };

          users[userIndex] = updatedUser;
          authService.saveUsers(users);

          // Si l'utilisateur bloqué est connecté, le déconnecte
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

  // ===== RECHERCHER DES UTILISATEURS =====
  searchUsers: (query) => {
    try {
      const users = authService.getUsers();
      if (!query) return users; // Retourne tous si pas de recherche

      const cleanQuery = query.toLowerCase().trim();
      // Filtre les utilisateurs selon le critère de recherche
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

  // ===== SUPPRIMER UN UTILISATEUR =====
  deleteUser: (userId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = authService.getUsers();
          // Filtre pour supprimer l'utilisateur
          const filteredUsers = users.filter((user) => user.id !== userId);

          // Vérifie si un utilisateur a été supprimé
          if (filteredUsers.length === users.length) {
            reject(new Error("Utilisateur non trouvé"));
            return;
          }

          authService.saveUsers(filteredUsers);

          // Si l'utilisateur supprimé est connecté, le déconnecte
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

  // ===== RÉINITIALISER LES DONNÉES (DEBUG) =====
  resetData: () => {
    try {
      // Supprime toutes les données du localStorage
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      // Réinitialise avec les données JSON
      initializeUsers();
      console.log("🔄 Données réinitialisées avec succès");
      return true;
    } catch (error) {
      console.error("❌ Erreur lors de la réinitialisation:", error);
      return false;
    }
  },
};
