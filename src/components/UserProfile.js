import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const UserProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "acheteur");
  const [editing, setEditing] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      username,
      email,
      role,
    };

    login(updatedUser.username, updatedUser.role); // Met à jour dans AuthContext
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setEditing(false);
    alert("Profil mis à jour avec succès ✅");
  };

  if (!user) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl">Veuillez vous connecter pour voir votre profil.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Mon Profil</h2>

      {!editing ? (
        <div className="space-y-3">
          <p><span className="font-semibold">Nom d’utilisateur :</span> {user.username}</p>
          <p><span className="font-semibold">Email :</span> {user.email || "Non renseigné"}</p>
          <p><span className="font-semibold">Rôle :</span> {user.role}</p>

          <button
            onClick={() => setEditing(true)}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4"
          >
            Modifier le profil
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-3">
          <input
            type="text"
            placeholder="Nom d’utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="acheteur">Acheteur</option>
            <option value="producteur">Producteur</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Enregistrer
          </button>

          <button
            type="button"
            onClick={() => setEditing(false)}
            className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
          >
            Annuler
          </button>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
