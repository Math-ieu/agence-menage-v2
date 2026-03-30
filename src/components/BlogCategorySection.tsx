"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CalendarDays } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@/data/blogData";

// Re-export services so that Index (2).tsx still works as written
export { particulierServices, entrepriseServices } from "@/constants/services";

interface BlogCategorySectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  posts: BlogPost[];
  services: any[];
  ctaButtons: { label: string; url: string; action?: string; variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary" }[];
  bgColor: string;
}

const BlogCategorySection = ({
  id,
  title,
  icon,
  description,
  posts,
  services,
  ctaButtons,
  bgColor,
}: BlogCategorySectionProps) => {
  return (
    <section id={id} className="py-20 px-4 transition-colors duration-500" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 border border-black/5">
            {icon}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" width={400} height={250} loading="lazy" />
                  <div className="absolute top-4 left-4 z-20">
                     <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm backdrop-blur-sm" style={{ backgroundColor: post.bannerColor }}>
                       {post.tags[0] || post.category}
                     </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow relative">
                  <div className="flex items-center gap-5 text-xs font-medium text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" />{post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all gap-1">
                    Lire l'article <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/50 rounded-2xl border border-white mb-16 shadow-sm">
            <p className="text-muted-foreground text-lg">De nouveaux articles arrivent bientôt dans cette catégorie.</p>
          </div>
        )}

        {ctaButtons && ctaButtons.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {ctaButtons.map((btn, i) => (
              btn.url ? (
                <a key={i} href={btn.url}>
                  <Button variant={btn.variant || "default"} size="lg" className="rounded-full px-8 h-12 text-base shadow-md hover:shadow-lg transition-all">
                    {btn.label}
                  </Button>
                </a>
              ) : (
                <Button key={i} variant={btn.variant || "default"} size="lg" className="rounded-full px-8 h-12 text-base shadow-md hover:shadow-lg transition-all">
                  {btn.label}
                </Button>
              )
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogCategorySection;
