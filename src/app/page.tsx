import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
    title: "Agence Ménage Casablanca | Femme de Ménage & Nettoyage",
    description: "Agence Ménage — Service de nettoyage professionnel pour particuliers et entreprises. Disponible 7j/7. Devis gratuit via WhatsApp.",
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
        "@type": ["LocalBusiness", "Service"],
        "name": "Agence Ménage",
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
