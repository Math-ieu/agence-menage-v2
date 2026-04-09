import { Metadata } from "next";
import BlogClientPage from "./BlogClientPage";
import { getBlogPosts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog Agence Ménage | Astuces & Conseils Entretien",
  description: "Découvrez nos astuces, guides et conseils pour le nettoyage résidentiel et l'entretien professionnel au Maroc.",
  alternates: {
    canonical: "/blog",
    languages: {
      "fr-MA": "/blog",
      "x-default": "/blog",
    },
  },
  openGraph: {
    title: "Blog Agence Ménage | Astuces & Conseils Entretien",
    description: "Découvrez nos astuces, guides et conseils pour le nettoyage résidentiel et l'entretien professionnel au Maroc.",
    images: [
      {
        url: "/og-blog.png",
        width: 1200,
        height: 630,
        alt: "Blog Agence Ménage",
      },
    ],
    type: "website",
  },
};

export default async function Blog() {
  const posts = await getBlogPosts();
  return <BlogClientPage initialPosts={posts} />;
}
