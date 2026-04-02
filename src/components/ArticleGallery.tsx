import { GalleryImage } from "@/data/blogData";

interface ArticleGalleryProps {
  images: GalleryImage[];
}

const ArticleGallery = ({ images }: ArticleGalleryProps) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-10 mb-8">
      <h3 className="text-lg font-bold text-foreground mb-4">Galerie</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <figure key={index} className="rounded-xl overflow-hidden border border-border bg-card">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <img
                src={typeof image.src === "string" ? image.src : image.src.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <figcaption className="px-3 py-2 text-xs text-muted-foreground">
              {image.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};

export default ArticleGallery;
