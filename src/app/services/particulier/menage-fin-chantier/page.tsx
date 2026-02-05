import { Metadata } from "next";
import MenageFinChantierClient from "./MenageFinChantierClient";

export const metadata: Metadata = {
    title: "Nettoyage Fin de Chantier Casablanca | Remise en État",
    description: "Nettoyage complet après travaux à Casablanca. Élimination de poussière et résidus de chantier pour emménager dans un espace propre et sain.",
    openGraph: {
        title: "Nettoyage Fin de Chantier Casablanca | Remise en État",
        description: "Nettoyage complet après travaux à Casablanca. Élimination de poussière et résidus de chantier pour emménager dans un espace propre et sain.",
        url: "https://www.agencemenage.ma/services/particulier/menage-fin-chantier",
        type: "website",
        images: [
            {
                url: "/og-main.png",
                width: 1200,
                height: 630,
                alt: "Nettoyage Fin de Chantier Agence de Ménage Casablanca",
            },
        ],
    },
};

export default function MenageFinChantier() {
    return <MenageFinChantierClient />;
}
