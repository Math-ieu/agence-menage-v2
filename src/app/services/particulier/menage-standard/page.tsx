import { Metadata } from "next";
import MenageStandardClient from "./MenageStandardClient";

export const metadata: Metadata = {
  title: "Ménage Standard à Casablanca | Agence de Ménage",
  description: "Service de ménage standard professionnel à Casablanca. Entretien courant, nettoyage de cuisine, chambres et salles de bain. Qualité et discrétion garanties.",
  openGraph: {
    title: "Ménage Standard à Casablanca | Agence de Ménage",
    description: "Entretien courant et ménage professionnel pour votre domicile à Casablanca.",
    images: [
      {
        url: "/og-menage-standard.png",
        width: 1200,
        height: 630,
        alt: "Ménage Standard Agence de Ménage Casablanca",
      },
    ],
  },
};

export default function MenageStandardPage() {
  return <MenageStandardClient />;
}
