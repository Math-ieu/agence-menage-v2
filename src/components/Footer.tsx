import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import logoPlaceholder from "@/assets/LOGO-AGENCE-MENAGE.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="w-full px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo Column */}
          <div className="flex flex-col items-start">
            <img src={logoPlaceholder.src} alt="Agence Ménage" className="h-16 w-auto mb-6 brightness-0 invert" />
            <p className="text-primary-foreground font-bold text-lg leading-relaxed max-w-xs">
              Votre partenaire de confiance pour un espace propre et serein.
            </p>
          </div>

          {/* Services Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:col-span-1">
            <div className="space-y-6">
              <Link href="/#services-particuliers" className="block font-black text-xl mb-6 border-b-2 border-primary-foreground/20 pb-2 hover:text-white transition-colors">Services pour particuliers</Link>
              <ul className="space-y-3">
                <li><Link href="/services/particulier/menage-standard" className="text-primary-foreground hover:text-white transition-colors font-bold text-sm lg:text-base">Ménage standard</Link></li>
                <li><Link href="/services/particulier/grand-menage" className="text-primary-foreground hover:text-white transition-colors font-bold text-sm lg:text-base">Grand ménage</Link></li>
                <li><Link href="/services/particulier/menage-airbnb" className="text-primary-foreground hover:text-white transition-colors font-bold text-sm lg:text-base">Ménage Airbnb</Link></li>
                <li><Link href="/services/particulier/menage-demenagement" className="text-primary-foreground hover:text-white transition-colors font-bold text-sm lg:text-base">Ménage post déménagement</Link></li>
                <li><Link href="/services/particulier/menage-fin-chantier" className="text-primary-foreground hover:text-white transition-colors font-bold text-sm lg:text-base">Nettoyage Fin de chantier</Link></li>
                <li><Link href="/services/particulier/nettoyage-urgence" className="text-primary-foreground hover:text-white transition-colors font-bold text-sm lg:text-base">Nettoyage d'urgence</Link></li>
                <li><Link href="/services/particulier/garde-malade" className="text-primary-foreground hover:text-white transition-colors font-bold text-sm lg:text-base">Auxiliaire de vie / garde malade</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <Link href="/entreprise#services-entreprises" className="block font-black text-xl mb-6 border-b-2 border-primary-foreground/20 pb-2 hover:text-white transition-colors">Services pour entreprises</Link>
              <ul className="space-y-3">
                <li><Link href="/services/entreprise/menage-bureaux" className="text-primary-foreground hover:text-white transition-colors font-bold text-sm lg:text-base">Ménages bureaux</Link></li>
                <li><Link href="/services/entreprise/placement" className="text-primary-foreground hover:text-white transition-colors font-bold text-sm lg:text-base">Placement & gestion de propriété</Link></li>
                <li><Link href="/services/entreprise/menage-fin-chantier" className="text-primary-foreground hover:text-white transition-colors font-bold text-sm lg:text-base">Nettoyage Fin de chantier</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-black text-xl mb-6 border-b-2 border-primary-foreground/20 pb-2">CONTACTEZ-NOUS</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground font-bold text-sm lg:text-base">
                <Phone className="w-5 h-5 mt-1 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+212664226790" className="hover:text-white transition-colors">06 64 22 67 90</a>
                  <a href="tel:+212664331463" className="hover:text-white transition-colors">06 64 33 14 63</a>
                  <a href="tel:+212522200177" className="hover:text-white transition-colors opacity-90">05 22 20 01 77 (Fixe)</a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground font-bold text-sm lg:text-base">
                <Mail className="w-5 h-5 shrink-0" />
                <a href="mailto:contact@agencemenage.ma" className="hover:text-white transition-colors break-all">contact@agencemenage.ma</a>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground font-bold text-sm lg:text-base">
                <MapPin className="w-5 h-5 mt-1 shrink-0" />
                <span>36 boulevard d’anfa, résidence Anafe A, etage 7, Casablanca</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-primary-foreground/70 font-bold text-sm text-center md:text-left">
              © 2026 Agence premium services. Tous droits réservés.
            </p>

            <div className="flex items-center gap-6">
              <span className="text-primary-foreground font-bold">Suivez-nous</span>
              <div className="flex items-center gap-4">
                <a href="https://www.facebook.com/profile.php?id=61586972460164" target="_blank" rel="noopener noreferrer" className="bg-primary-foreground/10 p-2.5 rounded-full hover:bg-primary-foreground/20 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/agencemenage?igsh=MXBtNmxzNmNwcmdiYg==&utm_source=ig_contact_invite" target="_blank" rel="noopener noreferrer" className="bg-primary-foreground/10 p-2.5 rounded-full hover:bg-primary-foreground/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="bg-primary-foreground/10 p-2.5 rounded-full hover:bg-primary-foreground/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;
