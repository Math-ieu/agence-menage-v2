import { Metadata } from "next";
import MenageAirbnbClient from "./MenageAirbnbClient";

export const metadata: Metadata = {
    title: "Ménage Airbnb & Locations Courte Durée Casablanca | Nettoyage Pro",
    description: "Service de ménage spécialisé pour Airbnb et locations saisonnières à Casablanca. Nettoyage complet, changement de linge et accueil impeccable pour vos voyageurs.",
    openGraph: {
        title: "Ménage Airbnb & Locations Courte Durée Casablanca | Nettoyage Pro",
        description: "Service de ménage spécialisé pour Airbnb et locations saisonnières à Casablanca. Nettoyage complet, changement de linge et accueil impeccable pour vos voyageurs.",
        url: "https://agencemenage.ma/services/particulier/menage-airbnb",
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
