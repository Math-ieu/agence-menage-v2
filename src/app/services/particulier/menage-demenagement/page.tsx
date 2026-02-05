import { Metadata } from "next";
import MenageDemenagementClient from "./MenageDemenagementClient";

export const metadata: Metadata = {
    title: "Ménage après Déménagement Casablanca | Nettoyage Post-Déménagement",
    description: "Préparez votre emménagement ou libérez votre ancien logement avec notre service de nettoyage post-déménagement à Casablanca. Propreté garantie.",
    openGraph: {
        title: "Ménage après Déménagement Casablanca | Nettoyage Post-Déménagement",
        description: "Préparez votre emménagement ou libérez votre ancien logement avec notre service de nettoyage post-déménagement à Casablanca. Propreté garantie.",
        url: "https://agencemenage.ma/services/particulier/menage-demenagement",
        type: "website",
        images: [
            {
                url: "/og-main.png",
                width: 1200,
                height: 630,
                alt: "Ménage après Déménagement Agence de Ménage Casablanca",
            },
        ],
    },
};

export default function MenageDemenagementPage() {
    return <MenageDemenagementClient />;
}
