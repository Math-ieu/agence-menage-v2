"use client";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import AboutSectionParticulier from "@/components/AboutSectionParliculier";
import PresentationSection from "@/components/PresentationSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TeamReviews from "@/components/TeamReviews";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <ServicesGrid type="particulier" />
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
