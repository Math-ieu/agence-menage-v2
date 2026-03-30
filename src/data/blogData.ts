export interface BlogPostService {
  name: string;
  url: string;
  ctaLabel: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: "particulier" | "entreprise";
  excerpt: string;
  date: string;
  readTime: string;
  imageUrl: string;
  bannerColor: string;
  tags: string[];
  fullContent: string;
  gallery: string[];
  services: BlogPostService[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "comment-bien-entretenir-son-interieur-au-quotidien",
    title: "Comment bien entretenir son intérieur au quotidien : 5 astuces simples",
    category: "particulier",
    excerpt: "Découvrez des méthodes efficaces pour garder votre maison propre sans y passer des heures chaque jour.",
    date: "24 Mars 2026",
    readTime: "5 min",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80",
    bannerColor: "#0D9488",
    tags: ["Ménage", "Astuces", "Quotidien"],
    fullContent: `**Garder une maison propre et ordonnée peut parfois ressembler à un défi insurmontable**, surtout avec un emploi du temps bien rempli. Pourtant, quelques habitudes simples peuvent faire toute la différence. Voici 5 astuces pour entretenir votre intérieur au quotidien sans stress.

1. **La règle des "Deux minutes"**
Si une tâche prend moins de deux minutes à accomplir, faites-la immédiatement. Remplir le lave-vaisselle, essuyer le comptoir, ou ranger le courrier. Ces petites actions évitent l'accumulation.

2. **Un coup d'éponge après chaque utilisation**
Que ce soit dans la salle de bain ou la cuisine, passer un coup d'éponge rapide après avoir utilisé la douche ou cuisiné permet de prévenir l'incrustation des taches.

**L'importance d'adopter des produits adaptés**
Utilisez des produits multi-usages écologiques. Non seulement ils sont meilleurs pour votre santé et l'environnement, mais ils simplifient également votre routine de nettoyage.

- Vinaigre blanc pour le calcaire
- Bicarbonate de soude pour dégraisser et désodoriser
- Savon noir pour les sols

3. **Ne jamais quitter une pièce les mains vides**
En allant d'une pièce à l'autre, prenez l'habitude d'emporter avec vous ce qui n'a rien à faire là : un verre vide, un magazine, un vêtement.

4. **Impliquer toute la famille**
Le nettoyage n'est pas le fardeau d'une seule personne. Établissez de petites routines pour chaque membre de la famille. Les enfants peuvent ranger leurs jouets ou mettre la table.

✅ Moins de stress au quotidien
✅ Plus de temps libre pour vos loisirs
✅ Un environnement sain pour votre famille

5. **Aérer 10 minutes par jour**
Renouvelez l'air de votre maison tous les jours, été comme hiver. Cela élimine l'humidité et les polluants intérieurs, laissant une sensation de fraîcheur.`,
    gallery: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80"
    ],
    services: [
      {
        name: "Ménage standard",
        url: "/services/particulier/menage-standard",
        ctaLabel: "Réserver un ménage"
      },
      {
        name: "Grand Ménage",
        url: "/services/particulier/grand-menage",
        ctaLabel: "Demander un devis"
      }
    ]
  },
  {
    id: "2",
    slug: "l-importance-d-un-bureau-propre",
    title: "L'importance d'un bureau propre pour la productivité et le bien-être",
    category: "entreprise",
    excerpt: "Comment un environnement de travail soigné peut booster la motivation de vos équipes et renvoyer une image professionnelle.",
    date: "20 Février 2026",
    readTime: "7 min",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
    bannerColor: "#2563EB",
    tags: ["Entreprise", "Productivité", "Hygiène"],
    fullContent: `**Un environnement de travail ordonné et éclatant de propreté** n'est pas qu'une question d'esthétique. C'est un élément clé de la stratégie d'entreprise qui impacte directement la santé, la motivation et l'image de marque.

**Impact sur la santé des employés**
Les bureaux, claviers et poignées de porte sont de véritables nids à bactéries. Un nettoyage quotidien et une désinfection régulière réduisent considérablement la propagation des virus, ce qui diminue le taux d'absentéisme.

- Diminution des maladies saisonnières
- Qualité de l'air améliorée (moins d'allergènes et de poussières)
- Confort olfactif

**Un atout pour la productivité**
Travailler dans un espace dégagé permet à l'esprit de se concentrer. Le désordre visuel entraîne souvent une fatigue mentale.

1. Moins de distractions : Un bureau net incite à la rigueur.
2. Gain de temps : Ne plus chercher ses affaires sous des piles de dossiers.
3. Motivation accrue : Les collaborateurs se sentent respectés et valorisés par leur direction lorsque les locaux sont bien entretenus.

✅ Image professionnelle irréprochable auprès de vos clients
✅ Cadre de travail sains et stimulant
✅ Fidélisation des talents

L'externalisation de ces tâches auprès d'un prestataire professionnel garantit un résultat optimal sans mobiliser vos ressources internes. Nos interventions en dehors des heures de bureau assurent une discrétion totale.`,
    gallery: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?auto=format&fit=crop&q=80"
    ],
    services: [
      {
        name: "Ménage bureaux",
        url: "/services/entreprise/menage-bureaux",
        ctaLabel: "Planifier un rendez-vous"
      },
      {
        name: "Placement et Gestion",
        url: "/services/entreprise/placement",
        ctaLabel: "Découvrir la gestion RH"
      }
    ]
  }
];

export const getPostsByCategory = (category: "particulier" | "entreprise") => {
  return blogPosts.filter((post) => post.category === category);
};

export const getPostBySlug = (slug: string) => {
  return blogPosts.find((post) => post.slug === slug);
};
