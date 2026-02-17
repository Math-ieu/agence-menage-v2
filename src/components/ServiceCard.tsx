"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";

interface ServiceCardProps {
  title: string;
  subtitle?: string; // For backward compatibility
  description?: string; // New field
  image: string | StaticImageData;
  color: string;
  url?: string;
}

const ServiceCard = ({ title, subtitle, description, image, color, url }: ServiceCardProps) => {
  const displayDescription = description || subtitle;
  const imageSrc = typeof image === "string" ? image : image?.src;

  const cardContent = (
    <div className="flex flex-col items-center min-w-[300px] max-w-[300px] w-[300px] flex-shrink-0 group py-4">
      <div className="relative bg-white rounded-[2rem] shadow-lg w-full overflow-visible flex flex-col transition-all duration-300 hover:shadow-xl border border-slate-100 h-[450px]">
        {/* Banner - fixed height for alignment */}
        <div
          className="rounded-2xl mx-4 mt-4 h-32 flex items-start justify-center p-6 transition-transform duration-300 group-hover:scale-[1.02]"
          style={{ backgroundColor: color }}
        >
          <h3 className="text-white text-xl font-bold text-center line-clamp-2 drop-shadow-sm leading-tight pt-1">
            {title}
          </h3>
        </div>

        {/* Circular image overlapping banner */}
        <div className="flex justify-center -mt-10 relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
          <div className="w-24 h-24 rounded-full border-4 border-white ring-2 ring-slate-100 overflow-hidden shadow-lg bg-white">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Description - fixed-height container to align button */}
        <div className="px-6 mt-4 pb-6 flex-1 flex flex-col">
          <p className="text-slate-600 text-sm leading-relaxed italic text-justify line-clamp-4">
            {displayDescription}
          </p>
        </div>

        {/* CTA Button Area */}
        <div className="px-6 pb-8 mt-auto">
          <div
            className="w-full py-3.5 rounded-full text-white font-bold text-sm transition-all duration-300 hover:scale-105 shadow-md flex items-center justify-center group-hover:shadow-primary/20"
            style={{ backgroundColor: color }}
          >
            Découvrez le service
          </div>
        </div>
      </div>
    </div>
  );

  if (url) {
    return <Link href={url} className="block transition-all focus:outline-none">{cardContent}</Link>;
  }

  return cardContent;
};

export default ServiceCard;
