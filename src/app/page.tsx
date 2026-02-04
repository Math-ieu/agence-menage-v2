import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
    title: "Agence de Ménage Casablanca | Services de Nettoyage Professionnel",
    description: "Agence de ménage de référence à Casablanca. Nous offrons des services de nettoyage professionnels pour particuliers et entreprises.",
    openGraph: {
        title: "Agence de Ménage Casablanca | Services de Nettoyage Professionnel",
        description: "Agence de ménage de référence à Casablanca. Nous offrons des services de nettoyage professionnels pour particuliers et entreprises.",
        images: [
            {
                url: "/og-home.png", // I'll assume this image exists or will be created
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
