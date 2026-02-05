import { Metadata } from "next";
import MenageStandardClient from "./MenageStandardClient";

export const metadata: Metadata = {
  title: "Ménage à Domicile Casablanca | Femme de Ménage Qualifiée",
  description: "Service de ménage régulier à Casablanca. Profitez d'une maison propre sans effort avec nos femmes de ménage expérimentées et de confiance.",
  openGraph: {
    title: "Ménage à Domicile Casablanca | Femme de Ménage Qualifiée",
    description: "Service de ménage régulier à Casablanca. Profitez d'une maison propre sans effort avec nos femmes de ménage expérimentées et de confiance.",
    url: "https://agencemenage.ma/services/particulier/menage-standard",
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
  return <MenageStandardClient />;
}
