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
