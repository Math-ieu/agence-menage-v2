import { Metadata } from "next";
import PlacementClient from "./PlacementClient";

export const metadata: Metadata = {
    title: "Placement personnel de maison Casablanca | Agence",
    description: "Trouvez le personnel idéal pour votre foyer or entreprise à Casablanca. Recrutement rigoureux de profils qualifiés (nanny, chauffeur, ménage).",
    openGraph: {
        title: "Placement personnel de maison Casablanca | Agence",
        description: "Trouvez le personnel idéal for votre foyer or entreprise à Casablanca. Recrutement rigoureux de profils qualifiés (nanny, chauffeur, ménage).",
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
