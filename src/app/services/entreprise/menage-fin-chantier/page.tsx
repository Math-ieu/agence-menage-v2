import { Metadata } from "next";
import MenageFinChantierEntrepriseClient from "./MenageFinChantierEntrepriseClient";

export const metadata: Metadata = {
    title: "Nettoyage Fin de Chantier Professionnel Casablanca | Après Travaux",
    description: "Service de nettoyage après construction pour professionnels à Casablanca. Livraison de locaux impeccables et prêts à l'exploitation.",
    openGraph: {
        title: "Nettoyage Fin de Chantier Professionnel Casablanca | Après Travaux",
        description: "Service de nettoyage après construction for professionnels à Casablanca. Livraison de locaux impeccables et prêts à l'exploitation.",
        url: "https://agencemenage.ma/services/entreprise/menage-fin-chantier",
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
    return <MenageFinChantierEntrepriseClient />;
}
