import { Metadata } from "next";
import NettoyageUrgenceClient from "./NettoyageUrgenceClient";

export const metadata: Metadata = {
    title: "Ménage Post-sinistre Casablanca | Intervention Rapide 24/7",
    description: "Intervention de ménage rapide à Casablanca pour situations après sinistre : dégât des eaux, incendie ou imprévus. Réactivité maximale.",
    alternates: {
        canonical: "/services/particulier/menage-post-sinistre",
        languages: {
            "fr-MA": "/services/particulier/menage-post-sinistre",
            "x-default": "/services/particulier/menage-post-sinistre",
        },
    },
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
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Ménage Post Sinistre",
        "provider": {
            "@id": "https://www.agencemenage.ma/#organization"
        },
        "areaServed": "Casablanca",
        "description": "Service de nettoyage et remise en état après sinistre à Casablanca"
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <NettoyageUrgenceClient />
        </>
    );
}
