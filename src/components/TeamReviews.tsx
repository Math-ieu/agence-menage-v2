"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import team1 from "@/assets/team/Mehdi HARIT.png";
import team2 from "@/assets/team/Julien COSTANT.png";
import team3 from "@/assets/team/Hasna BOUADILI.png";
import team4 from "@/assets/team/Dianne ADOTE.png";
import team5 from "@/assets/team/Zineb BOUNEFFAH.png";
import team6 from "@/assets/team/Parfaite FLEAN.png";
import team7 from "@/assets/team/Imane HARIT.png";
import team8 from "@/assets/team/Meriem GUERRI.png";
import team9 from "@/assets/team/Noura GOUJANE.png";
import team10 from "@/assets/team/Kaoutar IDRISSI .png";

const teamData = [
    { id: "01", name: "Mehdi HARIT", role: "General Manager", image: team1 },
    { id: "02", name: "Julien COSTAN ZANON", role: "Directeur des opérations", image: team2 },
    { id: "03", name: "Zineb BOUNEFFAH", role: "Responsable Nettoyage", image: team5 },
    { id: "04", name: "Kaoutar IDRISSI", role: "Account manager", image: team10 },
    { id: "05", name: "Dianne ADOTE", role: "Chargée de com", image: team4 },
    { id: "06", name: "Hasna BOUADILI", role: "Responsable qualité", image: team3 },
    { id: "07", name: "Noura GOUJANE", role: "Chargée de recrutement", image: team9 },
    { id: "08", name: "Parfaite FLEAN", role: "Chargée de recrutement", image: team6 },
    { id: "09", name: "Meriem GUERRI", role: "Chargée de recrutement", image: team8 },
    { id: "10", name: "Imane HARIT", role: "Chargée de recrutement", image: team7 },
];

const TeamReviews = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveIndex((prev) => (prev + 1) % teamData.length);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveIndex((prev) => (prev - 1 + teamData.length) % teamData.length);
    };

    const [touchStart, setTouchStart] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientY);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const touchEnd = e.changedTouches[0].clientY;
        const diff = touchStart - touchEnd;

        // Threshold of 50px for swipe detection
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        setTouchStart(null);
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsTransitioning(false), 600);
        return () => clearTimeout(timer);
    }, [activeIndex]);

    const activeMember = teamData[activeIndex];

    const thumbnailIndices = [
        activeIndex % teamData.length,
        (activeIndex + 1) % teamData.length,
        (activeIndex + 2) % teamData.length,
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col xl:flex-row items-center xl:items-end justify-start gap-8 xl:gap-16">

                    {/* Column 1: "Notre equipe" Title */}
                    <div className="w-full xl:w-[250px] flex-shrink-0">
                        <h2 className="text-5xl xl:text-7xl font-black text-[#287271] leading-[0.9] text-center xl:text-left">
                            NOTRE<br />EQUIPE
                        </h2>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex flex-col xl:flex-row items-center xl:items-end gap-10 xl:gap-14 w-full">

                        {/* Column 2: The Staircase (Hidden on very small mobile if too crowded, but user wants it clean) */}
                        <div className="hidden xl:flex items-center gap-6 lg:gap-8 self-center xl:self-end">
                            <div className="flex flex-col items-center gap-4 min-w-[40px]">
                                <div className="text-[10px] font-bold tracking-widest text-slate-300 uppercase [writing-mode:vertical-lr] rotate-180">
                                    {activeMember.id} — {teamData.length.toString().padStart(2, '0')}
                                </div>
                                <div className="text-xs uppercase tracking-[0.4em] font-black text-slate-900 [writing-mode:vertical-lr] rotate-180 py-4 border-y border-slate-100">
                                    Equipe
                                </div>
                            </div>

                            <div className="flex items-end gap-3 h-[240px]">
                                {thumbnailIndices.map((idx, slotIndex) => {
                                    const member = teamData[idx];
                                    return (
                                        <button
                                            key={`${member.id}-${slotIndex}`}
                                            onClick={() => setActiveIndex(idx)}
                                            className={cn(
                                                "relative w-16 lg:w-20 rounded-md overflow-hidden transition-all duration-700 ease-in-out",
                                                slotIndex === 0 ? "h-[100px]" : slotIndex === 1 ? "h-[150px]" : "h-[200px]",
                                                slotIndex === 0 ? "ring-2 ring-[#287271] ring-offset-4 scale-105 z-10 opacity-100 grayscale-0" : "opacity-40 hover:opacity-80 grayscale"
                                            )}
                                        >
                                            <Image src={member.image} alt={member.name} className="w-full h-full object-cover transition-all duration-700" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Column 3: Main Profile Image */}
                        <div
                            className="w-full md:w-[340px] xl:w-[380px] h-[400px] md:h-[500px] xl:h-[580px] relative overflow-hidden rounded-xl shadow-2xl bg-slate-100 flex-shrink-0 touch-none"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div
                                className="absolute inset-0 transition-transform duration-1000 cubic-bezier(0.23, 1, 0.32, 1) flex flex-col"
                                style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                            >
                                {teamData.map((member) => (
                                    <div key={member.id} className="w-full h-full flex-shrink-0 relative">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Column 4: Content - Only Name and Role */}
                        <div className="flex flex-col justify-end pb-4 xl:pb-12 flex-1 space-y-6 text-center xl:text-left transition-all duration-700">
                            <div
                                className={cn(
                                    "space-y-3 transition-all duration-700",
                                    isTransitioning ? "opacity-0 -translate-y-8" : "opacity-100 translate-y-0"
                                )}
                            >
                                <h3 className="text-3xl xl:text-5xl font-black text-slate-900 leading-none">
                                    {activeMember.name}
                                </h3>
                                <p className="text-[#287271] font-bold tracking-[0.2em] text-sm xl:text-lg uppercase">
                                    {activeMember.role}
                                </p>
                                <div className="h-1.5 w-12 bg-[#287271] mt-6 mx-auto xl:mx-0 rounded-full" />
                            </div>

                            <div className="pt-8 flex justify-center xl:justify-start">
                                <button
                                    onClick={nextSlide}
                                    className="group relative w-20 h-20 rounded-full bg-[#287271] flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 shadow-2xl shadow-[#287271]/40 overflow-hidden"
                                >
                                    <MoveRight className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform z-10" />
                                    <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TeamReviews;
