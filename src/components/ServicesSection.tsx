"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import WheelGestures from "embla-carousel-wheel-gestures";
import ServiceCard from "./ServiceCard";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Home, Briefcase, Key, Hammer, HeartHandshake, Building2, UserCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

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

            <div className="mt-16 text-center px-4">
                <Link href="/contact" className="w-full sm:w-auto inline-block">
                    <Button
                        size="lg"
                        className={cn(
                            "w-full sm:w-auto text-lg px-8 py-6 rounded-full font-semibold shadow-lg transition-all hover:scale-105",
                            isEntreprise
                                ? "bg-white text-primary hover:bg-slate-100"
                                : "bg-primary text-white hover:bg-primary/90"
                        )}
                    >
                        Demandez votre devis
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default ServicesSection;
