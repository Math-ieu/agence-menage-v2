import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
    title: "Agence Ménage Casablanca | Femme de Ménage & Nettoyage",
    description: "Agence de ménage à Casablanca. Nous proposons des services de femmes de ménage qualifiées pour particuliers et entreprises. Agence ménage premium et fiable.",
    openGraph: {
        title: "Agence Ménage Casablanca | Femme de Ménage & Nettoyage",
        description: "Agence de ménage à Casablanca. Nous proposons des services de femmes de ménage qualifiées pour particuliers et entreprises. Agence ménage premium et fiable.",
        url: "https://www.agencemenage.ma",
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
