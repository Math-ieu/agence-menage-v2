import { Metadata } from "next";
import MenageAirbnbClient from "../particulier/menage-airbnb/MenageAirbnbClient";

export const metadata: Metadata = {
    title: "Ménage Airbnb Casablanca & Rabat | Agence de Ménage Pro",
    description: "Ménage Airbnb à Casablanca et Rabat par notre agence de ménage. Services de femmes de ménage pour un accueil impeccable et une satisfaction garantie de vos voyageurs.",
    alternates: {
        canonical: "/services/menage-airbnb",
        languages: {
            "fr-MA": "/services/menage-airbnb",
            "x-default": "/services/menage-airbnb",
        },
    },
    openGraph: {
        title: "Ménage Airbnb Casablanca & Rabat | Agence de Ménage Pro",
        description: "Ménage Airbnb à Casablanca et Rabat par notre agence de ménage. Services de femmes de ménage pour un accueil impeccable et une satisfaction garantie de vos voyageurs.",
        url: "https://www.agencemenage.ma/services/menage-airbnb",
        type: "website",
        images: [
            {
                url: "/og-main.png",
                width: 1200,
                height: 630,
                alt: "Ménage Airbnb Agence de Ménage Casablanca et Rabat",
            },
        ],
    },
};

export default function MenageAirbnbPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Ménage Airbnb",
        "provider": {
            "@id": "https://www.agencemenage.ma/#organization"
        },
        "areaServed": ["Casablanca", "Rabat"],
        "description": "Service de ménage et entretien pour locations Airbnb à Casablanca et Rabat"
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MenageAirbnbClient />
        </>
    );
}
