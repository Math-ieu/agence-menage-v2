import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getSiteConfigServer } from "@/lib/site-config";

export const metadata: Metadata = {
    title: "Agence Ménage Casablanca & Rabat | Femme de Ménage & Nettoyage",
    description: "Agence Ménage — Service de nettoyage professionnel pour particuliers et entreprises à Casablanca et Rabat. Disponible 7j/7. Devis gratuit via WhatsApp.",
    alternates: {
        canonical: "/",
        languages: {
            "fr-MA": "/",
            "x-default": "/",
        },
    },
    openGraph: {
        title: "Agence Ménage Casablanca & Rabat | Femme de Ménage & Nettoyage",
        description: "Agence Ménage — Service de nettoyage professionnel pour particuliers et entreprises à Casablanca et Rabat. Disponible 7j/7. Devis gratuit via WhatsApp.",
        url: "https://www.agencemenage.ma",
        type: "website",
        images: [
            {
                url: "/og-main.png",
                width: 1200,
                height: 630,
                alt: "Agence de Ménage Casablanca et Rabat",
            },
        ],
    },
};

export default async function Home() {
    const config = await getSiteConfigServer();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://www.agencemenage.ma/#organization",
        "name": "Agence Ménage",
        "description": "Agence de ménage professionnelle au Maroc offrant des services de femmes de ménage qualifiées pour particuliers et entreprises.",
        "url": "https://www.agencemenage.ma",
        "telephone": config.phone_mobile_1_intl || config.phone_mobile_1 || "+212664226790",
        "email": config.email_contact || "contact@agencemenage.ma",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": config.bureau_casa_address || "36 Boulevard d'Anfa",
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
                "@type": "City",
                "name": "Rabat"
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
            config.facebook_url,
            config.instagram_url,
            config.tiktok_url
        ].filter(Boolean),
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
