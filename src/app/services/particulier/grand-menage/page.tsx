import { Metadata } from "next";
import GrandMenageClient from "./GrandMenageClient";

export const metadata: Metadata = {
  title: "Grand Ménage Casablanca | Nettoyage en Profondeur",
  description: "Offrez à votre intérieur un nettoyage intégral à Casablanca. Grand ménage approfondi de chaque pièce pour une hygiène irréprochable.",
  openGraph: {
    title: "Grand Ménage Casablanca | Nettoyage en Profondeur",
    description: "Offrez à votre intérieur un nettoyage intégral à Casablanca. Grand ménage approfondi de chaque pièce for une hygiène irréprochable.",
    url: "https://agencemenage.ma/services/particulier/grand-menage",
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
  return <GrandMenageClient />;
}
