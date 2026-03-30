"use client";

import { Facebook, Linkedin, Link as LinkIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Lien copié dans le presse-papiers");
    } catch (e) {
      toast.error("Erreur lors de la copie du lien");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <span className="text-sm font-semibold text-muted-foreground mr-2">Partager :</span>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encUrl}`} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="icon" className="rounded-full hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] border-border shadow-sm transition-all">
          <Facebook className="w-4 h-4" />
          <span className="sr-only">Facebook</span>
        </Button>
      </a>
      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encUrl}&title=${encTitle}`} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="icon" className="rounded-full hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] border-border shadow-sm transition-all">
          <Linkedin className="w-4 h-4" />
          <span className="sr-only">LinkedIn</span>
        </Button>
      </a>
      <a href={`https://wa.me/?text=${encTitle}%20${encUrl}`} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="icon" className="rounded-full hover:bg-[#25D366] hover:text-white hover:border-[#25D366] border-border shadow-sm transition-all">
          <MessageCircle className="w-4 h-4" />
          <span className="sr-only">WhatsApp</span>
        </Button>
      </a>
      <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white hover:border-primary border-border shadow-sm transition-all" onClick={copyLink}>
        <LinkIcon className="w-4 h-4" />
        <span className="sr-only">Copier le lien</span>
      </Button>
    </div>
  );
};

export default ShareButtons;
