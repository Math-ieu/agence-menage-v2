"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

import { StaticImageData } from "next/image";

interface ServiceHeroSectionProps {
    title: string;
    description: string;
    image: string | StaticImageData;
    primaryColor?: string;
    isCollapsible?: boolean;
}

const ServiceHeroSection = ({ title, description, image, primaryColor, isCollapsible = true }: ServiceHeroSectionProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const renderDescription = (text: string) => {
        return text.split("\n").map((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith("-")) {
                const content = trimmedLine.substring(1).trim();
                return (
                    <div key={index} className="flex items-start gap-3 mt-2">
                        <div
                            className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: primaryColor || "var(--primary)" }}
                        />
                        <span className="text-lg text-foreground leading-relaxed">
                            {content}
                        </span>
                    </div>
                );
            }
            return (
                <p key={index} className="text-lg text-foreground leading-relaxed whitespace-pre-line">
                    {line}
                </p>
            );
        });
    };

    const scrollToReservation = () => {
        const element = document.getElementById("booking-form");
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section
            className="relative py-8 md:py-16 bg-gradient-to-br from-primary/10 to-accent"
            style={primaryColor ? { background: `linear-gradient(to bottom right, ${primaryColor}14, ${primaryColor}08)` } : {}}
        >
            <div className="container relative">
                <button
                    onClick={() => window.history.back()}
                    className="absolute -top-4 md:-top-8 left-0 xl:-left-12 p-2 hover:bg-black/5 rounded-full transition-colors"
                    aria-label="Retour"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <h1
                            className="text-3xl md:text-4xl font-bold text-primary"
                            style={primaryColor ? { color: primaryColor } : {}}
                        >
                            {title}
                        </h1>

                        {isCollapsible && (
                            <div className="flex flex-col gap-2 md:hidden">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full py-4 px-6 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                    style={{ backgroundColor: primaryColor || "#287271" }}
                                >
                                    Description {title.toLowerCase()}
                                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                <button
                                    onClick={scrollToReservation}
                                    className="w-full py-4 px-6 text-white font-bold rounded-lg transition-all active:scale-[0.98]"
                                    style={{ backgroundColor: primaryColor || "#287271" }}
                                >
                                    Réservation
                                </button>
                            </div>
                        )}

                        <div className={`space-y-1 font-bold ${isCollapsible ? (isOpen ? 'block' : 'hidden md:block') : 'block'}`}>
                            {renderDescription(description)}
                        </div>
                    </div>

                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src={typeof image === "string" ? image : (image as any)?.src}
                            alt={title}
                            className="w-full h-[300px] md:h-[500px] object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceHeroSection;
