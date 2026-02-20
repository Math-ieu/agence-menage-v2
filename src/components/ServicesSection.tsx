"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import WheelGestures from "embla-carousel-wheel-gestures";
import ServiceCard from "./ServiceCard";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Home, Briefcase, Key, Hammer, HeartHandshake, Building2, UserCheck } from "lucide-react";

import { particulierServices, entrepriseServices } from "@/constants/services";

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

                <div className={cn(
                    "max-w-6xl mx-auto mt-12 text-center",
                    isEntreprise ? "text-white/90" : "text-slate-600"
                )}>
                    {isEntreprise ? (
                        <div className="space-y-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-12">Nos Solutions pour les Entreprises</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-xl flex items-center justify-center">
                                        <Building2 className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-white mb-2">Ménage de Bureaux</h4>
                                    <p className="text-white/80 text-sm leading-relaxed">Des interventions discrètes et efficaces, adaptées à vos horaires (avant l'ouverture ou après la fermeture), pour maintenir des espaces de travail impeccables et stimulants.</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-xl flex items-center justify-center">
                                        <UserCheck className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-white mb-2">Placement & Gestion de Propreté</h4>
                                    <p className="text-white/80 text-sm leading-relaxed">La mise à disposition de personnel qualifié avec un encadrement strict. Nous prenons en charge les plannings, les remplacements et le suivi de la qualité pour une totale tranquillité d'esprit.</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-xl flex items-center justify-center">
                                        <Hammer className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-white mb-2">Nettoyage Fin de Chantier</h4>
                                    <p className="text-white/80 text-sm leading-relaxed">Une remise en état complète et minutieuse de vos locaux professionnels, plateaux de bureaux ou boutiques après travaux, pour une livraison parfaite et prête à l'usage.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12">Nos Domaines d'Intervention</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                <div className="text-center flex flex-col items-center">
                                    <div className="w-16 h-16 shrink-0 mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Home className="w-8 h-8 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-primary mb-2">Ménage Résidentiel</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">Un entretien minutieux de votre maison ou appartement pour un quotidien serein.</p>
                                </div>
                                <div className="text-center flex flex-col items-center">
                                    <div className="w-16 h-16 shrink-0 mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Briefcase className="w-8 h-8 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-primary mb-2">Nettoyage de Bureaux</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">Des locaux professionnels impeccables pour le bien-être de vos collaborateurs et l'image de votre entreprise.</p>
                                </div>
                                <div className="text-center flex flex-col items-center">
                                    <div className="w-16 h-16 shrink-0 mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Key className="w-8 h-8 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-primary mb-2">Entretien Airbnb</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">Un service de nettoyage ultra-réactif entre deux locations pour garantir des avis 5 étoiles de vos voyageurs.</p>
                                </div>
                                <div className="text-center flex flex-col items-center">
                                    <div className="w-16 h-16 shrink-0 mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Hammer className="w-8 h-8 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-primary mb-2">Fin de Chantier</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">Un grand nettoyage en profondeur pour effacer toute trace de travaux et rendre vos espaces prêts à l'usage.</p>
                                </div>
                                <div className="text-center flex flex-col items-center">
                                    <div className="w-16 h-16 shrink-0 mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <HeartHandshake className="w-8 h-8 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-primary mb-2">Auxiliaire de Vie</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">Un accompagnement humain et professionnel pour les personnes ayant besoin d'assistance au quotidien.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
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
