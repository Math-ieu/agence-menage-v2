import { Metadata } from "next";
import MenageStandardClient from "./MenageStandardClient";

export const metadata: Metadata = {
  title: "Femme de Ménage Casablanca | Agence de Ménage Pro",
  description: "Besoin d'une femme de ménage à Casablanca ? Notre agence de ménage propose des services réguliers et fiables. Profitez d'un intérieur propre sans effort.",
  openGraph: {
    title: "Femme de Ménage Casablanca | Agence de Ménage Pro",
    description: "Besoin d'une femme de ménage à Casablanca ? Notre agence de ménage propose des services réguliers et fiables. Profitez d'un intérieur propre sans effort.",
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
  return <MenageStandardClient />;
}
