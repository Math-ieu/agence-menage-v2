"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import WheelGestures from "embla-carousel-wheel-gestures";
import ServiceCard from "./ServiceCard";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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

const particulierServices = [
    {
        title: "Ménage standard",
        description: "Le ménage standard a pour objectif d'assurer la propreté et l'entretien courant des espaces attribués.",
        image: imgStandard.src,
        color: "#0B7F7A",
        url: "/services/particulier/menage-standard"
    },
    {
        title: "Grand Ménage",
        description: "Un nettoyage en profondeur pour redonner éclat et fraîcheur à l'ensemble de votre intérieur.",
        image: imgGrand.src,
        color: "#04969e",
        url: "/services/particulier/grand-menage"
    },
    {
        title: "Ménage Airbnb",
        description: "Un service de nettoyage rapide et impeccable entre chaque location pour vos logements saisonniers.",
        image: imgAirbnb.src,
        color: "#f78458",
        url: "/services/particulier/menage-airbnb"
    },
    {
        title: "Nettoyage post-déménagement",
        description: "Un nettoyage complet après votre déménagement pour rendre ou accueillir un logement impeccable.",
        image: imgDemenagement.src,
        color: "#f8c170",
        url: "/services/particulier/menage-demenagement"
    },
    {
        title: "Ménage fin de chantier",
        description: "Élimination de la poussière et des résidus de travaux pour un espace prêt à être habité.",
        image: imgChantier.src,
        color: "#d9bf12",
        url: "/services/particulier/menage-fin-chantier"
    },
    {
        title: "Auxiliaire de vie/Garde malade",
        description: "Un accompagnement bienveillant au quotidien pour les personnes âgées ou en convalescence.",
        image: imgAuxiliaire.src,
        color: "#50bfcb",
        url: "/services/particulier/garde-malade"
    },
    {
        title: "Ménage Post-sinistre",
        description: "Remise en état et nettoyage approfondi après un sinistre pour retrouver un espace sain.",
        image: imgUrgence.src,
        color: "#4f8130",
        url: "/services/particulier/menage-post-sinistre"
    },
];

const entrepriseServices = [
    {
        title: "Ménages bureaux",
        description: "Des espaces de travail sains pour booster la productivité de vos équipes.",
        image: imgBureaux.src,
        color: "#c7dd54",
        url: "/services/entreprise/menage-bureaux"
    },
    {
        title: "Placement & gestion",
        description: "Déléguez votre propreté avec nos solutions de placement avec ou sans gestion RH.",
        image: imgPlacement.src,
        color: "#f1db08",
        url: "/services/entreprise/placement"
    },
    {
        title: "Nettoyage Fin de chantier",
        description: "Un standard pro pour faciliter la réception de vos projets immobiliers.",
        image: imgChantierEntreprise.src,
        color: "#88d89d",
        url: "/services/entreprise/menage-fin-chantier"
    },
    {
        title: "Ménage Post-sinistre",
        description: "Remise en état et nettoyage approfondi après un sinistre ou pour un besoin immédiat en entreprise.",
        image: imgUrgence.src,
        color: "#74a12d",
        url: "/services/entreprise/menage-post-sinistre"
    },
];

interface ServicesSectionProps {
    type?: "particulier" | "entreprise";
}

const ServicesSection = ({ type = "particulier" }: ServicesSectionProps) => {
    const isEntreprise = type === "entreprise";
    const services = isEntreprise ? entrepriseServices : particulierServices;
    const title = isEntreprise ? "Services pour entreprises" : "Services pour particuliers";
    const isMobile = useIsMobile();

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            skipSnaps: false,
            active: !isEntreprise || isMobile,
            dragFree: true // Allows for a more natural scroll/drag feel
        },
        [Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true }), WheelGestures()]
    );

    const [scrollProgress, setScrollProgress] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onScroll = useCallback(() => {
        if (!emblaApi) return;
        const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
        setScrollProgress(progress * 100);
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap() % services.length);
    }, [emblaApi, services.length]);

    useEffect(() => {
        if (!emblaApi) return;
        onScroll();
        onSelect();
        emblaApi.on("scroll", onScroll);
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onScroll);
    }, [emblaApi, onScroll, onSelect]);

    return (
        <section className={cn(
            "py-20 overflow-hidden",
            isEntreprise ? "bg-primary" : "bg-white"
        )}>
            <div className="container px-4 mx-auto mb-16">
                <h2 className={cn(
                    "text-3xl md:text-5xl font-black text-center tracking-tight",
                    isEntreprise ? "text-white" : "text-slate-900"
                )}>
                    {title}
                </h2>
                <div className={cn(
                    "h-1.5 w-24 mx-auto mt-6 rounded-full",
                    isEntreprise ? "bg-white/30" : "bg-primary/20"
                )} />
            </div>

            {(isEntreprise && !isMobile) ? (
                /* Static Grid for Enterprise (Desktop) */
                <div className="container px-4 mx-auto flex flex-wrap justify-center gap-8 md:gap-12">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={`${service.title}-${index}`}
                            title={service.title}
                            description={service.description}
                            image={service.image}
                            color={service.color}
                            url={service.url}
                        />
                    ))}
                </div>
            ) : (
                /* Embla Carousel for Particulier OR Enterprise on Mobile */
                <div className="container px-4 mx-auto relative group">
                    <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                        <div className="flex -ml-8">
                            {services.map((service, index) => (
                                <div key={`${service.title}-${index}`} className="pl-8 flex-[0_0_auto]">
                                    <ServiceCard
                                        title={service.title}
                                        description={service.description}
                                        image={service.image}
                                        color={service.color}
                                        url={service.url}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Bar & Indicators Container */}
                    <div className="mt-12 flex flex-col items-center gap-6">
                        {/* 3 Indicators */}
                        <div className="flex gap-3">
                            {[0, 1, 2].map((i) => {
                                // Simple mapping of index to 3 groups
                                const sectionSize = Math.ceil(services.length / 3);
                                const isActive = Math.floor(selectedIndex / sectionSize) === i;

                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all duration-500",
                                            isActive ? "w-8" : "w-4 bg-slate-200"
                                        )}
                                        style={isActive ? { backgroundColor: services[selectedIndex].color } : {}}
                                    />
                                );
                            })}
                        </div>

                        {/* Full Progress Bar */}
                        <div className="w-full max-w-md h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full transition-all duration-300 ease-out"
                                style={{
                                    width: `${scrollProgress}%`,
                                    backgroundColor: services[selectedIndex].color
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ServicesSection;
