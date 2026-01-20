"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createWhatsAppLink, DESTINATION_PHONE_NUMBER } from "@/lib/whatsapp";

const WhatsAppSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const pathname = usePathname();

    // Hide sidebar on "Espace employé" page
    if (pathname === "/espace-employe") {
        return null;
    }

    const whatsappLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, "Bonjour, j'aimerais avoir plus d'informations sur vos services.");

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100]">
            <div className="relative flex items-center">
                {/* Toggle Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute left-0 -translate-x-full bg-[#1c6664] text-white w-4 h-4 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-lg border border-white/20 hover:bg-[#154d4b] transition-colors"
                    style={{ zIndex: 10 }}
                >
                    {isExpanded ? <ChevronRight size={10} className="md:w-[14px] md:h-[14px]" /> : <ChevronLeft size={10} className="md:w-[14px] md:h-[14px]" />}
                </button>

                {/* The Band */}
                <div
                    className={`bg-[#1c6664] border-l border-y border-white/10 shadow-2xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden flex flex-col items-center py-2 px-1 md:py-6 md:px-3 rounded-l-xl ${isExpanded ? "w-14 md:w-24" : "w-5 md:w-10"
                        }`}
                    onClick={() => window.open(whatsappLink, '_blank')}
                >
                    <div className="flex gap-1 md:gap-4">
                        {/* Phone Number (visible when expanded) */}
                        {isExpanded && (
                            <span
                                className="text-white font-bold text-[7px] md:text-xs uppercase tracking-[0.2em] whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-300 line-clamp-1"
                                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                            >
                                06 64 33 14 63
                            </span>
                        )}

                        {/* "whatsapp" text */}
                        <span
                            className="text-white font-black text-[8px] md:text-sm uppercase tracking-[0.3em] whitespace-nowrap"
                            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                        >
                            whatsapp
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppSidebar;
