import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  bannerColor: string;
}

const BlogCard = ({ slug, title, description, tags, bannerColor }: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${slug}`}
      className="min-w-[280px] max-w-sm bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
    >
      <div className="h-3 w-full" style={{ backgroundColor: bannerColor }} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-medium rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="text-base font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">{description}</p>

        <span className="text-sm font-semibold text-primary inline-flex items-center gap-1">
          Voir plus →
        </span>
      </div>
    </Link>
  );
};

export default BlogCard;
