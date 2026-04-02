import { Facebook, Mail, MessageCircle, Link as LinkIcon, Instagram } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Lien copié !");
  };

  const buttons = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-green-100 hover:text-green-600",
    },
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-blue-100 hover:text-blue-600",
    },
    {
      label: "Instagram",
      icon: Instagram,
      href: `https://www.instagram.com/`,
      color: "hover:bg-pink-100 hover:text-pink-600",
    },
    {
      label: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      color: "hover:bg-red-100 hover:text-red-500",
    },
    {
      label: "Copier le lien",
      icon: LinkIcon,
      onClick: copyLink,
      color: "hover:bg-muted hover:text-foreground",
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground mr-1">Partager :</span>
      {buttons.map((btn) => {
        const Icon = btn.icon;
        if (btn.onClick) {
          return (
            <button
              key={btn.label}
              onClick={btn.onClick}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground border border-border transition-colors ${btn.color}`}
              title={btn.label}
            >
              <Icon className="w-3.5 h-3.5" />
              {btn.label}
            </button>
          );
        }
        return (
          <a
            key={btn.label}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground border border-border transition-colors ${btn.color}`}
            title={btn.label}
          >
            <Icon className="w-3.5 h-3.5" />
            {btn.label}
          </a>
        );
      })}
    </div>
  );
};

export default ShareButtons;
