import { Metadata } from "next";
import MenageBureauxClient from "./MenageBureauxClient";

export const metadata: Metadata = {
  title: "Ménage de Bureaux à Casablanca | Nettoyage Professionnel",
  description: "Service de ménage de bureaux à Casablanca. Nettoyage professionnel et régulier de vos espaces de travail, bureaux et locaux commerciaux pour un environnement sain.",
  openGraph: {
    title: "Ménage de Bureaux à Casablanca | Nettoyage Professionnel",
    description: "Nettoyage professionnel de vos espaces de travail à Casablanca.",
    images: [
      {
        url: "/og-menage-bureaux.png",
        width: 1200,
        height: 630,
        alt: "Ménage de Bureaux Agence de Ménage Casablanca",
      },
    ],
  },
};

export default function MenageBureauxPage() {
  return <MenageBureauxClient />;
}
