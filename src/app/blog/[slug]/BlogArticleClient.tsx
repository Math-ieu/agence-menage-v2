"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ShareButtons from "@/components/ShareButtons";
import ArticleGallery from "@/components/ArticleGallery";
import { particulierServices, entrepriseServices } from "@/components/BlogCategorySection";
import { ArrowLeft, Phone, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesShowcase from "@/components/ServicesShowcase";
import ContactSection from "@/components/ContactSection";

export default function BlogArticleClient({ initialPost }: { initialPost: any }) {
  const [showAllServices, setShowAllServices] = useState(false);
  const [activeTab, setActiveTab] = useState<"particuliers" | "entreprises">("particuliers");

  const isEntreprise = 
    initialPost.category === 2 || 
    (initialPost.category_name || "").toLowerCase().includes("entreprise");

  const post = {
    ...initialPost,
    category: isEntreprise ? "entreprise" : "particulier",
    imageUrl: initialPost.featured_image,
    fullContent: initialPost.content,
    tags: (initialPost.tags || []).map((t: any) => typeof t === 'string' ? t : t.name),
    gallery: (initialPost.gallery || []).map((img: any) => ({
      src: img.image,
      alt: img.alt,
      caption: img.caption
    })),
    services: initialPost.related_services || [],
    bannerColor: (initialPost.banner_color && initialPost.banner_color !== "#BCC6D0")
      ? initialPost.banner_color
      : (isEntreprise ? "#67E8F9" : "#93C5FD")
  };

  // Unified category handling using isEntreprise

  useEffect(() => {
    if (post) {
      setActiveTab(post.category === "particulier" ? "particuliers" : "entreprises");
    }
  }, [post.category]);

  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent).detail as "particuliers" | "entreprises";
      setActiveTab(tab);
    };
    window.addEventListener('switch-tab', handler);
    return () => window.removeEventListener('switch-tab', handler);
  }, []);

  const articleUrl = `https://www.agencemenage.ma/blog/${post.slug}`;

  // Helper to find full service object by name with robust normalization
  const findService = (name: string) => {
    const normalize = (str: string) => 
      (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    
    const normName = normalize(name);
    const allAvailable = [...particulierServices, ...entrepriseServices];
    
    return allAvailable.find(s => normalize(s.name) === normName);
  };

  // Filter services into sections and DEDUPLICATE by normalized name
  const uniqueServices = (post.services || []).reduce((acc: any[], current: any) => {
    if (!current || !current.name) return acc;
    
    const normalize = (str: string) => 
      (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    
    const currNorm = normalize(current.name);
    const existing = acc.find(s => normalize(s.name) === currNorm);
    
    if (existing) {
      if (current.is_recommended || current.is_recommended === undefined) existing.is_recommended = true;
    } else {
      const isRecommended = current.is_recommended !== false; 
      acc.push({ ...current, is_recommended: isRecommended });
    }
    return acc;
  }, []);

  const recommendedServicesData = uniqueServices
    .filter((s: any) => s.is_recommended)
    .map((s: any) => ({ ...s, ...findService(s.name) }));

  const extraServicesData = uniqueServices
    .filter((s: any) => !s.is_recommended)
    .map((s: any) => ({ ...s, ...findService(s.name) }));

  // Always show all services for the category in the "Other Services" grid
  const finalExtraServices = post.category === "particulier" ? particulierServices : entrepriseServices;

  const renderContent = (text: string) => {
    // Check if the content is HTML (from Tiptap) or plain text with Markdown-style formatting
    if (text.trim().startsWith("<")) {
      return <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: text }} />;
    }

    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <h3 key={i} className="text-lg font-bold text-foreground mt-6 mb-2">{line.replace(/\*\*/g, "")}</h3>;
      }
      if (line.startsWith("- ")) {
        return <li key={i} className="text-muted-foreground ml-4">{line.slice(2)}</li>;
      }
      if (line.startsWith("✅") || line.startsWith("❌")) {
        return <p key={i} className="text-muted-foreground ml-2">{line}</p>;
      }
      if (/^\d+\./.test(line)) {
        return <li key={i} className="text-muted-foreground ml-4 list-decimal">{line.replace(/^\d+\.\s*/, "")}</li>;
      }
      if (line.trim() === "") {
        return <div key={i} className="h-3" />;
      }
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-muted-foreground leading-relaxed">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={j} className="text-foreground font-semibold">{part.replace(/\*\*/g, "")}</strong>
              : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Banner Sync with Card */}
        <div className="h-5 w-full shadow-sm relative z-10" style={{ backgroundColor: post.bannerColor }} />

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs font-medium rounded-full">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">{post.title}</h1>

          {/* Share buttons - top */}
          <div className="mb-8">
            <ShareButtons url={articleUrl} title={post.title} />
          </div>

          {/* Article content */}
          <article className="prose-sm space-y-1">
            {renderContent(post.fullContent)}
          </article>

          {/* Gallery */}
          {post.gallery.length > 0 && <ArticleGallery images={post.gallery} />}

          {/* Services liés */}
          {recommendedServicesData.length > 0 && (
            <div className="mt-12 p-6 rounded-2xl border border-border bg-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Nos services recommandés</h3>
              <div className="flex flex-wrap gap-3">
                {recommendedServicesData.map((service: any) => (
                  <a
                    key={service.name}
                    href={service.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="rounded-full">
                      {service.name}
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 p-8 rounded-2xl text-center" style={{ backgroundColor: post.bannerColor + "20" }}>
            <h3 className="text-xl font-bold text-foreground mb-2">Prêt à passer à l'action ?</h3>
            <p className="text-foreground font-medium text-lg mb-8">Faites confiance à Agence Ménage pour un intérieur impeccable.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {recommendedServicesData.map((service: any) => (
                <a
                  key={service.name}
                  href={service.url || post.cta_contact_link || "/contact"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="rounded-full gap-2" size="lg">
                    {service.icon && <span className="w-5 h-5">{service.icon}</span>}
                    {service.name}
                  </Button>
                </a>
              ))}
              <a href={post.cta_contact_link || "/contact"}>
                <Button variant="outline" className="rounded-full" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  {post.cta_phone || "Contactez-nous"}
                </Button>
              </a>
            </div>

            {/* Voir d'autres services */}
            <div className="mt-6">
              <Button
                variant="ghost"
                className="rounded-full gap-2 text-primary hover:text-primary"
                onClick={() => setShowAllServices((v) => !v)}
              >
                <Sparkles className="w-4 h-4" />
                {showAllServices ? "Masquer les services" : "Voir d'autres services"}
                {showAllServices ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>

              {showAllServices && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {finalExtraServices.map((service: any) => (
                    <a
                      key={service.name}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {service.icon}
                      </div>
                      <span className="text-sm font-medium text-foreground">{service.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Share buttons - bottom */}
          <div className="mt-8 pt-6 border-t border-border">
            <ShareButtons url={articleUrl} title={post.title} />
          </div>

          {/* Back to blog */}
          <div className="mt-8 text-center">
            <Link href="/blog">
              <Button variant="ghost" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au blog
              </Button>
            </Link>
          </div>
        </div>

        <ServicesShowcase activeTab={activeTab} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
