import React from "react";
import logoPremium from "@/assets/Logo Agence premium.png";
import logoNounou from "@/assets/Logo Nounou.ma.png";
import logoMenage from "@/assets/LOGO-AGENCE-MENAGE.png";

const PartnersSection = () => {
    const partners = [
        {
            name: "Agence Premium",
            logo: logoPremium,
            link: "https://www.agencepremium.ma/",
        },
        {
            name: "Nounou.ma",
            logo: logoNounou,
            link: "https://nounou.ma/",
        },
        {
            name: "Agence Ménage",
            logo: logoMenage,
            link: "#", // Internal link or just decorative as per request "les logo sont dans assets"
        },
    ];

    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-12">
                    Groupe Agence Premium
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
                    {partners.map((partner, index) => (
                        <a
                            key={index}
                            href={partner.link}
                            target={partner.link !== "#" ? "_blank" : undefined}
                            rel={partner.link !== "#" ? "noopener noreferrer" : undefined}
                            className="group transition-all duration-300 transform hover:scale-110 opacity-90 hover:opacity-100"
                            title={partner.name}
                        >
                            <img
                                src={partner.logo.src}
                                alt={partner.name}
                                className="h-16 md:h-24 w-auto object-contain"
                            />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;
