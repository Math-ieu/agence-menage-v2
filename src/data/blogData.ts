// Images importées localement pour le blog
import salonPropre from "@/assets/blog/salon-propre.jpg";
import produitsNettoyage from "@/assets/blog/produits-nettoyage.jpg";
import familleHeureuse from "@/assets/blog/famille-heureuse.jpg";
import salleDeBain from "@/assets/blog/salle-de-bain.jpg";
import cuisinePropre from "@/assets/blog/cuisine-propre.jpg";
import equipeCasablanca from "@/assets/blog/equipe-casablanca.jpg";
import avantApres from "@/assets/blog/avant-apres.jpg";
import suiviQualite from "@/assets/blog/suivi-qualite.jpg";
import vacancesMaison from "@/assets/blog/vacances-maison.jpg";
import menageEcologique from "@/assets/blog/menage-ecologique.jpg";
import familleRangement from "@/assets/blog/famille-rangement.jpg";
import bureauxNettoyage from "@/assets/blog/bureaux-nettoyage.jpg";
import formationPersonnel from "@/assets/blog/formation-personnel.jpg";
import sanitairesEntreprise from "@/assets/blog/sanitaires-entreprise.jpg";

import { StaticImageData } from "next/image";

export interface BlogPostService {
  name: string;
  url: string;
  ctaLabel: string;
}

export interface GalleryImage {
  src: string | StaticImageData;
  alt: string;
  caption: string;
}

export type BlogCategory = "particulier" | "entreprise";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  excerpt: string;
  tags: string[];
  bannerColor: string;
  imageUrl: string | StaticImageData;
  fullContent: string;
  gallery: GalleryImage[];
  services: BlogPostService[];
}

