import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
    title: "Agence Ménage Casablanca | Femme de Ménage & Nettoyage",
    description: "Agence de ménage à Casablanca. Nous proposons des services de femmes de ménage qualifiées pour particuliers et entreprises. Agence ménage premium et fiable.",
    openGraph: {
        title: "Agence Ménage Casablanca | Femme de Ménage & Nettoyage",
        description: "Agence de ménage à Casablanca. Nous proposons des services de femmes de ménage qualifiées pour particuliers et entreprises. Agence ménage premium et fiable.",
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
        "@type": ["LocalBusiness", "Service"],
        "name": "Agence Ménage Services",
        "url": "https://agencemenage.ma",
        "description": "Expert en nettoyage et entretien à Casablanca",
        "areaServed": "Casablanca",
        "serviceType": "Nettoyage et entretien",
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
