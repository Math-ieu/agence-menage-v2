import { Metadata } from "next";
import NettoyageUrgenceEntrepriseClient from "./NettoyageUrgenceEntrepriseClient";

export const metadata: Metadata = {
    title: "Ménage Post-sinistre Entreprise Casablanca | Intervention Rapide 24/7",
    description: "Intervention de ménage rapide pour entreprises à Casablanca après sinistre : dégât des eaux, incendie ou imprévus. Réactivité maximale pour vos locaux.",
    openGraph: {
        title: "Ménage Post-sinistre Entreprise Casablanca | Intervention Rapide 24/7",
        description: "Intervention de ménage rapide pour entreprises à Casablanca après sinistre : dégât des eaux, incendie ou imprévus. Réactivité maximale pour vos locaux.",
        url: "https://www.agencemenage.ma/services/entreprise/menage-post-sinistre",
        type: "website",
        images: [
            {
                url: "/og-entreprise.png",
                width: 1200,
                height: 630,
                alt: "Ménage Post-sinistre Entreprise Agence de Ménage Casablanca",
            },
        ],
    },
};

export default function NettoyageUrgenceEntreprisePage() {
    return <NettoyageUrgenceEntrepriseClient />;
}
