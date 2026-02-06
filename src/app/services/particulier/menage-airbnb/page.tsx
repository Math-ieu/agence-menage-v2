import { Metadata } from "next";
import MenageAirbnbClient from "./MenageAirbnbClient";

export const metadata: Metadata = {
    title: "Ménage Airbnb Casablanca | Agence de Ménage Pro",
    description: "Ménage Airbnb à Casablanca par notre agence de ménage. Services de femmes de ménage pour un accueil impeccable et une satisfaction garantie de vos voyageurs.",
    openGraph: {
        title: "Ménage Airbnb Casablanca | Agence de Ménage Pro",
        description: "Ménage Airbnb à Casablanca par notre agence de ménage. Services de femmes de ménage pour un accueil impeccable et une satisfaction garantie de vos voyageurs.",
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
