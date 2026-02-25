"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logoPlaceholder from "@/assets/LOGO-AGENCE-MENAGE.png";
import { Menu, X, Phone } from "lucide-react";



const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isParticulier = pathname === "/" || pathname.startsWith("/services/particulier");
  const isEntreprise = pathname === "/entreprise" || pathname.startsWith("/services/entreprise");

  const navItems = [
    { label: "Accueil", href: "/" },
    { label: "Services pour particuliers", href: "/", active: isParticulier },
    { label: "Services pour entreprises", href: "/entreprise", active: isEntreprise },
    { label: "Espace employé", href: "/espace-employe", active: pathname === "/espace-employe" },
    { label: "Contactez-nous", href: "/contact", active: pathname === "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 w-full shadow-sm border-b transition-all duration-[2000ms] ${isEntreprise ? "bg-primary border-primary/20" : "bg-background"
      }`}>
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image
            src={logoPlaceholder}
            alt="Agence Ménage"
            className={`h-16 w-auto transition-all duration-[2000ms] ${isEntreprise ? "brightness-0 invert" : ""}`}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center flex-1 justify-center gap-[2vw] px-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-base font-bold transition-all duration-[2000ms] whitespace-nowrap ${isEntreprise
                ? `hover:text-white/80 ${item.active ? "text-white border-b-2 border-white pb-1" : "text-white/90"}`
                : `hover:text-primary ${item.active ? "text-primary border-b-2 border-primary pb-1" : "text-foreground"}`
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu and Phone number group */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Contact Info (Desktop & Mobile next to hamburger) */}
          <div className={`
            flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border-2 transition-all duration-300 whitespace-nowrap group
            ${isEntreprise
              ? "border-white/30 text-white hover:bg-white/5"
              : "border-primary/30 text-primary hover:bg-primary/5 hover:border-primary hover:shadow-sm"}
          `}>
            <a
              href="tel:+212664226790"
              id="am_phone_header"
              className="am-phone-header flex items-center"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  (window as any).dataLayer = (window as any).dataLayer || [];
                  (window as any).dataLayer.push({
                    event: 'phone_click',
                    phone_location: 'header',
                    phone_number: '0664226790'
                  });
                }
              }}
            >
              <div className="w-0 group-hover:w-6 group-active:w-6 transition-all duration-300 overflow-hidden flex items-center shrink-0">
                <Phone className={`w-4 h-4 mr-2 ${isEntreprise ? "text-white" : "text-primary"}`} />
              </div>
              <span className={`text-xs sm:text-sm md:text-base xl:text-lg font-black tracking-tighter transition-all duration-300 ${isEntreprise ? "text-white" : "text-primary"}`}>
                06 64 22 67 90
              </span>
            </a>
          </div>

          {/* Mobile Menu Button - Visible on non-desktop */}
          <button
            className={`xl:hidden p-2 transition-all duration-300 ${isEntreprise ? "text-white hover:text-white/80" : "text-foreground hover:text-primary"}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Visible on non-desktop */}
      {isMobileMenuOpen && (
        <div className={`xl:hidden absolute top-16 left-0 w-full border-b shadow-lg animate-in slide-in-from-top-5 z-50 ${isEntreprise ? "bg-primary border-white/10" : "bg-background"
          }`}>
          <nav className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-base font-medium transition-colors p-2 rounded-md ${isEntreprise
                  ? `hover:bg-white/10 ${item.active ? "text-white bg-white/20" : "text-white/90"}`
                  : `hover:text-primary hover:bg-accent ${item.active ? "text-primary bg-accent/50" : "text-foreground"}`
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
