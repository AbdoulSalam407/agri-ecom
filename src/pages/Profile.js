import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    farmName: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (currentUser) {
      setProfile({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        farmName: currentUser.farmName || "",
        description: currentUser.description || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await updateProfile(profile);

      if (result.success) {
        setMessage({
          type: "success",
          text: "Profil mis à jour avec succès !",
        });
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la mise à jour du profil",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      farmName: currentUser.farmName || "",
      description: currentUser.description || "",
    });
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="not-connected">
          <div className="not-connected-icon">🔒</div>
          <h2>Non connecté</h2>
          <p>Veuillez vous connecter pour accéder à votre profil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-icon">👤</span>
        </div>
        <div className="profile-info">
          <h1 className="profile-title">Mon Profil</h1>
          <p className="profile-role">
            {currentUser.role === "admin" && "👨‍💼 Administrateur"}
            {currentUser.role === "producer" && "👨‍🌾 Producteur"}
            {currentUser.role === "user" && "👤 Client"}
          </p>
          <p className="profile-member-since">
            Membre depuis le{" "}
            {new Date(currentUser.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      <div className="profile-form">
        <div className="form-section">
          <h3 className="section-title">Informations personnelles</h3>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              📝 Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="Votre nom complet"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              📧 Adresse email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="votre@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              📞 Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              placeholder="+221 XX XXX XX XX"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              🏠 Adresse
            </label>
            <textarea
              id="address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-textarea"
              placeholder="Votre adresse complète"
              rows="3"
            />
          </div>
        </div>

        {currentUser.role === "producer" && (
          <div className="form-section">
            <h3 className="section-title">Informations de l'exploitation</h3>

            <div className="form-group">
              <label htmlFor="farmName" className="form-label">
                🏡 Nom de l'exploitation
              </label>
              <input
                type="text"
                id="farmName"
                name="farmName"
                value={profile.farmName}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-input"
                placeholder="Nom de votre ferme ou exploitation"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                📄 Description
              </label>
              <textarea
                id="description"
                name="description"
                value={profile.description}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-textarea"
                placeholder="Décrivez votre exploitation..."
                rows="4"
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "💾 Sauvegarde..." : "💾 Sauvegarder"}
              </button>
              <button onClick={handleCancel} className="btn-secondary">
                ❌ Annuler
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              ✏️ Modifier le profil
            </button>
          )}
        </div>
      </div>

      {/* Statistiques du compte */}
      <div className="account-stats">
        <h3 className="section-title">Statistiques du compte</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">
              {currentUser.role === "producer" ? "📦" : "🛒"}
            </div>
            <div className="stat-label">
              {currentUser.role === "producer"
                ? "Produits publiés"
                : "Achats effectués"}
            </div>
            <div className="stat-number">0</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">⭐</div>
            <div className="stat-label">Évaluation</div>
            <div className="stat-number">-</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">📅</div>
            <div className="stat-label">Dernière connexion</div>
            <div className="stat-number">
              {currentUser.lastLogin
                ? new Date(currentUser.lastLogin).toLocaleDateString("fr-FR")
                : "Jamais"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
