import { Metadata } from "next";
import GardeMaladeClient from "./GardeMaladeClient";

export const metadata: Metadata = {
  title: "Garde Malade & Auxiliaire de Vie Casablanca | Aide",
  description: "Service d'auxiliaire de vie et garde malade à Casablanca. Accompagnement bienveillant et sécurisé pour personnes âgées ou dépendantes à domicile 24h/24.",
  alternates: {
    canonical: "/services/particulier/garde-malade",
    languages: {
      "fr-MA": "/services/particulier/garde-malade",
      "x-default": "/services/particulier/garde-malade",
    },
  },
  openGraph: {
    title: "Garde Malade & Auxiliaire de Vie Casablanca | Aide",
    description: "Service d'auxiliaire de vie et garde malade à Casablanca. Accompagnement bienveillant et sécurisé pour personnes âgées ou dépendantes à domicile 24h/24.",
    url: "https://www.agencemenage.ma/services/particulier/garde-malade",
    type: "website",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
        alt: "Garde Malade Agence de Ménage Casablanca",
      },
    ],
  },
};

export default function GardeMaladePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Auxiliaire de Vie et Garde Malade",
    "provider": {
      "@id": "https://www.agencemenage.ma/#organization"
    },
    "areaServed": "Casablanca",
    "description": "Service d'auxiliaire de vie et garde malade à domicile à Casablanca"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GardeMaladeClient />
    </>
  );
}
