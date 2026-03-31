import { Metadata } from "next";
import MenageDemenagementClient from "./MenageDemenagementClient";

export const metadata: Metadata = {
    title: "Ménage Post-Déménagement Casablanca | Nettoyage Pro",
    description: "Préparez votre emménagement ou libérez votre ancien logement avec notre service de nettoyage post-déménagement à Casablanca. Propreté garantie.",
    alternates: {
        canonical: "/services/particulier/menage-demenagement",
        languages: {
            "fr-MA": "/services/particulier/menage-demenagement",
            "x-default": "/services/particulier/menage-demenagement",
        },
    },
    openGraph: {
        title: "Ménage Post-Déménagement Casablanca | Nettoyage Pro",
        description: "Préparez votre emménagement ou libérez votre ancien logement avec notre service de nettoyage post-déménagement à Casablanca. Propreté garantie.",
        url: "https://www.agencemenage.ma/services/particulier/menage-demenagement",
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
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Ménage Post Déménagement",
        "provider": {
            "@id": "https://www.agencemenage.ma/#organization"
        },
        "areaServed": "Casablanca",
        "description": "Service de nettoyage complet après déménagement à Casablanca"
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MenageDemenagementClient />
        </>
    );
}
