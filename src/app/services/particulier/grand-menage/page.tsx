import { Metadata } from "next";
import GrandMenageClient from "./GrandMenageClient";

export const metadata: Metadata = {
  title: "Grand Ménage Casablanca | Agence de Ménage & Nettoyage",
  description: "Grand ménage à Casablanca par une agence de ménage experte. Nettoyage en profondeur par nos femmes de ménage pour une hygiène irréprochable de votre foyer.",
  openGraph: {
    title: "Grand Ménage Casablanca | Agence de Ménage & Nettoyage",
    description: "Grand ménage à Casablanca par une agence de ménage experte. Nettoyage en profondeur par nos femmes de ménage pour une hygiène irréprochable de votre foyer.",
    url: "https://www.agencemenage.ma/services/particulier/grand-menage",
    type: "website",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
        alt: "Grand Ménage Agence de Ménage Casablanca",
      },
    ],
  },
};

export default function GrandMenagePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Grand Ménage",
    "provider": {
      "@id": "https://www.agencemenage.ma/#organization"
    },
    "areaServed": "Casablanca",
    "description": "Service de grand ménage en profondeur pour particuliers à Casablanca"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GrandMenageClient />
    </>
  );
}
