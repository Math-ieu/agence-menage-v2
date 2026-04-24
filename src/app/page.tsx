import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
    title: "Agence Ménage Casablanca | Femme de Ménage & Nettoyage",
    description: "Agence Ménage — Service de nettoyage professionnel pour particuliers et entreprises. Disponible 7j/7. Devis gratuit via WhatsApp.",
    alternates: {
        canonical: "/",
        languages: {
            "fr-MA": "/",
            "x-default": "/",
        },
    },
    openGraph: {
        title: "Agence Ménage Casablanca | Femme de Ménage & Nettoyage",
        description: "Agence Ménage — Service de nettoyage professionnel pour particuliers et entreprises. Disponible 7j/7. Devis gratuit via WhatsApp.",
        url: "https://www.agencemenage.ma",
        type: "website",
        images: [
            {
                url: "/og-main.png",
                width: 1200,
                height: 630,
                alt: "Agence de Ménage Casablanca",
            },
        ],
    },
};

export default function Home() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://www.agencemenage.ma/#organization",
        "name": "Agence Ménage",
        "description": "Agence de ménage professionnelle au Maroc offrant des services de femmes de ménage qualifiées pour particuliers et entreprises.",
        "url": "https://www.agencemenage.ma",
        "telephone": "+212664331463",
        "email": "contact@agencemenage.ma",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "36 Boulevard d'Anfa",
            "addressLocality": "Casablanca",
            "addressRegion": "Grand Casablanca",
            "addressCountry": "MA"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "33.5912",
            "longitude": "-7.6331"
        },
        "areaServed": [
            {
                "@type": "City",
                "name": "Casablanca"
            },
            {
                "@type": "GeoCircle",
                "geoMidpoint": {
                    "@type": "GeoCoordinates",
                    "latitude": "33.5912",
                    "longitude": "-7.6331"
                },
                "geoRadius": "50km"
            }
        ],
        "priceRange": "MAD",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "08:00",
                "closes": "18:00"
            }
        ],
        "sameAs": [
            "https://www.facebook.com/profile.php?id=61586972460164",
            "https://www.instagram.com/agencemenage/"
        ],
        "founder": [
            {
                "@type": "Person",
                "name": "Mehdi HARIT"
            },
            {
                "@type": "Person",
                "name": "Julien COSTAN ZANON"
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HomeClient />
        </>
    );
}
