import React, { useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Utilisateur",
    email: "user@example.com",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Profil mis à jour !");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      <input
        type="text"
        name="name"
        value={profile.name}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      />
      <input
        type="email"
        name="email"
        value={profile.email}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      />
      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Sauvegarder
      </button>
    </div>
  );
};

export default Profile;
