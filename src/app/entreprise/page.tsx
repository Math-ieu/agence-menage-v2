import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSectionEntreprise from "@/components/AboutSectionEntreprise";
import PresentationSection from "@/components/PresentationSection";
import TeamReviews from "@/components/TeamReviews";
import PartnersSection from "@/components/PartnersSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import { Metadata } from "next";

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
