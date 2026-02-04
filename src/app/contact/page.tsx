import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "Contactez Votre Agence de Ménage à Casablanca",
    description: "Besoin d'un service de ménage ? Contactez-nous pour un devis gratuit ou pour réserver votre prestation de nettoyage à Casablanca. Nous sommes à votre écoute.",
    openGraph: {
        title: "Contactez Votre Agence de Ménage à Casablanca",
        description: "Besoin d'un service de ménage ? Contactez-nous pour un devis gratuit ou pour réserver votre prestation de nettoyage à Casablanca.",
        images: [
            {
                url: "/og-contact.png",
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
