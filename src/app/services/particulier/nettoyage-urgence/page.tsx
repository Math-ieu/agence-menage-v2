import { Metadata } from "next";
import NettoyageUrgenceClient from "./NettoyageUrgenceClient";

export const metadata: Metadata = {
    title: "Nettoyage d'Urgence Casablanca | Intervention Rapide 24/7",
    description: "Intervention de nettoyage rapide à Casablanca pour situations urgentes : sinistre, inondation ou événements imprévus. Réactivité maximale.",
    openGraph: {
        title: "Nettoyage d'Urgence Casablanca | Intervention Rapide 24/7",
        description: "Intervention de nettoyage rapide à Casablanca pour situations urgentes : sinistre, inondation ou événements imprévus. Réactivité maximale.",
        images: [
            {
                url: "/og-nettoyage-urgence.png",
                width: 1200,
                height: 630,
                alt: "Nettoyage d'Urgence Agence de Ménage Casablanca",
            },
        ],
    },
};

export default function NettoyageUrgencePage() {
    return <NettoyageUrgenceClient />;
}
