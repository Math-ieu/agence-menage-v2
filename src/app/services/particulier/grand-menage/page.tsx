import { Metadata } from "next";
import GrandMenageClient from "./GrandMenageClient";

export const metadata: Metadata = {
  title: "Grand Ménage à Casablanca | Nettoyage en Profondeur",
  description: "Service de grand ménage et nettoyage en profondeur à Casablanca. Idéal pour un entretien saisonnier ou une remise au propre complète. Professionnalisme et rigueur.",
  openGraph: {
    title: "Grand Ménage à Casablanca | Nettoyage en Profondeur",
    description: "Nettoyage minutieux et complet de votre logement à Casablanca.",
    images: [
      {
        url: "/og-grand-menage.png",
        width: 1200,
        height: 630,
        alt: "Grand Ménage Agence de Ménage Casablanca",
      },
    ],
  },
};

export default function GrandMenagePage() {
  return <GrandMenageClient />;
}
