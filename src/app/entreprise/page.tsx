import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import AboutSectionEntreprise from "@/components/AboutSectionEntreprise";
import PresentationSection from "@/components/PresentationSection";
import TeamReviews from "@/components/TeamReviews";
import PartnersSection from "@/components/PartnersSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services de Ménage pour Entreprises - Agence Ménage",
  description: "Solutions de nettoyage professionnelles pour bureaux et entreprises à Casablanca. Nettoyage régulier, grand ménage et placement de personnel.",
};

const Entreprise = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesGrid type="entreprise" />
        <AboutSectionEntreprise />
        <PresentationSection />
        <WhyChooseUs />
        <TeamReviews />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Entreprise;
