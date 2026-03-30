import React from "react";
import Image from "next/image";

interface ArticleGalleryProps {
  images: string[];
}

const ArticleGallery = ({ images }: ArticleGalleryProps) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-14 mb-10">
      <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-primary rounded-full"></span>
        Galerie photos
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((image, i) => (
          <div key={i} className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-border bg-muted">
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <Image 
              src={image} 
              alt={`Photo ${i + 1}`} 
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleGallery;
