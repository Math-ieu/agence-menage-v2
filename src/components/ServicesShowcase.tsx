import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown, ChevronUp } from "lucide-react";

const particulierServices = [
  {
    title: "Ménage standard",
    description: "Le ménage standard a pour objectif d'assurer la propreté et l'entretien courant des espaces attribués.",
    url: "/services/particulier/menage-standard",
    dotColor: "#2196F3",
  },
  {
    title: "Grand Ménage",
    description: "Un nettoyage en profondeur pour redonner éclat et fraîcheur à l'ensemble de votre intérieur.",
    url: "/services/particulier/grand-menage",
    dotColor: "#1976D2",
  },
  {
    title: "Ménage Airbnb",
    description: "Un service de nettoyage rapide et impeccable entre chaque location pour vos logements saisonniers.",
    url: "/services/particulier/menage-airbnb",
    dotColor: "#E67E22",
  },
  {
    title: "Nettoyage post-déménagement",
    description: "Un nettoyage complet après votre déménagement pour rendre ou accueillir un logement impeccable.",
    url: "/services/particulier/menage-demenagement",
    dotColor: "#F1C40F",
  },
  {
    title: "Auxiliaire de vie / Garde malade",
    description: "Un accompagnement professionnel et bienveillant pour les personnes âgées ou en convalescence à domicile.",
    url: "/services/particulier/auxiliaire-de-vie",
    dotColor: "#9B59B6",
  },
  {
    title: "Ménage fin de chantier",
    description: "Élimination de la poussière et des résidus de travaux pour un espace prêt à être habité.",
    url: "/services/particulier/menage-fin-chantier",
    dotColor: "#F39C12",
  },
  {
    title: "Ménage Post-sinistre",
    description: "Remise en état et nettoyage approfondi après un sinistre pour retrouver un espace sain.",
    url: "/services/particulier/menage-post-sinistre",
    dotColor: "#27AE60",
  },
];

const entrepriseServices = [
  {
    title: "Ménages bureaux",
    description: "Nettoyage régulier et professionnel de vos espaces de travail pour un environnement sain et productif.",
    url: "/services/entreprise/nettoyage-bureaux",
    dotColor: "#2196F3",
  },
  {
    title: "Placement & Gestion",
    description: "Mise à disposition de personnel qualifié et gestion complète de vos besoins en ressources humaines.",
    url: "/services/entreprise/mise-a-disposition",
    dotColor: "#1976D2",
  },
  {
    title: "Nettoyage Fin de chantier",
    description: "Élimination des résidus de travaux et remise en état complète de vos locaux professionnels.",
    url: "/services/entreprise/nettoyage-fin-chantier",
    dotColor: "#E67E22",
  },
  {
    title: "Ménage Post-sinistre",
    description: "Intervention rapide et nettoyage approfondi de vos locaux après un sinistre pour reprendre l'activité.",
    url: "/services/entreprise/menage-post-sinistre",
    dotColor: "#27AE60",
  },
];

interface ServicesShowcaseProps {
  activeTab?: "particuliers" | "entreprises";
}

const ServicesShowcase = ({ activeTab = "particuliers" }: ServicesShowcaseProps) => {
  const services = activeTab === "entreprises" ? entrepriseServices : particulierServices;
  const isMobile = useIsMobile();
  const [showAll, setShowAll] = useState(false);
  const mobileMax = 4;
  const visibleServices = isMobile && !showAll ? services.slice(0, mobileMax) : services;
  const hasMore = isMobile && services.length > mobileMax;

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-center mb-3">
          Nos Services
        </h2>
        <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
          Des solutions adaptées aux particuliers et aux entreprises
        </p>

        <div className="flex justify-center gap-3 mb-10">
          <a href="/contact" target="_blank" rel="noopener noreferrer">
            <Button className="rounded-full" size="lg">
              Réserver mon ménage
            </Button>
          </a>
          <a href="/contact" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="rounded-full" size="lg">
              Nous contacter
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {visibleServices.map((service) => (
            <div
              key={service.title}
              className="rounded-xl bg-card p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-foreground">{service.title}</h3>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                  style={{ backgroundColor: service.dotColor }}
                />
              </div>
              <p className="text-xs text-muted-foreground mb-3 flex-1">{service.description}</p>
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-primary hover:underline"
              >
                En savoir plus
              </a>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              className="rounded-full gap-2"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? (
                <>Réduire <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Voir tous les services <ChevronDown className="w-4 h-4" /></>
              )}
            </Button>
          </div>
        )}

        <div className="flex justify-center mt-10">
          {activeTab === "entreprises" ? (
            <a href="/#particuliers" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); const event = new CustomEvent('switch-tab', { detail: 'particuliers' }); window.dispatchEvent(event); }}>
              <Button variant="outline" className="rounded-full" size="lg">
                Voir les services pour les particuliers →
              </Button>
            </a>
          ) : (
            <a href="/#entreprises" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); const event = new CustomEvent('switch-tab', { detail: 'entreprises' }); window.dispatchEvent(event); }}>
              <Button variant="outline" className="rounded-full" size="lg">
                Voir les services pour les entreprises →
              </Button>
            </a>
          )}
        </div>

      </div>
    </section>
  );
};

export default ServicesShowcase;
