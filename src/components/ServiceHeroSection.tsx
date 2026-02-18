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
    faqs?: { question: string, answer: string }[];
}

const ServiceHeroSection = ({ title, description, image, primaryColor, isCollapsible = true, faqs = [] }: ServiceHeroSectionProps) => {
    const [activeTab, setActiveTab] = useState<"description" | "faqs">("description");
    const [openAccordion, setOpenAccordion] = useState<"description" | "faqs" | null>(null);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const renderDescription = (text: string) => {
        return text.split("\n").map((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith("-")) {
                const content = trimmedLine.substring(1).trim();
                return (
                    <div key={index} className="flex items-start gap-4 mt-2">
                        <div
                            className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: primaryColor || "var(--primary)" }}
                        />
                        <span className="text-sm md:text-base text-foreground leading-relaxed">
                            {content}
                        </span>
                    </div>
                );
            }
            return (
                <p key={index} className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-line mb-2">
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

    const toggleAccordion = (type: "description" | "faqs") => {
        setOpenAccordion(openAccordion === type ? null : type);
    };

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const faqSchema = faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    return (
        <section
            className="relative py-8 md:py-16 bg-gradient-to-br from-primary/10 to-accent"
            style={primaryColor ? { background: `linear-gradient(to bottom right, ${primaryColor}26, ${primaryColor}1a)` } : {}}
        >
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <div className="container relative">
                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="absolute top-0 left-0 p-2 hover:bg-black/5 rounded-full transition-colors z-30 md:-left-4 lg:-left-12 md:-top-8"
                    aria-label="Retour"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Mobile Content (Image + Title) */}
                <div className="flex flex-col items-center md:hidden mb-4 pt-4 relative">
                    <div
                        className="relative w-64 h-64 rounded-full overflow-hidden border-[3px] border-white shadow-xl"
                        style={{ boxShadow: `0 0 0 8px ${(primaryColor || "#287271")}1a` }}
                    >
                        <img
                            src={typeof image === "string" ? image : (image as any)?.src}
                            alt={title}
                            className="w-full h-full object-cover scale-110"
                        />
                    </div>
                    <div
                        className="w-full px-2 -mt-20 relative z-20"
                    >
                        <div
                            className="w-full py-4 rounded-2xl shadow-md border border-slate-100 bg-white"
                        >
                            <h1
                                className="text-2xl font-bold text-center"
                                style={{ color: primaryColor || "#287271" }}
                            >
                                {title}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        {/* Desktop Title */}
                        <h1
                            className="hidden md:block text-4xl lg:text-5xl font-bold mb-8"
                            style={primaryColor ? { color: primaryColor } : {}}
                        >
                            {title}
                        </h1>

                        {/* Desktop Tabs */}
                        <div className="hidden md:flex gap-4 mb-6">
                            <button
                                onClick={() => setActiveTab("description")}
                                className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all text-center text-lg ${activeTab === "description"
                                    ? "text-white shadow-md"
                                    : "bg-opacity-20 hover:bg-opacity-30 ripple"
                                    }`}
                                style={{
                                    backgroundColor: activeTab === "description" ? (primaryColor || "#287271") : `${primaryColor || "#287271"}40`,
                                    color: activeTab === "description" ? "#fff" : (primaryColor || "#287271")
                                }}
                            >
                                Description {title.toLowerCase()}
                            </button>
                            <button
                                onClick={() => setActiveTab("faqs")}
                                className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all text-center text-lg ${activeTab === "faqs"
                                    ? "text-white shadow-md"
                                    : "bg-opacity-20 hover:bg-opacity-30 ripple"
                                    }`}
                                style={{
                                    backgroundColor: activeTab === "faqs" ? (primaryColor || "#287271") : `${primaryColor || "#287271"}40`,
                                    color: activeTab === "faqs" ? "#fff" : (primaryColor || "#287271")
                                }}
                            >
                                Questions les plus fréquentes
                            </button>
                        </div>

                        {/* Mobile Accordions */}
                        <div className="flex flex-col gap-4 md:hidden px-2 -mt-6">
                            {/* Description Accordion */}
                            <div className="rounded-2xl overflow-hidden shadow-md">
                                <button
                                    onClick={() => toggleAccordion("description")}
                                    className="w-full py-5 px-8 flex items-center justify-between font-bold text-white transition-all text-xl"
                                    style={{ backgroundColor: primaryColor || "#287271" }}
                                >
                                    <span>Description {title.toLowerCase()}</span>
                                    {openAccordion === "description" ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </button>
                                {openAccordion === "description" && (
                                    <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                                        <div className="space-y-1">
                                            {renderDescription(description)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* FAQs Accordion */}
                            <div className="rounded-2xl overflow-hidden shadow-md">
                                <button
                                    onClick={() => toggleAccordion("faqs")}
                                    className="w-full py-5 px-8 flex items-center justify-between font-bold text-white transition-all outline-none text-xl"
                                    style={{ backgroundColor: primaryColor || "#287271" }}
                                >
                                    <span>Questions les plus fréquentes</span>
                                    {openAccordion === "faqs" ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </button>
                                {openAccordion === "faqs" && (
                                    <div className="p-4 bg-white animate-in slide-in-from-top-2 duration-200">
                                        <div className="space-y-3">
                                            {faqs.map((faq, idx) => {
                                                const isActive = openFaqIndex === idx;
                                                return (
                                                    <div key={idx} className="border rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300">
                                                        <button
                                                            onClick={() => toggleFaq(idx)}
                                                            className={`w-full py-3 px-4 flex items-center justify-between text-left transition-all duration-300 outline-none ${isActive ? "text-white" : "text-slate-800 bg-white"}`}
                                                            style={isActive ? { backgroundColor: primaryColor || "#287271" } : {}}
                                                        >
                                                            <span className="text-[11px] pr-4 font-bold">{faq.question}</span>
                                                            {isActive ? (
                                                                <ChevronUp size={16} className="flex-shrink-0" />
                                                            ) : (
                                                                <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                                                            )}
                                                        </button>
                                                        {isActive && (
                                                            <div className="p-4 bg-white animate-in slide-in-from-top-1 duration-200">
                                                                <p className="text-slate-600 leading-relaxed text-xs">
                                                                    {faq.answer}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {faqs.length === 0 && (
                                                <p className="text-slate-500 italic text-sm">Aucune FAQ disponible pour le moment.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Reservation Button (Styled as redesign) */}
                            <button
                                onClick={scrollToReservation}
                                className="w-full py-5 px-8 text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-md flex items-center justify-center text-2xl mt-2"
                                style={{
                                    backgroundColor: `${primaryColor || "#287271"}66`, // Increased opacity for the mint/light green effect but using primary
                                }}
                            >
                                Réservation
                            </button>
                        </div>

                        {/* Desktop Tab Content */}
                        <div className="hidden md:block p-8 rounded-2xl bg-white bg-opacity-40 backdrop-blur-sm border border-white border-opacity-30 shadow-sm min-h-[300px]">
                            {activeTab === "description" ? (
                                <div className="space-y-1 animate-in fade-in duration-300">
                                    {renderDescription(description)}
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    {faqs.map((faq, idx) => {
                                        const isActive = openFaqIndex === idx;
                                        return (
                                            <div key={idx} className="border rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300 border-slate-200">
                                                <button
                                                    onClick={() => toggleFaq(idx)}
                                                    className={`w-full py-5 px-6 flex items-center justify-between text-left transition-all duration-300 outline-none ${isActive ? "text-white" : "text-slate-800 hover:bg-slate-50"}`}
                                                    style={isActive ? { backgroundColor: primaryColor || "#287271" } : {}}
                                                >
                                                    <span className="text-sm md:text-base pr-8 font-bold">{faq.question}</span>
                                                    {isActive ? (
                                                        <ChevronUp size={24} className="flex-shrink-0" />
                                                    ) : (
                                                        <ChevronDown size={24} className="text-slate-400 flex-shrink-0" />
                                                    )}
                                                </button>
                                                {isActive && (
                                                    <div className="p-8 bg-white animate-in slide-in-from-top-2 duration-300 border-t border-slate-100">
                                                        <p className="text-base text-slate-600 leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {faqs.length === 0 && (
                                        <p className="text-slate-500 italic text-center py-12">Aucune FAQ disponible pour le moment.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Image */}
                    <div className="hidden md:block rounded-2xl overflow-hidden h-full min-h-[500px]">
                        <img
                            src={typeof image === "string" ? image : (image as any)?.src}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceHeroSection;
