// userService.js
// Gestion des utilisateurs (admin)

import usersData from "../data/users.json";

let users = [...usersData];

export const getAllUsers = () => {
  return users;
};

export const blockUser = (id) => {
  users = users.map((u) => (u.id === id ? { ...u, status: "bloqué" } : u));
};

export const unblockUser = (id) => {
  users = users.map((u) => (u.id === id ? { ...u, status: "actif" } : u));
};
