"use client";
import React from 'react';

const TrustSection = () => {
  const trustItems = [
    {
      title: "VOTRE PARTENAIRE",
      content: "Agence Ménage Services est votre partenaire de confiance pour tous vos besoins en nettoyage et entretien à Casablanca et dans le Grand Casablanca. Que vous soyez un particulier ou une entreprise, nous proposons des prestations professionnelles adaptées à vos besoins et à votre budget."
    },
    {
      title: "SERVICES DE NETTOYAGE",
      content: "Nos services de nettoyage à Casablanca Nous intervenons pour le nettoyage de domiciles, d'appartements, de bureaux et de locaux commerciaux. Notre équipe qualifiée utilise des produits certifiés pour garantir un résultat impeccable à chaque intervention."
    },
    {
      title: "DISPONIBILITÉ 7J/7",
      content: "Une équipe disponible 7j/7 Nos équipes sont disponibles tous les jours de la semaine, y compris les week-ends et jours fériés. Nous nous adaptons à votre planning pour intervenir au moment qui vous convient le mieux."
    },
    {
      title: "TARIF ABORDABLE",
      content: "Des tarifs transparents Chez Agence Ménage Services, nous croyons en la transparence totale. Pas de frais cachés, pas de mauvaises surprises. Demandez votre devis gratuit en ligne en moins de 2 minutes."
    }
  ];

  return (
    <section className="bg-primary py-20 text-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
        <div className="text-center mb-20 relative">
          <h2 className="text-3xl md:text-5xl font-serif italic tracking-wide mb-6 inline-block">
            Pourquoi choisir Agence Ménage ?
          </h2>
          <div className="w-48 h-px bg-white/30 mx-auto -mt-4 mb-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 lg:gap-x-20 lg:gap-y-20">
          {trustItems.map((item, index) => (
            <div key={index} className="flex flex-col">
              <h3 className="text-lg md:text-xl font-bold mb-4 tracking-widest border-b-2 border-secondary pb-1 inline-block self-start text-white">
                {item.title}
              </h3>
              <p className="text-base md:text-lg leading-relaxed text-white font-medium">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
