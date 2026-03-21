import { Metadata } from "next";
import MenageStandardClient from "./MenageStandardClient";

export const metadata: Metadata = {
  title: "Ménage Standard Casablanca | Services d'une Femme de Ménage",
  description: "Service de ménage standard à Casablanca. Notre agence de ménage propose des femmes de ménage qualifiées pour un entretien régulier et fiable de votre domicile.",
  openGraph: {
    title: "Ménage Standard Casablanca | Services d'une Femme de Ménage",
    description: "Service de ménage standard à Casablanca. Notre agence de ménage propose des femmes de ménage qualifiées pour un entretien régulier et fiable de votre domicile.",
    url: "https://www.agencemenage.ma/services/particulier/menage-standard",
    type: "website",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
        alt: "Ménage Standard Agence de Ménage Casablanca",
      },
    ],
  },
};

export default function MenageStandardPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Ménage Standard",
    "provider": {
      "@id": "https://www.agencemenage.ma/#organization"
    },
    "areaServed": "Casablanca",
    "description": "Service de ménage standard hebdomadaire pour particuliers à Casablanca"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MenageStandardClient />
    </>
  );
}
