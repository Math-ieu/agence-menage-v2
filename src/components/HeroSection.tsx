"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import heroParticulier from "@/assets/hero-home-particulier.webp";
import heroEntreprise from "@/assets/hero-home-entreprise.webp";
import heroParticulierMobile from "@/assets/couverture-particulier-mobile.webp";
import heroEntrepriseMobile from "@/assets/couverture-entreprise-mobile.webp";
import Image from "next/image";

const HeroSection = () => {
  const pathname = usePathname();
  const isEntreprise = pathname === "/entreprise";
  const heroImage = isEntreprise ? heroEntreprise : heroParticulier;
  const heroImageMobile = isEntreprise ? heroEntrepriseMobile : heroParticulierMobile;

  return (
    <section className="relative h-[700px] md:h-[650px] overflow-hidden">
      {/* Desktop Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: `url(${heroImage.src})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-transparent" />
      </div>

      {/* Mobile Background */}
      <div className="absolute inset-0 block md:hidden">
        <Image
          src={heroImageMobile}
          alt="Background Mobile"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-transparent to-transparent" />
      </div>

      <div className="relative container h-full flex flex-col justify-center py-12">
        {/* Texte centré verticalement à gauche sur desktop, centré sur mobile */}
        <div className="animate-fade-in mb-auto mt-auto text-center bg-black/40 p-6 md:p-8 rounded-2xl md:max-w-4xl backdrop-blur-sm mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight mb-4 drop-shadow-lg">
            {isEntreprise ? "Nettoyage d'Entreprise à Casablanca : L'Exigence et la Propreté Premium" : "Agence Ménage Services : Votre Expert en Nettoyage et Entretien à Casablanca"}
          </h1>
          <h2 className="text-xl md:text-2xl text-primary-foreground/90 font-medium drop-shadow-md">
            {isEntreprise ? "Des solutions sur-mesure pour l'entretien de vos bureaux, la gestion de propreté et le nettoyage de fin de chantier." : "Des professionnels de confiance pour faire briller vos espaces de vie, vos bureaux et vos locations Airbnb."}
          </h2>
        </div>

        {/* Toggle centré en bas */}
        <div className="mt-auto flex justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex flex-col items-center">
            <h1 className="text-primary font-bold text-xl md:text-2xl mb-4 bg-white rounded-lg px-4 py-2 inline-block shadow-md text-center">Zone de couverture actuelle : Grand Casablanca</h1>
            <div className="inline-flex rounded-full overflow-hidden bg-background/95 p-1 shadow-xl">
              <Link href="/">
                <button
                  className={`px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-[2000ms] ${!isEntreprise
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-transparent text-foreground hover:bg-muted"
                    }`}
                >
                  Services<br />pour particuliers
                </button>
              </Link>
              <Link href="/entreprise">
                <button
                  className={`px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-[2000ms] ${isEntreprise
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-transparent text-foreground hover:bg-muted"
                    }`}
                >
                  Services<br />pour entreprises
                </button>
              </Link>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
