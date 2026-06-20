import { Metadata } from "next";
import MenageBureauxClient from "./MenageBureauxClient";

export const metadata: Metadata = {
  title: "Nettoyage de Bureaux Casablanca & Rabat | Service Propreté",
  description: "Entretien régulier de vos bureaux et locaux professionnels à Casablanca et Rabat. Environnement de travail propre et productif pour vos collaborateurs.",
  alternates: {
    canonical: "/services/entreprise/menage-bureaux",
    languages: {
      "fr-MA": "/services/entreprise/menage-bureaux",
      "x-default": "/services/entreprise/menage-bureaux",
    },
  },
  openGraph: {
    title: "Nettoyage de Bureaux Casablanca & Rabat | Service Propreté",
    description: "Entretien régulier de vos bureaux et locaux professionnels à Casablanca et Rabat. Environnement de travail propre et productif for vos collaborateurs.",
    url: "https://www.agencemenage.ma/services/entreprise/menage-bureaux",
    type: "website",
    images: [
      {
        url: "/og-entreprise.png",
        width: 1200,
        height: 630,
        alt: "Ménage de Bureaux Agence de Ménage Casablanca et Rabat",
      },
    ],
  },
};

export default function MenageBureauxPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Ménage pour Bureaux",
    "provider": {
      "@id": "https://www.agencemenage.ma/#organization"
    },
    "areaServed": ["Casablanca", "Rabat"],
    "description": "Service de nettoyage et entretien de bureaux pour entreprises à Casablanca et Rabat"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MenageBureauxClient />
    </>
  );
}
