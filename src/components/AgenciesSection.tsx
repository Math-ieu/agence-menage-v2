import logoPremium from "@/assets/Logo Agence premium.webp";
import logoNounou from "@/assets/Logo Nounou.ma.webp";
import logoMenage from "@/assets/LOGO-AGENCE-MENAGE.webp";

const AgenciesSection = () => {
    const agencies = [
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
            link: "#",
        },
    ];

    return (
        <section className="py-16 bg-white border-t border-slate-100">
            <div className="container mx-auto">
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70 hover:opacity-100 transition-opacity duration-500">
                    {agencies.map((agency) => (
                        <a
                            key={agency.name}
                            href={agency.link}
                            target={agency.link === "#" ? undefined : "_blank"}
                            rel={agency.link === "#" ? undefined : "noopener noreferrer"}
                            className="group transition-transform duration-300 hover:scale-110"
                        >
                            <img
                                src={agency.logo.src}
                                alt={agency.name}
                                className="h-12 md:h-16 w-auto grayscale group-hover:grayscale-0 transition-all duration-300"
                            />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AgenciesSection;
