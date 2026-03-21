import { Metadata } from "next";
import MenageFinChantierEntrepriseClient from "./MenageFinChantierEntrepriseClient";

export const metadata: Metadata = {
    title: "Nettoyage Fin de Chantier Entreprise Casablanca | Pro",
    description: "Service de nettoyage après construction pour professionnels à Casablanca. Livraison de locaux impeccables et prêts à l'exploitation.",
    openGraph: {
        title: "Nettoyage Fin de Chantier Entreprise Casablanca | Pro",
        description: "Service de nettoyage après construction for professionnels à Casablanca. Livraison de locaux impeccables et prêts à l'exploitation.",
        url: "https://www.agencemenage.ma/services/entreprise/menage-fin-chantier",
        type: "website",
        images: [
            {
                url: "/og-entreprise.png",
                width: 1200,
                height: 630,
                alt: "Nettoyage Fin de Chantier Entreprise Agence de Ménage Casablanca",
            },
        ],
    },
};

export default function MenageFinChantierEntreprisePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Ménage Fin de Chantier Entreprises",
        "provider": {
            "@id": "https://www.agencemenage.ma/#organization"
        },
        "areaServed": "Casablanca",
        "description": "Service de nettoyage fin de chantier pour entreprises à Casablanca"
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MenageFinChantierEntrepriseClient />
        </>
    );
}
