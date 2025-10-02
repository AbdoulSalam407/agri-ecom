// userService.js
// Service de gestion des utilisateurs pour les administrateurs
// Ce fichier gère toutes les opérations liées aux utilisateurs (liste, bloquer, débloquer)

// Importation des données utilisateurs initiales depuis un fichier JSON
// Le fichier users.json contient la liste de tous les utilisateurs de la plateforme
import usersData from "../data/users.json";

// Déclaration et initialisation du tableau des utilisateurs
// On utilise let au lieu de const car on va modifier ce tableau
// [...usersData] crée une copie du tableau importé pour éviter de modifier les données originales
let users = [...usersData];

// ===== FONCTION POUR RÉCUPÉRER TOUS LES UTILISATEURS =====
// Cette fonction retourne la liste complète de tous les utilisateurs inscrits sur la plateforme
export const getAllUsers = () => {
  // Retourne simplement le tableau users
  return users;
};

// ===== FONCTION POUR BLOQUER UN UTILISATEUR =====
// Cette fonction permet à un administrateur de bloquer un utilisateur
// Un utilisateur bloqué ne peut plus se connecter à la plateforme
export const blockUser = (id) => {
  // Met à jour le tableau users en utilisant map()
  // map() crée un nouveau tableau en transformant chaque élément
  users = users.map(
    (u) =>
      // Pour chaque utilisateur (u) dans le tableau :
      u.id === id
        ? { ...u, status: "bloqué" } // Si c'est l'utilisateur à bloquer, on change son statut
        : u // Sinon, on garde l'utilisateur inchangé
  );

  // Explication détaillée de la transformation :
  // { ...u, status: "bloqué" } signifie :
  // - Prendre toutes les propriétés de l'utilisateur (u) existant
  // - Remplacer la propriété "status" par "bloqué"
  // - Garder toutes les autres propriétés (nom, email, rôle, etc.)
};

// ===== FONCTION POUR DÉBLOQUER UN UTILISATEUR =====
// Cette fonction permet à un administrateur de débloquer un utilisateur précédemment bloqué
// L'utilisateur retrouve ainsi l'accès à la plateforme
export const unblockUser = (id) => {
  // Même principe que blockUser mais on change le statut en "actif"
  users = users.map(
    (u) =>
      u.id === id
        ? { ...u, status: "actif" } // Si c'est l'utilisateur à débloquer, on change son statut en "actif"
        : u // Sinon, on garde l'utilisateur inchangé
  );
};
