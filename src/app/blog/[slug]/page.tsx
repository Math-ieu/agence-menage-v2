import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/api";
import BlogArticleClient from "./BlogArticleClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Article Introuvable | Agence Ménage",
    };
  }

  return {
    title: `${post.title} | Blog Agence Ménage`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.featured_image || "",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogArticlePage(props: Props) {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogArticleClient initialPost={post} />;
}
