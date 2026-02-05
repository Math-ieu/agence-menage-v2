import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "Contactez Votre Agence de Ménage à Casablanca | Devis Gratuit",
    description: "Besoin d'un service de nettoyage ? Contactez-nous pour un devis gratuit et personnalisé à Casablanca. Équipe réactive et à votre écoute.",
    openGraph: {
        title: "Contactez Votre Agence de Ménage à Casablanca | Devis Gratuit",
        description: "Besoin d'un service de nettoyage ? Contactez-nous pour un devis gratuit et personnalisé à Casablanca.",
        url: "https://agencemenage.ma/contact",
        type: "website",
        images: [
            {
                url: "/og-main.png",
                width: 1200,
                height: 630,
                alt: "Contactez Agence de Ménage Casablanca",
            },
        ],
    },
};

export default function ContactPage() {
    return <ContactClient />;
}
