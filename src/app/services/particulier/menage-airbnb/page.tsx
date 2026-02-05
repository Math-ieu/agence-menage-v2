import { Metadata } from "next";
import MenageAirbnbClient from "./MenageAirbnbClient";

export const metadata: Metadata = {
    title: "Ménage Airbnb Casablanca | Nettoyage Professionnel",
    description: "Ménage spécialisé pour Airbnb et locations à Casablanca. Nettoyage complet, linge et accueil impeccable pour garantir la satisfaction de vos voyageurs.",
    openGraph: {
        title: "Ménage Airbnb Casablanca | Nettoyage Professionnel",
        description: "Ménage spécialisé pour Airbnb et locations à Casablanca. Nettoyage complet, linge et accueil impeccable pour garantir la satisfaction de vos voyageurs.",
        url: "https://www.agencemenage.ma/services/particulier/menage-airbnb",
        type: "website",
        images: [
            {
                url: "/og-main.png",
                width: 1200,
                height: 630,
                alt: "Ménage Airbnb Agence de Ménage Casablanca",
            },
        ],
    },
};

export default function MenageAirbnbPage() {
    return <MenageAirbnbClient />;
}
