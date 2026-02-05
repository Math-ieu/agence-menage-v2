import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "Contact Agence de Ménage Casablanca | Devis Gratuit",
    description: "Besoin d'un service de nettoyage pro ? Contactez-nous pour un devis gratuit et personnalisé à Casablanca. Notre équipe est à votre écoute pour vous répondre.",
    openGraph: {
        title: "Contact Agence de Ménage Casablanca | Devis Gratuit",
        description: "Besoin d'un service de nettoyage pro ? Contactez-nous pour un devis gratuit et personnalisé à Casablanca. Notre équipe est à votre écoute pour vous répondre.",
        url: "https://www.agencemenage.ma/contact",
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
