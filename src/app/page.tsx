import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
    title: "Agence de Ménage Casablanca | Nettoyage Pro & Fiable",
    description: "Découvrez notre agence de ménage à Casablanca. Services de nettoyage professionnels pour particuliers et entreprises : femme de ménage, grand ménage, et plus.",
    openGraph: {
        title: "Agence de Ménage Casablanca | Nettoyage Pro & Fiable",
        description: "Découvrez notre agence de ménage à Casablanca. Services de nettoyage professionnels pour particuliers et entreprises : femme de ménage, grand ménage, et plus.",
        url: "https://agencemenage.ma",
        type: "website",
        images: [
            {
                url: "/og-main.png",
                width: 1200,
                height: 630,
                alt: "Agence de Ménage Casablanca",
            },
        ],
    },
};

export default function Home() {
    return <HomeClient />;
}
