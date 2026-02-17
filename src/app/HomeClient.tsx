"use client";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSectionParticulier from "@/components/AboutSectionParliculier";
import PresentationSection from "@/components/PresentationSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TeamReviews from "@/components/TeamReviews";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";

export default function HomeClient() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <ServicesSection />
                <AboutSectionParticulier />
                <PresentationSection />
                <WhyChooseUs />
                <TeamReviews />
                <PartnersSection />
                <Footer />
            </main>
        </div>
    );
}
