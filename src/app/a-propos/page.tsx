import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Users, Target, BarChart3, Globe } from "lucide-react";
import Header from "@/components/Header";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/Footer"));

export const metadata: Metadata = {
  title: "À propos d'Agence Ménage | Notre Histoire et Nos Fondateurs",
  description: "Découvrez l'histoire d'Agence Ménage, notre mission et l'expertise de nos fondateurs Mehdi HARIT et Julien CONTAN. Le nettoyage professionnel accessible à tous au Maroc.",
  alternates: {
    canonical: "/a-propos",
    languages: {
      "fr-MA": "/a-propos",
      "x-default": "/a-propos",
    },
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Agence Ménage",
    "url": "https://www.agencemenage.ma",
    "foundingDate": "2025",
    "founder": [
      {
        "@type": "Person",
        "name": "Mehdi HARIT",
        "jobTitle": "Co-fondateur",
        "sameAs": "https://www.agencepremium.ma"
      },
      {
        "@type": "Person",
        "name": "Julien CONTAN",
        "jobTitle": "Co-fondateur"
      }
    ],
    "areaServed": "Casablanca",
    "numberOfEmployees": "10"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero Section */}
        <section className="bg-primary py-20 text-white">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              À propos d&apos;Agence Ménage
            </h1>
            <div className="w-24 h-1.5 bg-secondary mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium opacity-90">
              Le nettoyage professionnel de qualité accessible à tous au Maroc.
            </p>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <p className="text-lg md:text-xl leading-relaxed text-slate-700">
                Agence Ménage est née d&apos;une conviction simple : le nettoyage professionnel de qualité doit être accessible à tous les Marocains, particuliers comme entreprises. Fondée en 2025 à Casablanca, nous cumulons déjà une vingtaine d&apos;interventions par semaine après seulement 3 mois d&apos;activité effective.
              </p>
            </div>
          </div>
        </section>

        {/* Fondateurs Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-4 mb-16 justify-center">
              <Users className="w-10 h-10 text-primary" />
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight text-center">
                Nos Fondateurs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Mehdi HARIT */}
              <div className="group bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black">MH</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Mehdi HARIT</h3>
                <p className="text-primary font-bold mb-6 text-lg">Co-fondateur</p>
                <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                  <p>
                    Fort de 20 ans d&apos;expérience dans le recrutement et l&apos;hôtellerie au Maroc, Mehdi HARIT est également fondateur d&apos;
                    <Link href="https://www.agencepremium.ma" target="_blank" className="text-primary underline font-bold">agencepremium.ma</Link>, 
                    l&apos;agence de recrutement de personnel de maison de référence au Maroc, et de 
                    <Link href="https://www.nounou.ma" target="_blank" className="text-primary underline font-bold"> nounou.ma</Link>, 
                    la première plateforme de mise en relation entre nounous et parents au Maroc.
                  </p>
                  <p>
                    C&apos;est naturellement qu&apos;il a élargi cet écosystème en lançant Agence Ménage, avec la même exigence de qualité et de professionnalisme.
                  </p>
                </div>
              </div>

              {/* Julien CONTAN */}
              <div className="group bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black">JC</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Julien CONTAN</h3>
                <p className="text-primary font-bold mb-6 text-lg">Co-fondateur</p>
                <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                  <p>
                    Julien CONTAN apporte plus de 20 ans d&apos;expérience internationale dans la gestion d&apos;entreprises de nettoyage professionnel, acquise en Suisse et aux États-Unis. Il a opéré dans des secteurs exigeants : entreprises, régies immobilières, hôtels, hôpitaux.
                  </p>
                  <p>
                    De retour au Maroc avec sa famille, he met son expertise au service d&apos;Agence Ménage pour imposer les standards internationaux du nettoyage professionnel sur le marché marocain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-white/20">
              <Target className="w-5 h-5 text-secondary" />
              <span className="text-sm font-bold uppercase tracking-widest">Notre Mission</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
              Offrir un service de nettoyage professionnel fiable, transparent et accessible.
            </h2>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed font-medium mb-12">
              Avec des intervenantes formées et certifiées, disponibles 7j/7 dans le Grand Casablanca.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-4 mb-16 justify-center">
              <BarChart3 className="w-10 h-10 text-primary" />
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight text-center">
                Agence Ménage en Chiffres
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl font-black text-primary mb-4 tracking-tighter">2025</div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Fondée en</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl font-black text-primary mb-4 tracking-tighter">40 ans</div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Expérience cumulée</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl font-black text-primary mb-4 tracking-tighter">10+</div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Employés formés</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl font-black text-primary mb-4 tracking-tighter">20+</div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Interventions / semaine</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl font-black text-primary mb-4 tracking-tighter">6+</div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Types de prestations</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl font-black text-primary mb-4 tracking-tighter">3</div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Villes (Bientôt)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex items-center gap-4 mb-16 justify-center">
              <Globe className="w-10 h-10 text-primary" />
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight text-center">
                Notre Écosystème
              </h2>
            </div>
            
            <p className="text-xl text-slate-600 text-center mb-16 font-medium leading-relaxed">
              Agence Ménage fait partie d&apos;un écosystème unique au Maroc dédié aux services à domicile :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="https://www.agencepremium.ma" target="_blank" className="group p-8 rounded-3xl border border-slate-100 bg-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl">
                <h4 className="text-xl font-black mb-4 text-slate-900 group-hover:text-white transition-colors">agencepremium.ma</h4>
                <p className="text-slate-500 group-hover:text-white/80 transition-colors font-medium">Recrutement de personnel de maison de prestige.</p>
              </Link>
              <Link href="https://www.nounou.ma" target="_blank" className="group p-8 rounded-3xl border border-slate-100 bg-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl">
                <h4 className="text-xl font-black mb-4 text-slate-900 group-hover:text-white transition-colors">nounou.ma</h4>
                <p className="text-slate-500 group-hover:text-white/80 transition-colors font-medium">Mise en relation entre nounous et parents.</p>
              </Link>
              <div className="p-8 rounded-3xl border-2 border-primary bg-primary/5 shadow-sm">
                <h4 className="text-xl font-black mb-4 text-primary">agencemenage.ma</h4>
                <p className="text-slate-600 font-medium">Nettoyage et entretien professionnel.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="pb-24 pt-12">
          <div className="container mx-auto px-6 text-center">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center bg-primary text-white font-black px-12 py-5 rounded-2xl text-xl hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              Réserver votre prestation
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
