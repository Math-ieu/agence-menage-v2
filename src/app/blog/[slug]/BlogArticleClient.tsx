"use client";

import { useState } from "react";
import { getPostBySlug } from "@/data/blogData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ShareButtons from "@/components/ShareButtons";
import ArticleGallery from "@/components/ArticleGallery";
import { particulierServices, entrepriseServices } from "@/constants/services";
import { ArrowLeft, Phone, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

export default function BlogArticleClient({ slug }: { slug: string }) {
  const post = getPostBySlug(slug);
  const [showAllServices, setShowAllServices] = useState(false);

  if (!post) {
    notFound();
  }

  const articleUrl = `https://www.agencemenage.ma/blog/${post.slug}`;
  const allServices = post.category === "particulier" ? particulierServices : entrepriseServices;

  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <h3 key={i} className="text-2xl font-bold text-foreground mt-10 mb-4">{line.replace(/\*\*/g, "")}</h3>;
      }
      if (line.startsWith("- ")) {
        return <li key={i} className="text-muted-foreground ml-6 mb-2 list-disc">{line.slice(2)}</li>;
      }
      if (line.startsWith("✅") || line.startsWith("❌")) {
        return <p key={i} className="text-muted-foreground ml-2 mb-2 flex items-center gap-2 font-medium">{line}</p>;
      }
      if (/^\d+\./.test(line)) {
        return <li key={i} className="text-muted-foreground ml-6 mb-2 list-decimal font-medium text-foreground/80">{line.replace(/^\d+\.\s*/, "")}</li>;
      }
      if (line.trim() === "") {
        return <div key={i} className="h-6" />;
      }
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-muted-foreground leading-relaxed text-lg mb-4">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={j} className="text-foreground font-bold">{part.replace(/\*\*/g, "")}</strong>
              : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">
        {/* Banner */}
        <div className="h-4 sm:h-6 w-full" style={{ backgroundColor: post.bannerColor }} />

        <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour au blog
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-semibold rounded-full px-3 py-1 bg-muted">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 leading-[1.15] tracking-tight">{post.title}</h1>

          {/* Share buttons - top */}
          <div className="mb-10">
            <ShareButtons url={articleUrl} title={post.title} />
          </div>

          {/* Featured Image */}
          <div className="rounded-3xl overflow-hidden mb-12 aspect-[16/9] bg-muted relative shadow-sm border border-border">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" width={800} height={450} loading="lazy" />
          </div>

          {/* Article content */}
          <article className="prose prose-lg max-w-none text-muted-foreground">
            {renderContent(post.fullContent)}
          </article>

          {/* Gallery */}
          {post.gallery && post.gallery.length > 0 && (
            <ArticleGallery images={post.gallery} />
          )}

          {/* Services liés */}
          <div className="mt-16 p-8 rounded-3xl border border-border bg-card shadow-sm">
            <h3 className="text-2xl font-bold text-foreground mb-6">Services recommandés pour vous</h3>
            <div className="flex flex-wrap gap-3">
              {post.services.map((service) => (
                <a
                  key={service.name}
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="rounded-full shadow-sm hover:shadow-md transition-shadow">
                    {service.name}
                  </Button>
                </a>
              ))}
            </div>
          </div>

          {/* CTA Block */}
          <div className="mt-12 p-8 md:p-12 rounded-3xl text-center shadow-inner" style={{ backgroundColor: post.bannerColor + "15" }}>
            <h3 className="text-3xl font-black text-foreground mb-4">Prêt à passer à l'action ?</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">Confiez-nous l'entretien de vos espaces. L'expertise Agence Ménage garantit un résultat impeccable et durable.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {post.services.slice(0, 1).map((service) => (
                <a
                  key={service.name}
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto rounded-full shadow-md hover:shadow-lg transition-all text-base h-12 px-8">
                    {service.ctaLabel}
                  </Button>
                </a>
              ))}
              <a href="https://www.agencemenage.ma/contact" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto rounded-full shadow-sm hover:shadow-md transition-all text-base h-12 px-8 bg-white/50 backdrop-blur-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Contactez-nous
                </Button>
              </a>
            </div>

            {/* Voir d'autres services */}
            <div className="mt-10">
              <Button
                variant="ghost"
                className="rounded-full gap-2 text-primary hover:text-primary hover:bg-primary/10 font-semibold"
                onClick={() => setShowAllServices((v) => !v)}
              >
                <Sparkles className="w-4 h-4" />
                {showAllServices ? "Masquer les services" : "Voir notre catalogue complet"}
                {showAllServices ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>

              {showAllServices && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {allServices.map((service, index) => (
                    <a
                      key={index}
                      href={service.url}
                      className="group flex flex-col gap-2 p-4 rounded-2xl bg-white border border-black/5 hover:border-primary/30 hover:shadow-md transition-all"
                    >
                      <img src={service.image} alt={service.title} className="w-full h-32 object-cover rounded-xl mb-2 bg-muted transition-transform group-hover:scale-[1.02]" width={400} height={200} loading="lazy" />
                      <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{service.title}</span>
                      <span className="text-sm text-muted-foreground line-clamp-2">{service.description}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Share buttons - bottom */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="font-semibold text-foreground">Avez-vous aimé cet article ?</span>
            <ShareButtons url={articleUrl} title={post.title} />
          </div>

          {/* Back to blog */}
          <div className="mt-16 text-center">
            <Link href="/blog">
              <Button variant="outline" className="rounded-full h-12 px-8 shadow-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au blog
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
