import { Metadata } from "next";
import MenageDemenagementClient from "./MenageDemenagementClient";

export const metadata: Metadata = {
    title: "Ménage après Déménagement à Casablanca | Nettoyage Post-Déménagement",
    description: "Service de ménage complet après déménagement à Casablanca. Dépoussiérage, désinfection et nettoyage en profondeur pour votre nouveau logement. Rapide et efficace.",
    openGraph: {
        title: "Ménage après Déménagement à Casablanca | Nettoyage Post-Déménagement",
        description: "Nettoyage en profondeur pour votre nouveau logement à Casablanca.",
        images: [
            {
                url: "/og-menage-demenagement.png",
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
