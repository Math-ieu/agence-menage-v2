import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import logoPlaceholder from "@/assets/LOGO-AGENCE-MENAGE.webp";

const particulierLinks = [
  { href: "/services/particulier/menage-standard", label: "Ménage standard" },
  { href: "/services/particulier/grand-menage", label: "Grand ménage" },
  { href: "/services/particulier/menage-airbnb", label: "Ménage Airbnb" },
  { href: "/services/particulier/menage-fin-chantier", label: "Nettoyage Fin de chantier" },
  { href: "/services/particulier/garde-malade", label: "Auxiliaire de vie / garde malade" },
  { href: "/services/particulier/menage-post-sinistre", label: "Ménage Post-sinistre" },
];

const entrepriseLinks = [
  { href: "/services/entreprise/menage-bureaux", label: "Ménages bureaux" },
  { href: "/services/entreprise/placement", label: "Placement & gestion de propriété" },
  { href: "/services/entreprise/menage-fin-chantier", label: "Nettoyage Fin de chantier" },
  { href: "/services/entreprise/menage-post-sinistre", label: "Ménage Post-sinistre" },
];

const offices = [
  { city: "Bureau Casablanca", address: "36 boulevard d’anfa, résidence Anafe A, etage 7" },
  { city: "Bureau Rabat", address: "Avenue Hassan II, centre commercial Reda, porte G, appt. 49" },
];

const bottomLinks = [
  { href: "/a-propos", label: "À propos" },
  { href: "/blog", label: "Notre Blog" },
  { href: "/espace-employe", label: "Espace employé" },
  { href: "/contact", label: "Contact" },
];

const ColumnTitle = ({ children }: { children: React.ReactNode }) => (
  <>
    <h3 className="font-black text-base lg:text-lg uppercase tracking-wide">{children}</h3>
    <div className="w-10 h-0.5 bg-secondary mt-2 mb-5" />
  </>
);

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Band */}
      <div className="border-b border-primary-foreground/15 bg-black/10">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-12 lg:px-20 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h2 className="text-2xl md:text-3xl font-black leading-tight">
                Besoin d’un nettoyage premium ?
              </h2>
              <p className="text-primary-foreground/80 font-medium mt-1">
                Devis gratuit et personnalisé en moins de 2 minutes.
              </p>
            </div>
            <Link href="/contact" className="w-full sm:w-auto shrink-0">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full font-bold px-8 py-3.5 h-auto shadow-lg transition-transform hover:scale-105"
              >
                Réserver maintenant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-[1400px] w-full px-6 md:px-12 lg:px-20 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <Image
              src={logoPlaceholder}
              alt="Agence Ménage"
              className="h-14 w-auto mb-5 brightness-0 invert"
            />
            <p className="text-primary-foreground font-bold text-lg leading-relaxed max-w-xs mb-6">
              Premium, tout simplement.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61586972460164"
                aria-label="Visiter notre page Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 p-2.5 rounded-full hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/agencemenage?igsh=MXBtNmxzNmNwcmdiYg==&amp;utm_source=ig_contact_invite"
                aria-label="Visiter notre page Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 p-2.5 rounded-full hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Visiter notre page TikTok"
                className="bg-primary-foreground/10 p-2.5 rounded-full hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Particuliers */}
          <div>
            <Link href="/#services-particuliers" className="group inline-block">
              <ColumnTitle>Services particuliers</ColumnTitle>
            </Link>
            <ul className="space-y-3">
              {particulierLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/85 hover:text-white transition-colors font-medium text-sm lg:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprises */}
          <div>
            <Link href="/entreprise#services-entreprises" className="group inline-block">
              <ColumnTitle>Services entreprises</ColumnTitle>
            </Link>
            <ul className="space-y-3">
              {entrepriseLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/85 hover:text-white transition-colors font-medium text-sm lg:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <ColumnTitle>Contactez-nous</ColumnTitle>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 font-bold text-sm lg:text-base">
                <Phone className="w-5 h-5 mt-0.5 shrink-0 text-secondary" />
                <div className="flex flex-col">
                  <a href="tel:+212664226790" className="hover:text-white transition-colors">06 64 22 67 90</a>
                  <a href="tel:+212664331463" className="hover:text-white transition-colors">06 64 33 14 63</a>
                  <a href="tel:+212522200177" className="hover:text-white transition-colors opacity-90">05 22 20 02 39 (Fixe)</a>
                </div>
              </li>
              <li className="flex items-center gap-3 font-bold text-sm lg:text-base">
                <Mail className="w-5 h-5 shrink-0 text-secondary" />
                <a href="mailto:contact@agencemenage.ma" className="hover:text-white transition-colors break-all">
                  contact@agencemenage.ma
                </a>
              </li>
            </ul>

            <div className="mt-6 space-y-4">
              {offices.map((office) => (
                <div key={office.city} className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-secondary" />
                  <p className="text-sm lg:text-base leading-snug">
                    <span className="font-black block">{office.city}</span>
                    <span className="text-primary-foreground/80 font-medium">{office.address}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-12 lg:px-20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/70 font-medium text-sm text-center md:text-left">
              © 2026 Agence Ménage — Casablanca &amp; Rabat, Maroc | Tous droits réservés
            </p>
            <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm font-medium">
              {bottomLinks.map((link, index) => (
                <span key={link.href} className="flex items-center gap-2">
                  <Link href={link.href} className="text-primary-foreground/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                  {index < bottomLinks.length - 1 && (
                    <span className="text-primary-foreground/30">·</span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
