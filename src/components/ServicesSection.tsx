"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import WheelGestures from "embla-carousel-wheel-gestures";
import ServiceCard from "./ServiceCard";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    const textbutton = isEntreprise ? "Demander un devis" : "Réserver mon ménage";

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            skipSnaps: false,
            dragFree: true
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

            {/* Static Grid for Enterprise (Desktop) */}
            {isEntreprise && (
                <div className="hidden md:flex w-full px-4 md:px-8 mx-auto flex-nowrap justify-start xl:justify-center gap-6 pb-8">
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
            )}

            {/* Embla Carousel for Particulier OR Enterprise on Mobile */}
            <div className={cn(
                "w-full mx-auto relative group",
                isEntreprise ? "block md:hidden" : "block"
            )}>
                <div
                    className="overflow-hidden cursor-grab active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
                    ref={emblaRef}
                >
                    <div className="flex -ml-8 px-4 md:px-8">
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

                {/* Navigation Arrows Container */}
                <div className="mt-8 hidden md:flex justify-center gap-4">
                    <button
                        onClick={() => emblaApi?.scrollPrev()}
                        className="w-10 h-10 rounded-full border-[1.5px] border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        aria-label="Précédent"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => emblaApi?.scrollNext()}
                        className="w-10 h-10 rounded-full border-[1.5px] border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        aria-label="Suivant"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

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
                        {textbutton}
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default ServicesSection;
