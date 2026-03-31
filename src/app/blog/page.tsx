import { Metadata } from "next";
import BlogClientPage from "./BlogClientPage";

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
};

export default function Blog() {
  return <BlogClientPage />;
}
