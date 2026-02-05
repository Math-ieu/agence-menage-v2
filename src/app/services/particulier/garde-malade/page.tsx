import { Metadata } from "next";
import GardeMaladeClient from "./GardeMaladeClient";

export const metadata: Metadata = {
  title: "Garde Malade & Auxiliaire de Vie Casablanca | Aide",
  description: "Service d'auxiliaire de vie et garde malade à domicile à Casablanca. Accompagnement professionnel, bienveillant et sécurisé pour personnes âgées ou dépendantes 24h/24.",
  openGraph: {
    title: "Garde Malade & Auxiliaire de Vie Casablanca | Aide",
    description: "Service d'auxiliaire de vie et garde malade à domicile à Casablanca. Accompagnement professionnel, bienveillant et sécurisé for personnes âgées ou dépendantes 24h/24.",
    url: "https://agencemenage.ma/services/particulier/garde-malade",
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
  return <GardeMaladeClient />;
}
