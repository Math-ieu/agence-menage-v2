import { Metadata } from "next";
import MenageBureauxClient from "./MenageBureauxClient";

export const metadata: Metadata = {
  title: "Nettoyage de Bureaux Casablanca | Maintenance & Entretien Locaux",
  description: "Entretien régulier de vos bureaux et locaux professionnels à Casablanca. Environnement de travail propre et productif pour vos collaborateurs.",
  openGraph: {
    title: "Nettoyage de Bureaux Casablanca | Maintenance & Entretien Locaux",
    description: "Entretien régulier de vos bureaux et locaux professionnels à Casablanca. Environnement de travail propre et productif for vos collaborateurs.",
    url: "https://agencemenage.ma/services/entreprise/menage-bureaux",
    type: "website",
    images: [
      {
        url: "/og-entreprise.png",
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
