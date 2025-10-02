// Importation de la bibliothèque React (nécessaire pour créer des composants)
import React from "react";

// Importation du composant Link de react-router-dom (pour la navigation entre les pages)
import { Link } from "react-router-dom";

// Définition du composant Footer (pied de page)
const Footer = () => {
  // Le composant retourne le JSX (structure HTML) qui sera affiché
  return (
    // Footer avec fond vert agricole, texte blanc et padding - ajout de mt-auto pour pousser le footer en bas
    <footer className="bg-green-800 text-white py-8 mt-auto">
      {/* Conteneur principal avec largeur maximale et centrage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grille responsive pour les sections - disposition colonne sur mobile, ligne sur desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* === PREMIÈRE SECTION - Logo et slogan === */}
          <div className="flex flex-col">
            {/* Titre avec taille de texte et marge */}
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">🌱</span>
              AgriEcom
            </h2>
            {/* Slogan avec texte plus petit et ligne de hauteur confortable */}
            <p className="text-green-100 leading-relaxed max-w-md">
              Mettre en relation producteurs, éleveurs et acheteurs pour une
              agriculture plus connectée.
            </p>
          </div>

          {/* === DEUXIÈME SECTION - Liens de navigation === */}
          <div className="flex flex-col">
            {/* Titre de section avec marge et taille de texte */}
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            {/* Liste des liens sans puces et avec espacement */}
            <ul className="space-y-3">
              {/* Chaque lien avec effet au survol et transition fluide */}
              {[
                { to: "/", label: "Accueil" },
                { to: "/products", label: "Produits" },
                { to: "/cart", label: "Panier" },
                { to: "/profile", label: "Mon profil" }
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-green-100 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* === TROISIÈME SECTION - Informations de contact === */}
          <div className="flex flex-col">
            {/* Titre de section */}
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            {/* Conteneur des informations de contact avec espacement */}
            <div className="space-y-3 text-green-100">
              {/* Email avec lien mailto */}
              <div className="flex items-start">
                <span className="font-medium min-w-20">Email :</span>
                <a
                  href="mailto:contact@agriecom.com"
                  className="hover:text-white transition-colors duration-200 underline ml-2"
                >
                  contact@agriecom.com
                </a>
              </div>
              {/* Numéro de téléphone */}
              <div className="flex items-center">
                <span className="font-medium min-w-20">Téléphone :</span>
                <span className="ml-2">+221 77 000 00 00</span>
              </div>
              {/* Adresse physique */}
              <div className="flex items-start">
                <span className="font-medium min-w-20">Adresse :</span>
                <span className="ml-2">Thiès, Sénégal</span>
              </div>
            </div>
          </div>
        </div>

        {/* === PARTIE INFÉRIEURE DU FOOTER - Copyright === */}
        <div className="border-t border-green-700 pt-6 text-center text-green-200">
          {/* 
            Ligne de copyright centrée avec bordure supérieure
            new Date().getFullYear() - récupère l'année actuelle automatiquement
          */}
          <p className="text-sm">
            © {new Date().getFullYear()} AgriEcom - Tous droits réservés.
          </p>
          {/* Ajout d'un texte supplémentaire pour les mentions légales */}
          <p className="text-xs mt-2 text-green-300">
            Plateforme de mise en relation agricole
          </p>
        </div>
      </div>
    </footer>
  );
};

// Exportation du composant pour pouvoir l'utiliser ailleurs dans l'application
export default Footer;