import ServiceCard from "./ServiceCard";
import { cn } from "@/lib/utils";
import serviceAirbnb from "@/assets/service-menage-airbnb.png";
import serviceChantierParticulier from "@/assets/service-fin-chantier-particulier.png";
import serviceChantierEntreprise from "@/assets/service-fin-chantier-entreprise.png";
import serviceDemenagement from "@/assets/service-menage-demenagement.png";
import serviceRegulier from "@/assets/service-menage-standard.png";
import serviceGrandMenage from "@/assets/service-grand-menage.png";
import serviceGardeMalade from "@/assets/service-garde-malade.png";
import serviceBureaux from "@/assets/service-menage-bureaux.png";
import servicePlacement from "@/assets/service-placement-gestion.png";

interface ServicesGridProps {
  type: "particulier" | "entreprise";
}

const particulierServices = [
  { title: "Ménage standard", subtitle: "", color: "#287271", image: serviceRegulier, url: "/services/particulier/menage-standard" },
  { title: "Grand ménage", subtitle: "", color: "#e6dec7", image: serviceGrandMenage, url: "/services/particulier/grand-menage" },
  { title: "Ménage Airbnb", subtitle: "", color: "#9ed2ce", image: serviceAirbnb, url: "/services/particulier/menage-airbnb" },
  { title: "Nettoyage Fin de chantier", subtitle: "", color: "#e9f6e9", image: serviceChantierParticulier, url: "/services/particulier/menage-fin-chantier" },
  { title: "Ménage post déména-\n gement", subtitle: "", color: "#d1a246", image: serviceDemenagement, url: "/services/particulier/menage-demenagement" },
  { title: "Auxiliaire de vie / garde malade", subtitle: "", color: "#b46d2f", image: serviceGardeMalade, url: "/services/particulier/garde-malade" },
];

const entrepriseServices = [
  { title: "Ménages bureaux", subtitle: "", color: "#c7dd54", image: serviceBureaux, url: "/services/entreprise/menage-bureaux" },
  { title: "Placement & gestion de propreté", subtitle: "", color: "#f1db08", image: servicePlacement, url: "/services/entreprise/placement" },
  { title: "Nettoyage Fin de chantier", subtitle: "", color: "#88d89d", image: serviceChantierEntreprise, url: "/services/entreprise/menage-fin-chantier" },
];

const ServicesGrid = ({ type }: ServicesGridProps) => {
  const services = type === "particulier" ? particulierServices : entrepriseServices;
  const title = type === "particulier" ? "Services pour particuliers" : "Services pour entreprises";

  return (
    <section
      id={type === "particulier" ? "services-particuliers" : "services-entreprises"}
      className={`py-16 transition-colors duration-[2000ms] ${type === "entreprise" ? "bg-primary" : "bg-background"}`}
    >
      <div className="container">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 transition-colors duration-[2000ms] ${type === "entreprise" ? "text-white" : "text-foreground"
          }`}>
          {title}
        </h2>

        <div className="max-w-5xl mx-auto">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${type === "entreprise" ? "md:max-w-4xl mx-auto" : ""}`}>
            {services.map((service: any, index: number) => (
              <div
                key={`${service.title}-${service.subtitle || index}`}
                className={cn(
                  "animate-fade-in",
                  type === "entreprise" && index === 2 && "md:col-span-2 md:w-1/2 md:mx-auto"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceCard
                  title={service.title}
                  subtitle={service.subtitle}
                  color={service.color}
                  image={service.image}
                  url={service.url}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
