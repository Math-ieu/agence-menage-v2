import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const AboutSectionEntreprise = dynamic(() => import("@/components/AboutSectionEntreprise"));
const PresentationSection = dynamic(() => import("@/components/PresentationSection"));
const TeamReviews = dynamic(() => import("@/components/TeamReviews"));
const PartnersSection = dynamic(() => import("@/components/PartnersSection"));
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const Footer = dynamic(() => import("@/components/Footer"));

export const metadata: Metadata = {
  title: "Nettoyage Entreprise Casablanca | Agence Ménage Pro",
  description: "Solutions de nettoyage entreprise à Casablanca. Notre agence de ménage propose des services professionnels de femmes de ménage pour bureaux et commerces.",
  openGraph: {
    title: "Nettoyage Entreprise Casablanca | Agence Ménage Pro",
    description: "Solutions de nettoyage entreprise à Casablanca. Notre agence de ménage propose des services professionnels de femmes de ménage pour bureaux et commerces.",
    url: "https://www.agencemenage.ma/entreprise",
    type: "website",
    images: [
      {
        url: "/og-entreprise.png",
        width: 1200,
        height: 630,
        alt: "Services Entreprise Agence de Ménage Casablanca",
      },
    ],
  },
};

const Entreprise = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection type="entreprise" />
        <AboutSectionEntreprise />
        <PresentationSection isEntreprise />
        <WhyChooseUs isEntreprise />
        <TeamReviews />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Entreprise;
