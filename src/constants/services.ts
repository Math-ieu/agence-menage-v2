import imgStandard from "@/assets/service-menage-standard.png";
import imgGrand from "@/assets/service-grand-menage.png";
import imgAirbnb from "@/assets/service-menage-airbnb.png";
import imgDemenagement from "@/assets/service-menage-demenagement.png";
import imgChantier from "@/assets/service-fin-chantier-particulier.png";
import imgAuxiliaire from "@/assets/service-garde-malade.png";
import imgUrgence from "@/assets/service-nettoyage-urgence.png";
import imgBureaux from "@/assets/service-menage-bureaux.png";
import imgPlacement from "@/assets/service-placement-gestion.png";
import imgChantierEntreprise from "@/assets/service-fin-chantier-entreprise.png";

import { SERVICE_COLORS } from "./service-colors";

export interface ServiceData {
    title: string;
    description: string;
    image: string;
    color: string;
    url: string;
}

export const particulierServices: ServiceData[] = [
    {
        title: "Ménage standard",
        description: "Le ménage standard a pour objectif d'assurer la propreté et l'entretien courant des espaces attribués.",
        image: imgStandard.src,
        color: SERVICE_COLORS.STANDARD.hex,
        url: "/services/particulier/menage-standard"
    },
    {
        title: "Grand Ménage",
        description: "Un nettoyage en profondeur pour redonner éclat et fraîcheur à l'ensemble de votre intérieur.",
        image: imgGrand.src,
        color: SERVICE_COLORS.GRAND_MENAGE.hex,
        url: "/services/particulier/grand-menage"
    },
    {
        title: "Ménage Airbnb",
        description: "Un service de nettoyage rapide et impeccable entre chaque location pour vos logements saisonniers.",
        image: imgAirbnb.src,
        color: SERVICE_COLORS.AIRBNB.hex,
        url: "/services/particulier/menage-airbnb"
    },
    {
        title: "Nettoyage post-déménagement",
        description: "Un nettoyage complet après votre déménagement pour rendre ou accueillir un logement impeccable.",
        image: imgDemenagement.src,
        color: SERVICE_COLORS.DEMENAGEMENT.hex,
        url: "/services/particulier/menage-demenagement"
    },
    {
        title: "Ménage fin de chantier",
        description: "Élimination de la poussière et des résidus de travaux pour un espace prêt à être habité.",
        image: imgChantier.src,
        color: SERVICE_COLORS.CHANTIER_P.hex,
        url: "/services/particulier/menage-fin-chantier"
    },
    {
        title: "Auxiliaire de vie/Garde malade",
        description: "Un accompagnement bienveillant au quotidien pour les personnes âgées ou en convalescence.",
        image: imgAuxiliaire.src,
        color: SERVICE_COLORS.GARDE_MALADE.hex,
        url: "/services/particulier/garde-malade"
    },
    {
        title: "Ménage Post-sinistre",
        description: "Remise en état et nettoyage approfondi après un sinistre pour retrouver un espace sain.",
        image: imgUrgence.src,
        color: SERVICE_COLORS.URGENCE_P.hex,
        url: "/services/particulier/menage-post-sinistre"
    },
];

export const entrepriseServices: ServiceData[] = [
    {
        title: "Ménages bureaux",
        description: "Des espaces de travail sains pour booster la productivité de vos équipes.",
        image: imgBureaux.src,
        color: SERVICE_COLORS.BUREAUX.hex,
        url: "/services/entreprise/menage-bureaux"
    },
    {
        title: "Placement & Gestion",
        description: "Déléguez votre propreté avec nos solutions de placement avec ou sans gestion RH.",
        image: imgPlacement.src,
        color: SERVICE_COLORS.PLACEMENT.hex,
        url: "/services/entreprise/placement"
    },
    {
        title: "Nettoyage Fin de chantier",
        description: "Un standard pro pour faciliter la réception de vos projets immobiliers.",
        image: imgChantierEntreprise.src,
        color: SERVICE_COLORS.CHANTIER_E.hex,
        url: "/services/entreprise/menage-fin-chantier"
    },
    {
        title: "Ménage Post-sinistre",
        description: "Remise en état et nettoyage approfondi après un sinistre ou pour un besoin immédiat en entreprise.",
        image: imgUrgence.src,
        color: SERVICE_COLORS.URGENCE_E.hex,
        url: "/services/entreprise/menage-post-sinistre"
    },
];
