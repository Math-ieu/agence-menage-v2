import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import BlogCard from "./BlogCard";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/data/blogData";
import { Building2, Sparkles, Shield, Clock, Home, UserCheck, Settings,ChevronDown, ChevronUp, Plus } from "lucide-react";

interface ServiceReminder {
  icon: React.ReactNode;
  name: string;
  url: string;
}

type CtaButton = {
  label: string;
  url: string;
  variant?: "default" | "outline";
  action?: "link" | "scroll-services" | "show-services";
};

interface BlogCategorySectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  posts: BlogPost[];
  services: ServiceReminder[];
  ctaButtons: CtaButton[];
  bgColor: string;
}

const particulierServices: ServiceReminder[] = [
  { icon: <Sparkles className="w-5 h-5" />, name: "Ménage Standard", url: "/services/particulier/menage-standard" },
  { icon: <Home className="w-5 h-5" />, name: "Grand Ménage", url: "/services/particulier/grand-menage" },
  { icon: <Clock className="w-5 h-5" />, name: "Ménage Airbnb", url: "/services/particulier/menage-airbnb" },
  { icon: <Settings className="w-5 h-5" />, name: "Ménage fin de chantier", url: "/services/particulier/menage-fin-chantier" },
  { icon: <UserCheck className="w-5 h-5" />, name: "Auxiliaire de vie / Garde malade", url: "/services/particulier/garde-malade" },
  { icon: <Shield className="w-5 h-5" />, name: "Ménage Post-sinistre", url: "/services/particulier/menage-post-sinistre" },
];

const entrepriseServices: ServiceReminder[] = [
  { icon: <Building2 className="w-5 h-5" />, name: "Ménages bureaux", url: "/services/entreprise/nettoyage-bureaux" },
  { icon: <UserCheck className="w-5 h-5" />, name: "Placement & Gestion", url: "/services/entreprise/mise-a-disposition" },
  { icon: <Settings className="w-5 h-5" />, name: "Nettoyage Fin de chantier", url: "/services/entreprise/nettoyage-fin-chantier" },
  { icon: <Shield className="w-5 h-5" />, name: "Ménage Post-sinistre", url: "/services/entreprise/menage-post-sinistre" },
];

const BlogCategorySection = ({ id, title, icon, description, posts, services, ctaButtons, bgColor }: BlogCategorySectionProps) => {
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const isMobile = useIsMobile();
  const maxVisible = isMobile ? 3 : 6;
  const hasMore = posts.length > maxVisible;
  const visiblePosts = showAllPosts ? posts : posts.slice(0, maxVisible);

  const handleCtaClick = (cta: CtaButton) => {
    if (cta.action === "scroll-services") {
      document.getElementById(`${id}-services`)?.scrollIntoView({ behavior: "smooth" });
    } else if (cta.action === "show-services") {
      setShowServicePicker((v) => !v);
    } else {
      window.open(cta.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id={id} className="py-16 px-4" style={{ backgroundColor: bgColor }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 relative">
            {ctaButtons.map((cta) => (
              <div key={cta.label} className="relative">
                <Button
                  variant={cta.variant || "default"}
                  className="rounded-full text-sm md:text-base"
                  size={isMobile ? "default" : "lg"}
                  onClick={() => handleCtaClick(cta)}
                >
                  {cta.label}
                  {cta.action === "show-services" && <ChevronDown className="w-4 h-4 ml-1" />}
                </Button>

                {/* Service picker dropdown */}
                {cta.action === "show-services" && showServicePicker && (
                  <div className="absolute top-full right-0 mt-2 z-50 w-72 rounded-2xl border border-border bg-card shadow-lg p-4">
                    <p className="text-sm font-semibold text-foreground mb-3">Choisissez un service :</p>
                    <div className="flex flex-col gap-1">
                      {services.map((service) => (
                        <a
                          key={service.name}
                          href={service.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            {service.icon}
                          </div>
                          <span className="text-sm font-medium text-foreground">{service.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl">{description}</p>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {visiblePosts.map((post) => (
            <BlogCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              description={post.description}
              tags={post.tags}
              bannerColor={post.bannerColor}
            />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mb-10">
            <Button
              variant="outline"
              className="rounded-full gap-2"
              onClick={() => setShowAllPosts((v) => !v)}
            >
              {showAllPosts ? (
                <>Réduire <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Blog + <Plus className="w-4 h-4" /></>
              )}
            </Button>
          </div>
        )}

      </div>
    </section>
  );
};

export { particulierServices, entrepriseServices };
export default BlogCategorySection;
