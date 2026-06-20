import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "Contact Agence Ménage Casablanca & Rabat | Devis Gratuit",
    description: "Contactez notre agence de ménage à Casablanca et Rabat pour une femme de ménage ou un nettoyage pro. Devis gratuit et personnalisé selon vos besoins spécifiques.",
    alternates: {
        canonical: "/contact",
        languages: {
            "fr-MA": "/contact",
            "x-default": "/contact",
        },
    },
    openGraph: {
        title: "Contact Agence Ménage Casablanca & Rabat | Devis Gratuit",
        description: "Contactez notre agence de ménage à Casablanca et Rabat pour une femme de ménage ou un nettoyage pro. Devis gratuit et personnalisé selon vos besoins spécifiques.",
        url: "https://www.agencemenage.ma/contact",
        type: "website",
        images: [
            {
                url: "/og-main.png",
                width: 1200,
                height: 630,
                alt: "Contactez Agence de Ménage Casablanca et Rabat",
            },
        ],
    },
};

export default function ContactPage() {
    return <ContactClient />;
}
