import { Metadata } from "next";
import PlacementClient from "./PlacementClient";

export const metadata: Metadata = {
    title: "Placement & Gestion de Propreté B2B Casablanca | Agence",
    description: "Service de placement et gestion de propreté pour entreprises à Casablanca. Recrutement rigoureux de profils qualifiés pour l'entretien de vos locaux professionnels.",
    openGraph: {
        title: "Placement & Gestion de Propreté B2B Casablanca | Agence",
        description: "Service de placement et gestion de propreté pour entreprises à Casablanca. Recrutement rigoureux de profils qualifiés pour l'entretien de vos locaux professionnels.",
        url: "https://www.agencemenage.ma/services/entreprise/placement",
        type: "website",
        images: [
            {
                url: "/og-entreprise.png",
                width: 1200,
                height: 630,
                alt: "Placement et Gestion de Propreté Agence de Ménage Casablanca",
            },
        ],
    },
};

export default function PlacementPage() {
    return <PlacementClient />;
}
