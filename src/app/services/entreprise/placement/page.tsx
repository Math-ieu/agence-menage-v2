import { Metadata } from "next";
import PlacementClient from "./PlacementClient";

export const metadata: Metadata = {
    title: "Placement de Personnel de Maison & Employés Casablanca",
    description: "Trouvez le personnel idéal pour votre foyer or entreprise à Casablanca. Recrutement rigoureux de profils qualifiés (nanny, chauffeur, ménage).",
    openGraph: {
        title: "Placement de Personnel de Maison & Employés Casablanca",
        description: "Trouvez le personnel idéal pour votre foyer or entreprise à Casablanca. Recrutement rigoureux de profils qualifiés (nanny, chauffeur, ménage).",
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
