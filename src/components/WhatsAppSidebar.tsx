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
                    onClick={() => {
                        if (typeof window !== "undefined" && (window as any).gtag) {
                            (window as any).gtag('event', 'conversion', {
                                'send_to': 'AW-17907112455/whatsapp_click',
                            });
                            (window as any).gtag('event', 'whatsapp_click', {
                                'event_category': 'contact',
                                'event_label': 'sidebar'
                            });
                        }
                        window.open(whatsappLink, '_blank');
                    }}
                >
                    {/* WhatsApp Icon */}
                    <svg className="w-3 h-3 md:w-7 md:h-7 text-white mb-2 md:mb-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>

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
