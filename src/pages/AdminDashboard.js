import React, { useState } from "react";

const AdminDashboard = () => {
  const [users] = useState([
    { id: 1, name: "Utilisateur 1", status: "actif" },
    { id: 2, name: "Utilisateur 2", status: "bloqué" },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <h2 className="mt-4 mb-2 font-semibold">Utilisateurs</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} - {u.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