export const blogPosts: BlogPost[] = [
  // ── PARTICULIERS ──
  {
    id: "1",
    slug: "manquez-de-temps-pour-le-menage",
    title: "Vous manquez de temps pour le ménage ? Voici la solution",
    description: "Découvrez comment gagner du temps au quotidien en déléguant votre ménage à des experts.",
    category: "particulier",
    excerpt: "Découvrez comment gagner du temps au quotidien en déléguant votre ménage à des experts.",
    tags: ["Conseils", "Ménage", "Astuces"],
    bannerColor: "#93C5FD",
    imageUrl: salonPropre,
    fullContent: `Entre le travail, les enfants et les courses, il est difficile de trouver du temps pour le ménage. Faire appel à un service professionnel vous permet de libérer plusieurs heures par semaine, que vous pouvez consacrer à ce qui compte vraiment.

Nos équipes s'occupent de tout : nettoyage des sols, cuisine, salles de bain, et bien plus encore. Chaque intervention est réalisée par du personnel formé, utilisant des produits professionnels adaptés à chaque surface.

**Les avantages d'un ménage régulier par des professionnels :**
- Un intérieur toujours propre sans effort
- Plus de temps pour votre famille et vos loisirs
- Des produits et techniques professionnels pour un résultat impeccable
- Un planning flexible adapté à votre emploi du temps

Ne laissez plus le ménage envahir votre quotidien. Faites confiance à Agence Ménage pour un intérieur qui brille, sans stress.`,
    gallery: [
      { src: salonPropre, alt: "Salon propre et rangé", caption: "Un intérieur toujours impeccable grâce à nos équipes" },
      { src: produitsNettoyage, alt: "Produits de nettoyage professionnels", caption: "Des produits adaptés à chaque surface" },
      { src: familleHeureuse, alt: "Famille heureuse dans un intérieur propre", caption: "Plus de temps pour ce qui compte vraiment" },
    ],
    services: [
      { name: "Ménage Standard", url: "/services/particulier/menage-standard", ctaLabel: "Réserver mon ménage" },
    ],
  },
  {
    id: "2",
    slug: "fatigue-menage-apres-travail",
    title: "Fatigué de faire le ménage après le travail ?",
    description: "Rentrez chez vous dans une maison propre sans lever le petit doigt.",
    category: "particulier",
    excerpt: "Rentrez chez vous dans une maison propre sans lever le petit doigt.",
    tags: ["Bien-être", "Ménage"],
    bannerColor: "#FDBA74",
    imageUrl: cuisinePropre,
    fullContent: `Après une longue journée de travail, la dernière chose dont vous avez envie est de passer l'aspirateur ou de récurer la salle de bain. Imaginez rentrer dans un intérieur parfaitement propre et rangé, prêt à vous accueillir.

C'est exactement ce que nous vous proposons avec nos formules de ménage régulier. Nos équipes interviennent pendant votre absence pour que vous retrouviez un foyer impeccable en rentrant du travail.

**Comment ça marche ?**
1. Vous choisissez la fréquence (hebdomadaire, bi-mensuel, mensuel)
2. Nous assignons une équipe dédiée à votre domicile
3. L'intervention se fait pendant vos heures de travail
4. Vous rentrez dans une maison parfaitement propre

**Ce qui est inclus dans nos formules :**
- Nettoyage complet des sols (aspiration + lavage)
- Nettoyage des sanitaires et salles de bain
- Cuisine : plan de travail, évier, électroménager
- Dépoussiérage des meubles et surfaces
- Rangement général des pièces

Offrez-vous le luxe d'un intérieur toujours impeccable, sans effort.`,
    gallery: [
      { src: cuisinePropre, alt: "Maison propre en rentrant du travail", caption: "Rentrez dans un intérieur impeccable" },
      { src: salonPropre, alt: "Équipe de nettoyage en action", caption: "Nos équipes interviennent pendant votre absence" },
    ],
    services: [
      { name: "Ménage Standard", url: "/services/particulier/menage-standard", ctaLabel: "Réserver mon ménage" },
    ],
  },
  {
    id: "3",
    slug: "maison-jamais-vraiment-propre",
    title: "Pourquoi votre maison n'est jamais vraiment propre",
    description: "Les erreurs courantes qui empêchent votre intérieur de rester impeccable.",
    category: "particulier",
    excerpt: "Les erreurs courantes qui empêchent votre intérieur de rester impeccable.",
    tags: ["Astuces", "Propreté"],
    bannerColor: "#C4B5FD",
    imageUrl: produitsNettoyage,
    fullContent: `Beaucoup de gens nettoient régulièrement mais commettent des erreurs qui réduisent l'efficacité du nettoyage. Voici les erreurs les plus courantes et comment les éviter.

**Erreur n°1 : Utiliser les mauvais produits**
Chaque surface nécessite un produit adapté. Utiliser un produit abrasif sur du marbre ou un détergent classique sur du bois peut abîmer vos surfaces et laisser des traces.

**Erreur n°2 : Nettoyer dans le mauvais ordre**
Il faut toujours commencer par le haut (dépoussiérage, étagères) et finir par le bas (sols). Sinon, la poussière retombe sur les surfaces déjà nettoyées.

**Erreur n°3 : Oublier les zones cachées**
Derrière les meubles, sous les lits, les plinthes, les interrupteurs… Ces zones accumulent la poussière et les bactéries si elles ne sont pas nettoyées régulièrement.

**Erreur n°4 : Ne pas aérer suffisamment**
Un bon nettoyage commence par une bonne aération. Ouvrez les fenêtres pendant au moins 15 minutes pour renouveler l'air.

**La solution ?** Faire appel à des professionnels qui connaissent les techniques et les produits adaptés à chaque surface pour un résultat impeccable et durable.`,
    gallery: [
      { src: produitsNettoyage, alt: "Nettoyage professionnel des surfaces", caption: "Chaque surface nécessite un traitement adapté" },
      { src: avantApres, alt: "Zones cachées à ne pas oublier", caption: "Les zones oubliées accumulent poussière et bactéries" },
      { src: salleDeBain, alt: "Aération d'une pièce", caption: "Aérer au moins 15 minutes avant chaque nettoyage" },
    ],
    services: [
      { name: "Grand Ménage", url: "/services/particulier/grand-menage", ctaLabel: "Demander un Grand Ménage" },
    ],
  },
  {
    id: "4",
    slug: "agence-menage-casablanca",
    title: "Pourquoi faire appel à une agence de ménage à Casablanca ?",
    description: "Les avantages d'un service professionnel de nettoyage dans votre ville.",
    category: "particulier",
    excerpt: "Les avantages d'un service professionnel de nettoyage dans votre ville.",
    tags: ["Casablanca", "Professionnel"],
    bannerColor: "#6EE7B7",
    imageUrl: equipeCasablanca,
    fullContent: `À Casablanca, le rythme de vie est intense. Entre les embouteillages, le travail et la vie de famille, le ménage passe souvent au second plan. C'est là qu'une agence de ménage professionnelle fait toute la différence.

**Les avantages d'une agence locale à Casablanca :**

**1. Proximité et réactivité**
Basée au cœur de Casablanca, sur le Boulevard d'Anfa, Agence Ménage intervient rapidement sur l'ensemble du Grand Casablanca. Besoin d'une intervention urgente ? Nous sommes disponibles 7j/7.

**2. Personnel formé et assuré**
Contrairement aux prestataires indépendants, notre personnel est rigoureusement sélectionné, formé à nos standards et couvert par une assurance professionnelle.

**3. Suivi qualité**
Chaque intervention fait l'objet d'un suivi qualité. Nous nous assurons que le résultat est toujours à la hauteur de vos attentes.

**4. Flexibilité totale**
Nous nous adaptons à vos horaires et à vos besoins spécifiques. Intervention ponctuelle ou contrat régulier, c'est vous qui choisissez.

**5. Tranquillité d'esprit**
Fini les mauvaises surprises. Avec une agence, vous avez un interlocuteur unique et un service garanti.`,
    gallery: [
      { src: equipeCasablanca, alt: "Équipe Agence Ménage Casablanca", caption: "Notre équipe basée au cœur de Casablanca" },
      { src: salonPropre, alt: "Intervention de nettoyage professionnel", caption: "Personnel formé et assuré pour chaque intervention" },
      { src: suiviQualite, alt: "Suivi qualité après nettoyage", caption: "Un suivi qualité rigoureux à chaque prestation" },
    ],
    services: [
      { name: "Ménage Standard", url: "/services/particulier/menage-standard", ctaLabel: "Réserver mon ménage" },
      { name: "Grand Ménage", url: "/services/particulier/grand-menage", ctaLabel: "Demander un Grand Ménage" },
      { name: "Ménage Airbnb", url: "/services/particulier/menage-airbnb", ctaLabel: "Ménage Airbnb" },
    ],
  },
  {
    id: "5",
    slug: "femme-menage-independante-ou-agence",
    title: "Femme de ménage indépendante ou agence : que choisir ?",
    description: "Comparatif complet pour vous aider à faire le bon choix.",
    category: "particulier",
    excerpt: "Comparatif complet pour vous aider à faire le bon choix.",
    tags: ["Comparatif", "Conseils"],
    bannerColor: "#FCA5A5",
    imageUrl: avantApres,
    fullContent: `Le choix entre une femme de ménage indépendante et une agence professionnelle est une question que beaucoup se posent. Voici un comparatif objectif pour vous aider.

**Femme de ménage indépendante**
✅ Tarif généralement plus bas
✅ Relation directe et personnelle
❌ Pas de remplacement en cas d'absence ou maladie
❌ Pas d'assurance professionnelle
❌ Pas de garantie sur la qualité
❌ Gestion administrative à votre charge

**Agence de ménage professionnelle**
✅ Remplacement garanti en cas d'absence
✅ Personnel formé et assuré
✅ Suivi qualité régulier
✅ Interlocuteur unique pour toutes vos demandes
✅ Facturation simple et transparente
❌ Tarif légèrement plus élevé

**Notre recommandation :**
Si vous cherchez la tranquillité d'esprit et un service fiable sur le long terme, une agence est le meilleur choix. Le léger surcoût est largement compensé par les garanties offertes : remplacement, assurance, et qualité constante.

Chez Agence Ménage, nous combinons le meilleur des deux mondes : un service personnalisé avec toutes les garanties d'une agence professionnelle.`,
    gallery: [
      { src: avantApres, alt: "Comparaison des services", caption: "Comparer pour mieux choisir" },
      { src: equipeCasablanca, alt: "Équipe professionnelle de ménage", caption: "Une équipe formée et assurée à votre service" },
    ],
    services: [
      { name: "Ménage Standard", url: "/services/particulier/menage-standard", ctaLabel: "Réserver mon ménage" },
    ],
  },
  {
    id: "6",
    slug: "5-raisons-confier-menage-professionnels",
    title: "5 raisons de confier votre ménage à des professionnels",
    description: "Qualité, fiabilité, gain de temps… Découvrez tous les avantages.",
    category: "particulier",
    excerpt: "Qualité, fiabilité, gain de temps… Découvrez tous les avantages.",
    tags: ["Professionnel", "Ménage", "Astuces"],
    bannerColor: "#FDE68A",
    imageUrl: familleHeureuse,
    fullContent: `Vous hésitez encore à faire appel à des professionnels pour votre ménage ? Voici 5 bonnes raisons de franchir le pas.

**1. Un gain de temps considérable**
Le ménage prend en moyenne 4 à 6 heures par semaine. En déléguant cette tâche, vous récupérez ce temps précieux pour votre famille, vos loisirs ou simplement pour vous reposer.

**2. Un nettoyage en profondeur**
Nos professionnels utilisent des produits et des équipements de qualité professionnelle. Le résultat est incomparable avec un nettoyage amateur : surfaces plus brillantes, sanitaires désinfectés, sols impeccables.

**3. Régularité et fiabilité**
Avec un contrat régulier, votre intérieur est toujours propre. Plus besoin de planifier ou de reporter le ménage. Notre équipe intervient selon le planning convenu, même pendant vos absences.

**4. Personnel formé et assuré**
Nos employés sont formés aux techniques de nettoyage professionnel et couverts par une assurance. En cas de problème, nous prenons tout en charge.

**5. Flexibilité totale**
Nous nous adaptons à vos besoins : fréquence d'intervention, horaires, prestations spécifiques. Vous êtes libre de modifier votre formule à tout moment.

N'attendez plus pour profiter d'un intérieur impeccable sans effort !`,
    gallery: [
      { src: familleHeureuse, alt: "Gain de temps avec le ménage professionnel", caption: "Récupérez 4 à 6 heures par semaine" },
      { src: salleDeBain, alt: "Nettoyage en profondeur", caption: "Des résultats incomparables avec un nettoyage amateur" },
      { src: equipeCasablanca, alt: "Équipe flexible", caption: "Un service qui s'adapte à votre emploi du temps" },
    ],
    services: [
      { name: "Ménage Standard", url: "/services/particulier/menage-standard", ctaLabel: "Réserver mon ménage" },
      { name: "Grand Ménage", url: "/services/particulier/grand-menage", ctaLabel: "Demander un Grand Ménage" },
    ],
  },
  {
    id: "7",
    slug: "preparer-maison-avant-vacances",
    title: "Comment préparer votre maison avant de partir en vacances ?",
    description: "Checklist et conseils pour retrouver un intérieur impeccable à votre retour.",
    category: "particulier",
    excerpt: "Checklist et conseils pour retrouver un intérieur impeccable à votre retour.",
    tags: ["Conseils", "Organisation"],
    bannerColor: "#A5F3FC",
    imageUrl: vacancesMaison,
    fullContent: `Partir en vacances l'esprit tranquille, c'est aussi s'assurer que votre maison sera propre et en ordre à votre retour.

**Checklist avant le départ :**
- Vider et nettoyer le réfrigérateur
- Sortir les poubelles et nettoyer les bacs
- Laver les draps et faire les lits
- Nettoyer la cuisine en profondeur
- Passer l'aspirateur et laver les sols
- Fermer les fenêtres et baisser les volets

**Pourquoi faire appel à un professionnel ?**
Un grand ménage avant les vacances vous libère de cette corvée et vous garantit de retrouver un intérieur frais et accueillant. Nos équipes peuvent aussi intervenir la veille de votre retour pour que tout soit parfait.`,
    gallery: [
      { src: vacancesMaison, alt: "Maison prête pour les vacances", caption: "Partez l'esprit tranquille" },
      { src: cuisinePropre, alt: "Checklist ménage vacances", caption: "Une checklist pour ne rien oublier" },
    ],
    services: [
      { name: "Grand Ménage", url: "/services/particulier/grand-menage", ctaLabel: "Demander un Grand Ménage" },
    ],
  },
  {
    id: "8",
    slug: "menage-ecologique-maison",
    title: "Le ménage écologique : comment nettoyer sans polluer ?",
    description: "Produits naturels, gestes éco-responsables et astuces pour un ménage vert.",
    category: "particulier",
    excerpt: "Produits naturels, gestes éco-responsables et astuces pour un ménage vert.",
    tags: ["Écologie", "Astuces", "Ménage"],
    bannerColor: "#86EFAC",
    imageUrl: menageEcologique,
    fullContent: `De plus en plus de familles souhaitent réduire leur impact environnemental, y compris dans leur routine de ménage. Bonne nouvelle : il est tout à fait possible de nettoyer efficacement avec des produits naturels.

**Les indispensables du ménage écologique :**
- **Vinaigre blanc** : détartrant, désinfectant, dégraissant
- **Bicarbonate de soude** : désodorisant, abrasif doux, blanchissant
- **Savon noir** : nettoyant multi-surfaces puissant
- **Huiles essentielles** : parfumer naturellement et désinfecter

**Nos astuces :**
1. Remplacez vos lingettes jetables par des chiffons microfibres lavables
2. Fabriquez votre spray nettoyant maison (eau + vinaigre + quelques gouttes de citron)
3. Aérez quotidiennement pour purifier l'air naturellement

Chez Agence Ménage, nous proposons des prestations avec des produits éco-responsables sur demande.`,
    gallery: [
      { src: menageEcologique, alt: "Produits ménagers écologiques", caption: "Des alternatives naturelles et efficaces" },
      { src: salonPropre, alt: "Nettoyage écologique", caption: "Un intérieur propre et respectueux de l'environnement" },
    ],
    services: [
      { name: "Ménage Standard", url: "/services/particulier/menage-standard", ctaLabel: "Réserver mon ménage" },
    ],
  },
  {
    id: "9",
    slug: "organiser-menage-famille-nombreuse",
    title: "Comment organiser le ménage dans une famille nombreuse ?",
    description: "Planning, répartition des tâches et solutions pour garder la maison propre avec des enfants.",
    category: "particulier",
    excerpt: "Planning, répartition des tâches et solutions pour garder la maison propre avec des enfants.",
    tags: ["Famille", "Organisation", "Conseils"],
    bannerColor: "#FCA5D0",
    imageUrl: familleRangement,
    fullContent: `Gérer le ménage dans une famille nombreuse est un véritable défi quotidien. Entre les jouets éparpillés, les repas à préparer et les activités des enfants, maintenir la maison propre semble impossible.

**Nos conseils pour un intérieur ordonné :**

**1. Établir un planning hebdomadaire**
Attribuez une tâche par jour : lundi = sols, mardi = salles de bain, mercredi = cuisine, etc. Cela évite l'accumulation.

**2. Impliquer toute la famille**
Même les plus jeunes peuvent participer : ranger les jouets, mettre le linge sale au panier, débarrasser la table.

**3. Désencombrer régulièrement**
Moins d'objets = moins de ménage. Faites un tri chaque saison pour donner ou jeter ce qui n'est plus utilisé.

**4. Déléguer le gros du travail**
Un passage professionnel hebdomadaire ou bi-mensuel vous soulage des tâches les plus lourdes : sols, sanitaires, cuisine en profondeur.

**5. Créer des zones de rangement**
Des bacs, paniers et étagères bien placés facilitent le rangement au quotidien.

Avec Agence Ménage, profitez d'un soutien régulier pour garder un intérieur agréable malgré le rythme intense de la vie de famille.`,
    gallery: [
      { src: familleRangement, alt: "Famille et ménage", caption: "Un intérieur ordonné malgré les enfants" },
      { src: familleHeureuse, alt: "Planning de ménage familial", caption: "Un planning adapté à votre famille" },
      { src: familleRangement, alt: "Rangement enfants", caption: "Des astuces pour impliquer toute la famille" },
    ],
    services: [
      { name: "Ménage Standard", url: "/services/particulier/menage-standard", ctaLabel: "Réserver mon ménage" },
      { name: "Grand Ménage", url: "/services/particulier/grand-menage", ctaLabel: "Demander un Grand Ménage" },
    ],
  },

  // ── ENTREPRISES ──
  {
    id: "10",
    slug: "externaliser-nettoyage-bureaux",
    title: "Pourquoi externaliser le nettoyage de vos bureaux ?",
    description: "Productivité, hygiène, image de marque : les bénéfices d'un service professionnel pour votre entreprise.",
    category: "entreprise",
    excerpt: "Productivité, hygiène, image de marque : les bénéfices d'un service professionnel pour votre entreprise.",
    tags: ["Entreprise", "Bureaux", "Productivité"],
    bannerColor: "#67E8F9",
    imageUrl: bureauxNettoyage,
    fullContent: `Un environnement de travail propre est bien plus qu'une question d'esthétique. C'est un levier de productivité, de bien-être et d'image de marque pour votre entreprise.

**Les bénéfices de l'externalisation du nettoyage :**

**1. Productivité accrue**
Des études montrent qu'un espace de travail propre et organisé augmente la concentration et la productivité des collaborateurs de 15 à 20%.

**2. Réduction de l'absentéisme**
Un nettoyage régulier et approfondi réduit la propagation des germes et des virus, diminuant ainsi les arrêts maladie.

**3. Image professionnelle**
Vos locaux sont la première impression que vous donnez à vos clients et partenaires. Des bureaux impeccables renforcent votre crédibilité.

**4. Conformité réglementaire**
Certaines normes d'hygiène sont obligatoires dans les espaces professionnels. Un prestataire qualifié garantit le respect de ces normes.

**5. Maîtrise des coûts**
L'externalisation permet de transformer un coût fixe (personnel interne) en coût variable, avec une meilleure maîtrise budgétaire.

Chez Agence Ménage, nous proposons des contrats sur mesure adaptés à la taille et aux besoins de votre entreprise.`,
    gallery: [
      { src: bureauxNettoyage, alt: "Bureaux professionnels propres", caption: "Un espace de travail impeccable pour vos équipes" },
      { src: bureauxNettoyage, alt: "Nettoyage de bureau en entreprise", caption: "Intervention professionnelle adaptée à vos horaires" },
      { src: suiviQualite, alt: "Open space moderne et propre", caption: "Des locaux qui reflètent votre professionnalisme" },
    ],
    services: [
      { name: "Nettoyage de bureaux", url: "/services/entreprise/menage-bureaux", ctaLabel: "Demander un devis" },
      { name: "Contrat d'entretien", url: "/services/entreprise", ctaLabel: "Contacter un conseiller" },
    ],
  },
  {
    id: "11",
    slug: "mise-a-disposition-personnel-nettoyage",
    title: "Mise à disposition de personnel de nettoyage : comment ça marche ?",
    description: "Découvrez notre service de mise à disposition de personnel qualifié pour vos locaux professionnels.",
    category: "entreprise",
    excerpt: "Découvrez notre service de mise à disposition de personnel qualifié pour vos locaux professionnels.",
    tags: ["Entreprise", "Personnel", "RH"],
    bannerColor: "#A5B4FC",
    imageUrl: formationPersonnel,
    fullContent: `La mise à disposition de personnel de nettoyage est une solution flexible et professionnelle pour les entreprises qui souhaitent un service sur mesure sans les contraintes administratives de l'embauche.

**Comment fonctionne la mise à disposition ?**

**1. Analyse de vos besoins**
Nous réalisons un audit de vos locaux pour déterminer la fréquence, le nombre d'agents et les prestations nécessaires.

**2. Sélection du personnel**
Nous recrutons et formons le personnel selon vos exigences spécifiques. Chaque agent est rigoureusement sélectionné et formé à nos standards de qualité.

**3. Gestion complète**
Nous prenons en charge toute la gestion administrative : contrats, paie, assurances, remplacement en cas d'absence.

**4. Suivi et contrôle qualité**
Un responsable dédié assure le suivi régulier de la prestation et reste votre interlocuteur unique.

**Les avantages pour votre entreprise :**
- Aucune charge administrative liée au personnel
- Remplacement garanti sous 24h
- Flexibilité totale (ajustement des effectifs selon vos besoins)
- Personnel formé et assuré
- Interlocuteur unique

Simplifiez la gestion de la propreté de vos locaux avec notre service de mise à disposition.`,
    gallery: [
      { src: formationPersonnel, alt: "Personnel de nettoyage en entreprise", caption: "Du personnel qualifié et dédié à vos locaux" },
      { src: formationPersonnel, alt: "Formation du personnel de nettoyage", caption: "Chaque agent est formé à vos exigences spécifiques" },
      { src: suiviQualite, alt: "Suivi qualité en entreprise", caption: "Un contrôle qualité régulier pour garantir l'excellence" },
    ],
    services: [
      { name: "Placement & Gestion", url: "/services/entreprise/placement", ctaLabel: "Demander un devis" },
    ],
  },
  {
    id: "12",
    slug: "hygiene-locaux-professionnels-normes",
    title: "Hygiène des locaux professionnels : les normes à respecter",
    description: "Guide complet des obligations d'hygiène pour les entreprises au Maroc.",
    category: "entreprise",
    excerpt: "Guide complet des obligations d'hygiène pour les entreprises au Maroc.",
    tags: ["Entreprise", "Normes", "Hygiène"],
    bannerColor: "#86EFAC",
    imageUrl: sanitairesEntreprise,
    fullContent: `L'hygiène des locaux professionnels n'est pas qu'une question de confort : c'est une obligation légale. Voici un guide des normes essentielles à respecter.

**Les obligations de l'employeur :**

**1. Entretien régulier des locaux**
Le Code du travail impose un nettoyage quotidien des locaux de travail. Les sols doivent être nettoyés et les surfaces dépoussiérées régulièrement.

**2. Sanitaires et vestiaires**
Les sanitaires doivent être nettoyés et désinfectés au minimum une fois par jour. L'eau chaude, le savon et les essuie-mains doivent être disponibles en permanence.

**3. Aération et qualité de l'air**
Les locaux doivent être correctement ventilés. Un renouvellement d'air suffisant est obligatoire pour garantir la santé des collaborateurs.

**4. Gestion des déchets**
Les poubelles doivent être vidées quotidiennement et les déchets triés selon la réglementation en vigueur.

**5. Espaces de restauration**
Si votre entreprise dispose d'un espace de restauration, des normes d'hygiène spécifiques s'appliquent (nettoyage après chaque service, désinfection des surfaces alimentaires).

**Comment Agence Ménage vous accompagne :**
- Audit gratuit de vos locaux
- Plan de nettoyage personnalisé
- Respect strict des normes d'hygiène
- Traçabilité des interventions
- Formation continue du personnel

Ne prenez aucun risque avec l'hygiène de vos locaux. Faites appel à des professionnels.`,
    gallery: [
      { src: sanitairesEntreprise, alt: "Normes d'hygiène en entreprise", caption: "Respecter les obligations légales d'hygiène" },
      { src: sanitairesEntreprise, alt: "Nettoyage des sanitaires professionnels", caption: "Sanitaires désinfectés quotidiennement" },
      { src: bureauxNettoyage, alt: "Espace de travail aux normes", caption: "Un environnement conforme pour vos collaborateurs" },
    ],
    services: [
      { name: "Nettoyage de bureaux", url: "/services/entreprise/menage-bureaux", ctaLabel: "Demander un devis" },
    ],
  },
  {
    id: "13",
    slug: "nettoyage-fin-chantier-entreprise",
    title: "Nettoyage fin de chantier : pourquoi confier cette étape à des experts ?",
    description: "Découvrez l'importance d'un nettoyage professionnel après les travaux pour vos locaux d'entreprise.",
    category: "entreprise",
    excerpt: "Découvrez l'importance d'un nettoyage professionnel après les travaux pour vos locaux d'entreprise.",
    tags: ["Entreprise", "Chantier", "Nettoyage"],
    bannerColor: "#FCD34D",
    imageUrl: bureauxNettoyage,
    fullContent: `La fin d'un chantier est une étape cruciale pour tout professionnel de l'immobilier ou chef d'entreprise. Un nettoyage fin de chantier de qualité est indispensable avant toute réception des locaux.

**Pourquoi un nettoyage de chantier est-il si important ?**

**1. Sécurité des occupants**
Les résidus de construction (poussières de plâtre, éclats de verre, clous) représentent un risque réel pour les futurs occupants. Un nettoyage professionnel élimine toutes ces menaces.

**2. Valorisation des espaces**
Des locaux impeccables font bonne impression lors des visites de réception. Cela reflète le soin apporté à chaque détail du projet.

**3. Délais maîtrisés**
Nos équipes sont formées pour intervenir rapidement et efficacement sur les chantiers, quelle que soit leur taille.

**Ce que comprend notre prestation fin de chantier :**
- Débarras et évacuation des déchets de construction
- Dépoussiérage de toutes les surfaces (murs, plafonds, fenêtres)
- Nettoyage des sols (carrelage, parquet, béton)
- Nettoyage des menuiseries et vitreries
- Désinfection complète des sanitaires

**Pour qui ?**
Promoteurs immobiliers, entreprises du BTP, gestionnaires de patrimoine, architectes… Notre service s'adapte à tous les types de chantiers.

Confiez votre nettoyage fin de chantier à Agence Ménage et réceptionnez des locaux impeccables dans les délais prévus.`,
    gallery: [
      { src: bureauxNettoyage, alt: "Nettoyage fin de chantier", caption: "Des locaux impeccables après les travaux" },
      { src: suiviQualite, alt: "Résultat nettoyage chantier", caption: "Un résultat professionnel garanti" },
    ],
    services: [
      { name: "Nettoyage fin de chantier", url: "/services/entreprise/nettoyage-fin-chantier", ctaLabel: "Demander un devis" },
    ],
  },
];

export const getPostsByCategory = (category: BlogCategory) => {
  return blogPosts.filter((post) => post.category === category);
};

export const getPostBySlug = (slug: string) => {
  return blogPosts.find((post) => post.slug === slug);
};
