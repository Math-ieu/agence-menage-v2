"use client";

import * as React from "react";
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

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

interface ServicesGridProps {
  type: "particulier" | "entreprise";
}

const particulierServices = [
  {
    title: "Ménage standard",
    subtitle: "L'entretien régulier de votre domicile par des professionnelles de confiance.",
    color: "#287271",
    image: serviceRegulier,
    url: "/services/particulier/menage-standard"
  },
  {
    title: "Grand ménage",
    subtitle: "Un nettoyage en profondeur pour une remise à neuf complète de vos espaces.",
    color: "#e6dec7",
    image: serviceGrandMenage,
    url: "/services/particulier/grand-menage"
  },
  {
    title: "Ménage Airbnb",
    subtitle: "Optimisez vos locations avec un service hôtelier irréprochable entre chaque voyageur.",
    color: "#9ed2ce",
    image: serviceAirbnb,
    url: "/services/particulier/menage-airbnb"
  },
  {
    title: "Nettoyage Fin de chantier",
    subtitle: "Élimination des résidus de travaux pour une livraison de chantier impeccable.",
    color: "#e9f6e9",
    image: serviceChantierParticulier,
    url: "/services/particulier/menage-fin-chantier"
  },
  {
    title: "Ménage post déménagement",
    subtitle: "Simplifiez votre installation ou votre départ avec un logement nettoyé de A à Z.",
    color: "#d1a246",
    image: serviceDemenagement,
    url: "/services/particulier/menage-demenagement"
  },
  {
    title: "Auxiliaire de vie/Garde malade",
    subtitle: "Une présence bienveillante et qualifiée pour accompagner vos proches vulnérables.",
    color: "#b46d2f",
    image: serviceGardeMalade,
    url: "/services/particulier/garde-malade"
  },
];

const entrepriseServices = [
  {
    title: "Ménages bureaux",
    subtitle: "Des espaces de travail sains pour booster la productivité de vos équipes.",
    color: "#c7dd54",
    image: serviceBureaux,
    url: "/services/entreprise/menage-bureaux"
  },
  {
    title: "Placement & gestion",
    subtitle: "Déléguez votre propreté avec nos solutions de placement avec ou sans gestion RH.",
    color: "#f1db08",
    image: servicePlacement,
    url: "/services/entreprise/placement"
  },
  {
    title: "Nettoyage Fin de chantier",
    subtitle: "Un standard pro pour faciliter la réception de vos projets immobiliers.",
    color: "#88d89d",
    image: serviceChantierEntreprise,
    url: "/services/entreprise/menage-fin-chantier"
  },
];

const ServicesGrid = ({ type }: ServicesGridProps) => {
  const services = type === "particulier" ? particulierServices : entrepriseServices;
  const title = type === "particulier" ? "Services pour particuliers" : "Services pour entreprises";
  const [api, setApi] = React.useState<any>();

  return (
    <section
      id={type === "particulier" ? "services-particuliers" : "services-entreprises"}
      className={cn(
        "pt-16 pb-24 relative overflow-hidden",
        type === "entreprise" ? "bg-primary" : "bg-white"
      )}
    >
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className={cn(
            "text-4xl md:text-5xl font-black mb-6 tracking-tight",
            type === "entreprise" ? "text-white" : "text-slate-900"
          )}>
            {title}
          </h2>
          <div className={cn("h-1.5 w-24 mx-auto rounded-full", type === "entreprise" ? "bg-white/30" : "bg-primary/20")} />
        </div>

        <div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          onMouseEnter={() => api?.plugins()?.autoplay?.stop()}
          onMouseLeave={() => api?.plugins()?.autoplay?.play()}
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            plugins={[
              Autoplay({
                delay: 2500,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {services.map((service, index) => (
                <CarouselItem
                  key={`${service.title}-${index}`}
                  className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3 h-full py-6"
                >
                  <ServiceCard
                    title={service.title}
                    subtitle={service.subtitle}
                    color={service.color}
                    image={service.image}
                    url={service.url}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation buttons - only show on screens large enough */}
            <div className="hidden xl:block">
              <CarouselPrevious className={cn(
                "-left-16 transition-all w-12 h-12",
                type === "entreprise" ? "border-white/40 text-white hover:bg-white hover:text-primary" : "border-primary/20 hover:bg-primary hover:text-white"
              )} />
              <CarouselNext className={cn(
                "-right-16 transition-all w-12 h-12",
                type === "entreprise" ? "border-white/40 text-white hover:bg-white hover:text-primary" : "border-primary/20 hover:bg-primary hover:text-white"
              )} />
            </div>
            <div className="hidden md:block xl:hidden">
              <CarouselPrevious className={cn(
                "-left-8 transition-all w-10 h-10",
                type === "entreprise" ? "border-white/40 text-white hover:bg-white hover:text-primary" : "border-primary/20 hover:bg-primary hover:text-white"
              )} />
              <CarouselNext className={cn(
                "-right-8 transition-all w-10 h-10",
                type === "entreprise" ? "border-white/40 text-white hover:bg-white hover:text-primary" : "border-primary/20 hover:bg-primary hover:text-white"
              )} />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
