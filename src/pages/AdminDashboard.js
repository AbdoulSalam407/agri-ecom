// Importation de React et du hook useState pour gérer l'état local
import React, { useState } from "react";

// Définition du composant AdminDashboard (Tableau de bord administrateur)
const AdminDashboard = () => {
  // État pour stocker la liste des utilisateurs
  // useState([]) initialise un état avec un tableau vide
  // Ici, on initialise directement avec des données de démonstration
  const [users] = useState([
    {
      id: 1,
      name: "Alice Martin",
      email: "alice@email.com",
      role: "user",
      status: "actif",
    },
    {
      id: 2,
      name: "Bob Wilson",
      email: "bob@email.com",
      role: "producer",
      status: "bloqué",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@email.com",
      role: "user",
      status: "actif",
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana@email.com",
      role: "admin",
      status: "actif",
    },
  ]);

  // Rendu du composant
  return (
    // Conteneur principal avec padding et fond
    <div className="min-h-screen bg-gray-50 p-6">
      {/* === EN-TÊTE DU TABLEAU DE BORD === */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Tableau de Bord Administrateur
        </h1>
        <p className="text-gray-600">
          Gérez les utilisateurs et surveillez l'activité de la plateforme
        </p>
      </div>

      {/* === CARTES DE STATISTIQUES === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Carte : Nombre total d'utilisateurs */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Utilisateurs totaux
              </p>
              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            </div>
          </div>
        </div>

        {/* Carte : Utilisateurs actifs */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Utilisateurs actifs
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {users.filter((user) => user.status === "actif").length}
              </p>
            </div>
          </div>
        </div>

        {/* Carte : Utilisateurs bloqués */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">❌</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Utilisateurs bloqués
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {users.filter((user) => user.status === "bloqué").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* === TABLEAU DES UTILISATEURS === */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {/* En-tête du tableau */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Gestion des Utilisateurs
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Liste de tous les utilisateurs inscrits sur la plateforme
          </p>
        </div>

        {/* Contenu du tableau */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* En-têtes de colonnes */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Corps du tableau */}
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Boucle sur chaque utilisateur pour créer une ligne */}
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Colonne Informations utilisateur */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>

                  {/* Colonne Rôle */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "producer"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Colonne Statut */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        user.status === "actif"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "actif" ? "✅ Actif" : "❌ Bloqué"}
                    </span>
                  </td>

                  {/* Colonne Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {/* Bouton Modifier */}
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                        Modifier
                      </button>

                      {/* Bouton Bloqué/Débloquer conditionnel */}
                      {user.status === "actif" ? (
                        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                          Bloquer
                        </button>
                      ) : (
                        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                          Débloquer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Affichage de {users.length} utilisateur(s)
          </p>
        </div>
      </div>
    </div>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default AdminDashboard;
