import { Metadata } from "next";
import NettoyageUrgenceClient from "./NettoyageUrgenceClient";

export const metadata: Metadata = {
    title: "Nettoyage d'Urgence à Casablanca | Intervention Rapide 24/7",
    description: "Service de nettoyage d'urgence à Casablanca après sinistre, inondation ou fête. Intervention rapide et efficace pour remettre vos locaux en état immédiatement.",
    openGraph: {
        title: "Nettoyage d'Urgence à Casablanca | Intervention Rapide 24/7",
        description: "Intervention de nettoyage rapide à Casablanca pour situations urgentes.",
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
