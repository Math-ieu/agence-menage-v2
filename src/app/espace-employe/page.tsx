import { Metadata } from "next";
import EspaceEmployeClient from "./EspaceEmployeClient";

export const metadata: Metadata = {
    title: "Espace Employé | Agence de Ménage Casablanca",
    description: "Espace réservé aux collaborateurs de l'Agence de Ménage. Accédez à vos informations et plannings. Rejoignez une équipe qui vous accompagne.",
    openGraph: {
        title: "Espace Employé | Agence de Ménage Casablanca",
        description: "Rejoignez une équipe qui vous accompagne et vous forme. Espace réservé aux collaborateurs.",
        images: [
            {
                url: "/og-employee.png",
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
