import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentUser, isAuthenticated } = useAuth();

  // Images du carousel
  const carouselImages = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Produits Frais de la Ferme",
      description: "Découvrez des produits agricoles frais directement de nos producteurs locaux"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Circuit Court Garanti",
      description: "Soutenez l'agriculture locale avec des produits de saison et de qualité"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Livraison Rapide",
      description: "Recevez vos produits en 24h-48h, cueillis à maturité pour préserver leurs saveurs"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Agriculture Durable",
      description: "Des pratiques respectueuses de l'environnement pour une alimentation saine"
    }
  ];

  useEffect(() => {
    const loadProducts = () => {
      try {
        const allProducts = productService.getProducts();
        // Filtrer les produits valides et prendre les 6 premiers
        const validProducts = allProducts.filter(product => product && product.id).slice(0, 6);
        setProducts(validProducts);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Auto-slide du carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Carousel Hero Section */}
      <section className="hero-carousel">
        <div className="carousel-container">
          {carouselImages.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="carousel-overlay"></div>
              <div className="carousel-content">
                <h1 className="carousel-title">{slide.title}</h1>
                <p className="carousel-description">{slide.description}</p>
                <div className="carousel-actions">
                  {!isAuthenticated() && (
                    <Link to="/register" className="carousel-btn primary">
                      Rejoindre AgriEcom
                    </Link>
                  )}
                  <Link to="/products" className="carousel-btn secondary">
                    Découvrir les produits
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {/* Contrôles du carousel */}
          <button className="carousel-control prev" onClick={prevSlide}>
            ‹
          </button>
          <button className="carousel-control next" onClick={nextSlide}>
            ›
          </button>

          {/* Indicateurs de slide */}
          <div className="carousel-indicators">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">🌱</div>
            <div className="stat-number">{products.length}+</div>
            <div className="stat-label">Produits Frais</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">👨‍🌾</div>
            <div className="stat-number">100%</div>
            <div className="stat-label">Producteurs Locaux</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🚚</div>
            <div className="stat-number">24h</div>
            <div className="stat-label">Livraison Rapide</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">5/5</div>
            <div className="stat-label">Satisfaction Client</div>
          </div>
        </div>
      </section>

      {/* Section Produits en Vedette */}
      <section className="featured-products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Nos Produits Frais</h2>
            <p className="section-subtitle">
              Découvrez une sélection de produits frais directement issus de nos producteurs partenaires
            </p>
          </div>

          {products.length === 0 ? (
            <div className="empty-products">
              <div className="empty-icon">🌾</div>
              <h3>En attente de nouveaux produits</h3>
              <p>Nos producteurs préparent de nouvelles récoltes</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="view-all-container">
                <Link to="/products" className="view-all-btn">
                  Voir tous les produits
                  <span className="btn-arrow">→</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Section Avantages */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Pourquoi choisir AgriEcom ?</h2>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🛒</div>
              <h3>Achat Direct</h3>
              <p>Achetez directement auprès des producteurs sans intermédiaire</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">🌿</div>
              <h3>Produits Qualité</h3>
              <p>Des produits frais, de saison et issus de l'agriculture responsable</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">💚</div>
              <h3>Circuit Court</h3>
              <p>Soutenez l'économie locale et réduisez l'impact environnemental</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h3>Paiement Sécurisé</h3>
              <p>Transactions 100% sécurisées avec suivi de commande</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated() && (
        <section className="cta-section">
          <div className="cta-container">
            <div className="cta-content">
              <h2>Prêt à découvrir le goût du vrai ?</h2>
              <p>Rejoignez notre communauté de producteurs et consommateurs engagés</p>
              <div className="cta-buttons">
                <Link to="/register" className="cta-btn primary">
                  Créer mon compte
                </Link>
                <Link to="/products" className="cta-btn secondary">
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

export default Home;