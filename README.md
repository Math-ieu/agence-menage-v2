# Agence Ménage - Services de Nettoyage Professionnels

Bienvenue dans le projet **Agence Ménage**, une plateforme moderne et performante pour la réservation de services de nettoyage à Casablanca, tant pour les particuliers que pour les entreprises.

Ce projet a été migré de Vite vers **Next.js 16** (App Router) pour offrir de meilleures performances, une optimisation SEO avancée et une expérience utilisateur fluide.

## 🚀 Technologies Utilisées

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **UI & Style** : [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Services tiers** : [EmailJS](https://www.emailjs.com/) pour la gestion des formulaires de contact

## 🛠️ Installation et Démarrage

### Pré-requis

- **Node.js** : v18.17.0 ou supérieure (v20+ recommandée)
- **npm** ou **yarn**

### Étapes

1. **Cloner le projet**

   ```sh
   git clone <URL_DU_REPO>
   cd agence-menage-v2
   ```

2. **Installer les dépendances**

   ```sh
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env` à la racine (voir `.env.example`) :

   ```env
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=votre_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=votre_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=votre_public_key
   ```

4. **Lancer le serveur de développement**

   ```sh
   npm run dev
   ```

   L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## 📄 Structure du Projet

- `src/app/` : Routes de l'application (Pages, Layouts, API).
- `src/components/` : Composants React réutilisables.
- `src/components/ui/` : Composants de base de Shadcn UI.
- `src/assets/` : Images et ressources statiques.
- `src/lib/` : Utilitaires et configurations (EmailJS, etc.).
- `public/` : Fichiers statiques servis directement (Vidéo, robots.txt, sitemap.xml).

## 📈 SEO et Performance

- **Optimisation SEO** : Utilisation de la MetaData API de Next.js pour chaque page.
- **Sitemap & Robots** : Génération dynamique du sitemap et configuration `robots.txt` à la racine.
- **Performance** : Utilisation de `next/image` pour l'optimisation des images et `next/link` pour une navigation instantanée.

## 📝 Scripts Disponibles

- `npm run dev` : Lance le serveur de développement.
- `npm run build` : Crée un build de production optimisé.
- `npm run start` : Lance l'application compilée.
- `npm run lint` : Vérifie la qualité du code.

---
Développé avec ❤️ pour Agence Ménage Casablanca.
