import { Metadata } from "next";
import PlacementClient from "./PlacementClient";

export const metadata: Metadata = {
    title: "Placement & Gestion de Propreté à Casablanca | Solutions Entreprises",
    description: "Solutions sur mesure de placement et gestion de propreté à Casablanca pour entreprises. Offres flexibles ou premium pour l'entretien de vos bureaux et locaux.",
    openGraph: {
        title: "Placement & Gestion de Propreté à Casablanca | Solutions Entreprises",
        description: "Gestion professionnelle de la propreté pour entreprises à Casablanca.",
        images: [
            {
                url: "/og-placement.png",
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
