import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PresentationSection from "@/components/PresentationSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TrustSection from "@/components/TrustSection";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const ServicesSection = dynamic(() => import("@/components/ServicesSection"));
const AboutSectionParticulier = dynamic(() => import("@/components/AboutSectionParliculier"));
const TeamReviews = dynamic(() => import("@/components/TeamReviews"));

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
                <TrustSection />
                <PartnersSection />
                <Footer />
            </main>
        </div>
    );
}
