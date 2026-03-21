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
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Ménage Fin de Chantier",
        "provider": {
            "@id": "https://www.agencemenage.ma/#organization"
        },
        "areaServed": "Casablanca",
        "description": "Service de nettoyage fin de chantier pour particuliers à Casablanca"
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MenageFinChantierClient />
        </>
    );
}
