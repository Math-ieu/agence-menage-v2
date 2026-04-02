"use client";

import { useState, useEffect } from "react";
import BlogCategorySection, { particulierServices, entrepriseServices } from "@/components/BlogCategorySection";
import ServicesShowcase from "@/components/ServicesShowcase";
import ContactSection from "@/components/ContactSection";
import { getPostsByCategory } from "@/data/blogData";
import { Users, Building2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type TabType = "particuliers" | "entreprises";

export default function BlogClientPage() {
  const [activeTab, setActiveTab] = useState<TabType>("particuliers");

  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent).detail as TabType;
      setActiveTab(tab);
    };
    window.addEventListener('switch-tab', handler);
    return () => window.removeEventListener('switch-tab', handler);
  }, []);

  const particulierPosts = getPostsByCategory("particulier");
  const entreprisePosts = getPostsByCategory("entreprise");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Blog Intro with Tabs */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Notre Blog
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Conseils, guides et astuces pour un intérieur impeccable et des locaux
              professionnels toujours propres. Que vous soyez un particulier ou une
              entreprise, trouvez l'inspiration ici.
            </p>

            <div className="flex justify-center gap-2 max-w-sm mx-auto">
              <button
                onClick={() => setActiveTab("particuliers")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                  activeTab === "particuliers"
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                <Users className="w-4 h-4" />
                Particuliers
              </button>

              <button
                onClick={() => setActiveTab("entreprises")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                  activeTab === "entreprises"
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Entreprises
              </button>
            </div>
          </div>
        </section>

        {/* Tab Content */}
        {activeTab === "particuliers" && (
          <BlogCategorySection
            id="particuliers"
            title="Pour les particuliers"
            icon={<Users className="w-8 h-8 text-primary" />}
            description="Conseils, guides et astuces pour un intérieur toujours propre et un quotidien simplifié."
            posts={particulierPosts}
            services={particulierServices}
            ctaButtons={[
              { label: "Réserver mon ménage", url: "", action: "show-services" },
            ]}
            bgColor="#EFF3F8"
          />
        )}

        {activeTab === "entreprises" && (
          <BlogCategorySection
            id="entreprises"
            title="Pour les entreprises"
            icon={<Building2 className="w-8 h-8 text-primary" />}
            description="Bureaux, normes d'hygiène, externalisation : tout ce que les entreprises doivent savoir."
            posts={entreprisePosts}
            services={entrepriseServices}
            ctaButtons={[
              { label: "Contacter un conseiller", url: "/contact" },
              { label: "Demander un devis", url: "/contact", variant: "outline" },
            ]}
            bgColor="#F0F9FF"
          />
        )}

        <ServicesShowcase activeTab={activeTab} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
