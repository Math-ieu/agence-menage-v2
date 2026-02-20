"use client";
import { Users, Phone, Monitor, ShieldCheck, MapPin, Settings2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const WhyChooseUs = ({ isEntreprise = false }: { isEntreprise?: boolean }) => {
  const particuliersFeatures = [
    {
      icon: ShieldCheck,
      title: "Fiabilité & Sécurité",
      description: "Tout notre personnel est déclaré, vérifié et formé à nos standards d'excellence.",
    },
    {
      icon: MapPin,
      title: "Proximité",
      description: "Une agence locale, implantée à la Résidence Anafe A, toujours réactive sur l'ensemble de Casablanca.",
    },
    {
      icon: Settings2,
      title: "Sur-mesure",
      description: "Des prestations qui s'adaptent exactement à vos horaires et à vos exigences.",
    },
  ];

  const entrepriseFeatures = [
    {
      icon: Users,
      title: "Un Personnel Formé et Évalué",
      description: "Nos équipes maîtrisent des techniques de nettoyage pointues et efficaces, parfaitement adaptées aux exigences du milieu professionnel.",
    },
    {
      icon: Phone,
      title: "Un Chargé de Clientèle Dédié 6j/7",
      description: "Un interlocuteur unique à votre écoute. Notre service client est disponible du lundi au samedi pour répondre avec réactivité à vos demandes.",
    },
    {
      icon: Monitor,
      title: "Une Gestion en Ligne Simplifiée",
      description: "Réservation, suivi des prestations et gestion : pilotez facilement votre contrat en ligne en toute transparence.",
    },
  ];

  const features = isEntreprise ? entrepriseFeatures : particuliersFeatures;
  const title = isEntreprise ? "Nos Engagements Pros" : "La Différence \"Premium Services\"";

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-section-teal rounded-xl flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          {isEntreprise ? (
            <>
              <p className="text-muted-foreground mb-6">Vous souhaitez un devis sur-mesure pour vos locaux ?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:+212522200177"
                  id="am_phone_header"
                  className="am-phone-header w-full sm:w-auto"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      (window as any).dataLayer = (window as any).dataLayer || [];
                      (window as any).dataLayer.push({
                        event: 'phone_click',
                        phone_location: 'WhyChooseUs_B2B',
                        phone_number: '0522200177'
                      });
                    }
                  }}
                >
                  <Button className="w-full sm:w-auto text-sm md:text-base px-6 py-3 rounded-full h-auto whitespace-normal" size="lg">
                    Contactez notre équipe B2B au<br className="sm:hidden" /> 05 22 20 01 77
                  </Button>
                </a>
                <a href="https://wa.me/212664226790" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-primary text-primary hover:bg-primary/10">WhatsApp : 06 64 22 67 90</Button>
                </a>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Ou écrivez-nous à <a href="mailto:contact@agencemenage.ma" className="underline">contact@agencemenage.ma</a></p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">Vous avez besoin d'une intervention rapide ?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="https://wa.me/212664226790" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto text-sm md:text-base px-6 py-4 md:py-3 rounded-full h-auto whitespace-normal" size="lg">Contactez-nous sur WhatsApp</Button>
                </a>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm md:text-base px-6 py-4 md:py-3 rounded-full h-auto whitespace-normal border-primary text-primary hover:bg-primary/10">Demandez votre devis gratuit en ligne</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
