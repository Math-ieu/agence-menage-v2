import { Metadata } from "next";
import NettoyageUrgenceClient from "./NettoyageUrgenceClient";

export const metadata: Metadata = {
    title: "Ménage Post-sinistre Casablanca | Intervention Rapide 24/7",
    description: "Intervention de ménage rapide à Casablanca pour situations après sinistre : dégât des eaux, incendie ou imprévus. Réactivité maximale.",
    openGraph: {
        title: "Ménage Post-sinistre Casablanca | Intervention Rapide 24/7",
        description: "Intervention de ménage rapide à Casablanca pour situations après sinistre : dégât des eaux, incendie ou imprévus. Réactivité maximale.",
        url: "https://www.agencemenage.ma/services/particulier/menage-post-sinistre",
        type: "website",
        images: [
            {
                url: "/og-main.png",
                width: 1200,
                height: 630,
                alt: "Ménage Post-sinistre Agence de Ménage Casablanca",
            },
        ],
    },
};

export default function NettoyageUrgencePage() {
    return <NettoyageUrgenceClient />;
}
