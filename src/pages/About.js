import React from "react";
import { Leaf, Users, Globe, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Section Héro */}
      <section className="bg-green-700 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">À propos de SmartFarm 🌿</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Une solution innovante pour une agriculture intelligente, durable et
          connectée.
        </p>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <img
          src="https://cdn.pixabay.com/photo/2017/04/04/17/45/greenhouse-2203742_1280.jpg"
          alt="Ferme intelligente"
          className="rounded-2xl shadow-lg w-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Notre mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Chez <span className="font-semibold text-green-700">SmartFarm</span>
            , nous croyons en une agriculture connectée qui allie technologie,
            productivité et respect de l’environnement. Notre objectif est
            d’aider les producteurs à optimiser leurs cultures grâce à la
            collecte et l’analyse intelligente de données.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
          Nos valeurs fondamentales
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <Leaf className="mx-auto text-green-600 w-12 h-12 mb-4" />
            <h3 className="font-semibold text-xl mb-2">Durabilité</h3>
            <p className="text-gray-600">
              Nous favorisons des pratiques agricoles respectueuses de la nature
              pour préserver nos ressources et garantir un avenir vert.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <Globe className="mx-auto text-green-600 w-12 h-12 mb-4" />
            <h3 className="font-semibold text-xl mb-2">Innovation</h3>
            <p className="text-gray-600">
              Nous exploitons la puissance de l’IoT, de l’IA et des données pour
              transformer les exploitations agricoles en systèmes intelligents.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <Heart className="mx-auto text-green-600 w-12 h-12 mb-4" />
            <h3 className="font-semibold text-xl mb-2">Engagement</h3>
            <p className="text-gray-600">
              Nous plaçons les agriculteurs au cœur de notre mission en leur
              offrant des solutions simples, efficaces et humaines.
            </p>
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
          Une équipe passionnée 🌱
        </h2>
        <div className="max-w-4xl mx-auto text-center">
          <Users className="w-14 h-14 mx-auto text-green-600 mb-4" />
          <p className="text-gray-700 leading-relaxed">
            L’équipe{" "}
            <span className="font-semibold text-green-700">SmartFarm</span> est
            composée de jeunes innovateurs, ingénieurs, et passionnés de
            technologie agricole. Ensemble, nous travaillons pour moderniser
            l’agriculture africaine et mondiale, en mettant la donnée et
            l’intelligence au service des producteurs.
          </p>
        </div>
      </section>

      {/* Section contact */}
      <section className="py-10 text-center">
        <p className="text-gray-600 text-lg">
          Vous souhaitez collaborer ou en savoir plus ?
        </p>
        <button
          onClick={() => (window.location.href = "/contact")}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Contactez-nous
        </button>
      </section>

    </div>
  );
};

export default About;
