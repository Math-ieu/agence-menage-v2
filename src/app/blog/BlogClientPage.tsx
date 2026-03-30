"use client";

import { useState } from "react";
import BlogCategorySection from "@/components/BlogCategorySection";
import { getPostsByCategory } from "@/data/blogData";
import { Users, Building2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type TabType = "particuliers" | "entreprises";

export default function BlogClientPage() {
  const [activeTab, setActiveTab] = useState<TabType>("particuliers");

  const particulierPosts = getPostsByCategory("particulier");
  const entreprisePosts = getPostsByCategory("entreprise");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 md:pt-28">
        <section className="py-16 md:py-24 px-4 bg-background border-b border-border/40">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight">
              Notre <span className="text-primary">Blog</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Conseils, guides et astuces pour un intérieur impeccable et des locaux
              professionnels toujours propres. Trouvez l'inspiration selon vos besoins.
            </p>

            <div className="inline-flex justify-center p-1.5 bg-muted/30 rounded-full border border-border/50 mx-auto shadow-sm backdrop-blur-sm">
              <button
                onClick={() => setActiveTab("particuliers")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === "particuliers"
                    ? "bg-primary text-primary-foreground shadow-md transform scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Users className="w-4 h-4" />
                Particuliers
              </button>

              <button
                onClick={() => setActiveTab("entreprises")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === "entreprises"
                    ? "bg-primary text-primary-foreground shadow-md transform scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Entreprises
              </button>
            </div>
          </div>
        </section>

        <div className="transition-opacity duration-500 ease-in-out">
          {activeTab === "particuliers" && (
             <BlogCategorySection
               id="particuliers"
               title="Pour les particuliers"
               icon={<Users className="w-8 h-8 text-primary" />}
               description="Des conseils pratiques pour simplifier votre quotidien et maintenir une maison saine."
               posts={particulierPosts}
               services={[]}
               ctaButtons={[
                 { label: "Réserver mon ménage", url: "/services/particulier", variant: "default" },
               ]}
               bgColor="#F8FAFC"
             />
          )}

          {activeTab === "entreprises" && (
             <BlogCategorySection
               id="entreprises"
               title="Pour les entreprises"
               icon={<Building2 className="w-8 h-8 text-primary" />}
               description="Tout ce que les professionnels doivent savoir sur l'entretien et l'hygiène au travail."
               posts={entreprisePosts}
               services={[]}
               ctaButtons={[
                 { label: "Contacter un conseiller", url: "/contact", variant: "default" },
                 { label: "Demander un devis", url: "/entreprise", variant: "outline" },
               ]}
               bgColor="#F0F9FF"
             />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
