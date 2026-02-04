import { Metadata } from "next";
import MenageFinChantierEntrepriseClient from "./MenageFinChantierEntrepriseClient";

export const metadata: Metadata = {
    title: "Nettoyage Fin de Chantier pour Entreprises à Casablanca | Remise en État Professionnelle",
    description: "Service de nettoyage fin de chantier à Casablanca pour entreprises et professionnels. Remise en état de vos bureaux, commerces et locaux industriels après travaux.",
    openGraph: {
        title: "Nettoyage Fin de Chantier pour Entreprises à Casablanca | Remise en État Professionnelle",
        description: "Nettoyage professionnel après travaux à Casablanca pour entreprises.",
        images: [
            {
                url: "/og-fin-chantier-entreprise.png",
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
