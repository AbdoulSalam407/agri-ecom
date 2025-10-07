// Importation de React et des hooks useState et useEffect
import React, { useState, useEffect } from "react";

// Importation des composants de navigation et des services
import { Link } from "react-router-dom";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

// Définition du composant Home (page d'accueil)
const Home = () => {
  // État pour stocker la liste des produits
  const [products, setProducts] = useState([]);

  // État pour gérer l'affichage du chargement
  const [loading, setLoading] = useState(true);

  // État pour gérer la slide actuelle du carousel
  const [currentSlide, setCurrentSlide] = useState(0);

  // Récupération des données d'authentification
  const { currentUser, isAuthenticated } = useAuth();

  // Tableau des images et textes pour le carousel
  const carouselImages = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Produits Frais de la Ferme",
      description:
        "Découvrez des produits agricoles frais directement de nos producteurs locaux",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Circuit Court Garanti",
      description:
        "Soutenez l'agriculture locale avec des produits de saison et de qualité",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Livraison Rapide",
      description:
        "Recevez vos produits en 24h-48h, cueillis à maturité pour préserver leurs saveurs",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Agriculture Durable",
      description:
        "Des pratiques respectueuses de l'environnement pour une alimentation saine",
    },
  ];

  // ===== EFFET POUR CHARGER LES PRODUITS AU DÉMARRAGE =====
  useEffect(() => {
    const loadProducts = () => {
      try {
        // Récupère tous les produits depuis le service
        const allProducts = productService.getProducts();
        // Filtre les produits valides et prend les 6 premiers
        const validProducts = allProducts
          .filter((product) => product && product.id)
          .slice(0, 6);
        // Met à jour l'état avec les produits valides
        setProducts(validProducts);
      } catch (error) {
        // En cas d'erreur, on vide la liste des produits
        console.error("Erreur lors du chargement des produits:", error);
        setProducts([]);
      } finally {
        // Arrête le chargement dans tous les cas
        setLoading(false);
      }
    };

    loadProducts();
  }, []); // Le tableau vide [] signifie que cet effet ne s'exécute qu'une fois au démarrage

  // ===== EFFET POUR LE CAROUSEL AUTO =====
  useEffect(() => {
    // Crée un timer qui change de slide toutes les 5 secondes
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // 5000 millisecondes = 5 secondes

    // Nettoyage : supprime le timer quand le composant est démonté
    return () => clearInterval(timer);
  }, [carouselImages.length]); // Dépend de la longueur du carousel

  // ===== FONCTIONS DE NAVIGATION DU CAROUSEL =====

  // Aller à une slide spécifique
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Slide suivante
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  // Slide précédente
  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  // ===== AFFICHAGE PENDANT LE CHARGEMENT =====
  if (loading) {
    return (
      // Écran de chargement stylisé
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        {/* Spinner de chargement */}
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Chargement des produits...</p>
      </div>
    );
  }

  // ===== RENDU PRINCIPAL DE LA PAGE D'ACCUEIL =====
  return (
    <div className="min-h-screen bg-white">
      {/* === SECTION HERO AVEC CAROUSEL === */}
      <section className="relative h-screen overflow-hidden">
        <div className="relative h-full">
          {/* Boucle sur toutes les images du carousel */}
          {carouselImages.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Image de fond */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              ></div>

              {/* Overlay sombre pour mieux lire le texte */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>

              {/* Contenu texte superposé */}
              <div className="relative h-full flex items-center justify-center text-center text-white px-4">
                <div className="max-w-4xl">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* Affiche le bouton "Rejoindre" seulement si non connecté */}
                    {!isAuthenticated() && (
                      <Link
                        to="/register"
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Rejoindre AgriEcom
                      </Link>
                    )}
                    <Link
                      to="/products"
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white border-opacity-30"
                    >
                      Découvrir les produits
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Boutons de navigation du carousel */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 backdrop-blur-sm"
            onClick={prevSlide}
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 backdrop-blur-sm"
            onClick={nextSlide}
          >
            ›
          </button>

          {/* Indicateurs de slide (points en bas) */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white bg-opacity-50 hover:bg-opacity-75"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* === SECTION CATÉGORIES === */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Titre de section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Nos Catégories de Produits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explorez nos différentes catégories de produits frais, locaux et
              de qualité.
            </p>
          </div>

          {/* Grille de catégories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Carte catégorie */}
            {[
              {
                name: "Légumes",
                image:
                  "https://tse2.mm.bing.net/th/id/OIP.FFxXKjWfDMH9ewFmyGFfkwHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
              },
              {
                name: "Fruits",
                image:
                  "https://www.gastronomiac.com/wp/wp-content/uploads/2021/08/Fruits.jpg",
              },
              {
                name: "Grains",
                image:
                  "https://tse1.explicit.bing.net/th/id/OIP.8Gz88cqqE-xdQrSvtn6yTgHaDa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
              },
            ].map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image de fond */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay foncé */}
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                {/* Texte de la catégorie */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold drop-shadow-lg text-center">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === SECTION STATISTIQUES === */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Carte statistique 1 */}
            <div className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {products.length}+
              </div>
              <div className="text-gray-600 font-medium">Produits Frais</div>
            </div>

            {/* Carte statistique 2 */}
            <div className="text-center">
              <div className="text-4xl mb-4">👨‍🌾</div>
              <div className="text-3xl font-bold text-gray-800 mb-2">100%</div>
              <div className="text-gray-600 font-medium">
                Producteurs Locaux
              </div>
            </div>

            {/* Carte statistique 3 */}
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <div className="text-3xl font-bold text-gray-800 mb-2">24h</div>
              <div className="text-gray-600 font-medium">Livraison Rapide</div>
            </div>

            {/* Carte statistique 4 */}
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <div className="text-3xl font-bold text-gray-800 mb-2">5/5</div>
              <div className="text-gray-600 font-medium">
                Satisfaction Client
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION PRODUITS EN VEDETTE === */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête de section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Nos Produits Frais
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Découvrez une sélection de produits frais directement issus de nos
              producteurs partenaires
            </p>
          </div>

          {/* Affichage conditionnel : produits ou message vide */}
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                En attente de nouveaux produits
              </h3>
              <p className="text-gray-600">
                Nos producteurs préparent de nouvelles récoltes
              </p>
            </div>
          ) : (
            <>
              {/* Grille des produits */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Bouton "Voir tous" */}
              <div className="text-center">
                <Link
                  to="/products"
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 group"
                >
                  Voir tous les produits
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* === SECTION AVANTAGES === */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête de section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Pourquoi choisir AgriEcom ?
            </h2>
          </div>

          {/* Grille des avantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Carte avantage 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Achat Direct
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Achetez directement auprès des producteurs sans intermédiaire
              </p>
            </div>

            {/* Carte avantage 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Produits Qualité
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Des produits frais, de saison et issus de l'agriculture
                responsable
              </p>
            </div>

            {/* Carte avantage 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Circuit Court
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Soutenez l'économie locale et réduisez l'impact environnemental
              </p>
            </div>

            {/* Carte avantage 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Paiement Sécurisé
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Transactions 100% sécurisées avec suivi de commande
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION APPEL À L'ACTION (seulement si non connecté) === */}
      {!isAuthenticated() && (
        <section className="py-20 bg-green-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">
                Prêt à découvrir le goût du vrai ?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Rejoignez notre communauté de producteurs et consommateurs
                engagés
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Créer mon compte
                </Link>
                <Link
                  to="/products"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Voir les produits
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans d'autres fichiers
export default Home;
