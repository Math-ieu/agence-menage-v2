"use client";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import dynamic from "next/dynamic";

const AboutSectionParticulier = dynamic(() => import("@/components/AboutSectionParliculier"));
const PresentationSection = dynamic(() => import("@/components/PresentationSection"));
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const TeamReviews = dynamic(() => import("@/components/TeamReviews"));
const PartnersSection = dynamic(() => import("@/components/PartnersSection"));
const Footer = dynamic(() => import("@/components/Footer"));

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
