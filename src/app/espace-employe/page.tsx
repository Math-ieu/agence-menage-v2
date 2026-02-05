import { Metadata } from "next";
import EspaceEmployeClient from "./EspaceEmployeClient";

export const metadata: Metadata = {
    title: "Espace Employé | Agence de Ménage Casablanca",
    description: "Espace dédié aux collaborateurs de l'Agence de Ménage. Accédez à vos outils et informations professionnelles en toute sécurité.",
    openGraph: {
        title: "Espace Employé | Agence de Ménage Casablanca",
        description: "Rejoignez une équipe qui vous accompagne et vous forme. Espace réservé aux collaborateurs.",
        url: "https://agencemenage.ma/espace-employe",
        type: "website",
        images: [
            {
                url: "/og-main.png",
                width: 1200,
                height: 630,
                alt: "Espace Employé Agence de Ménage",
            },
        ],
    },
};

export default function EspaceEmployePage() {
    return <EspaceEmployeClient />;
}
