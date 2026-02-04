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
  title: "Services de Nettoyage pour Entreprises à Casablanca | Agence de Ménage",
  description: "Solutions de nettoyage sur mesure pour bureaux, commerces et copropriétés à Casablanca. Nettoyage professionnel pour booster votre image de marque.",
  openGraph: {
    title: "Services de Nettoyage pour Entreprises à Casablanca | Agence de Ménage",
    description: "Solutions de nettoyage sur mesure pour bureaux, commerces et copropriétés à Casablanca. Nettoyage professionnel pour booster votre image de marque.",
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
