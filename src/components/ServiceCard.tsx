"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";

interface ServiceCardProps {
  title: string;
  subtitle?: string; // For backward compatibility
  description?: string; // For backward compatibility
  image: string | StaticImageData;
  color: string;
  url?: string;
}

const ServiceCard = ({ title, image, color, url }: ServiceCardProps) => {
  const imageSrc = typeof image === "string" ? image : image?.src;

  const cardContent = (
    <div className="flex items-center w-[calc(100vw-32px)] sm:min-w-[382px] sm:w-[382px] max-w-[460px] h-48 sm:h-52 group py-4 pr-[32px] shrink-0">
      <div
        className="w-full h-full relative rounded-2xl shadow-sm hover:shadow-lg transition-transform duration-300 group-hover:-translate-y-1 flex items-center pl-6 pr-14"
        style={{ backgroundColor: color }}
      >
        <h2 className="text-white text-[28px] sm:text-[26px] font-bold leading-snug z-30 w-full pr-[60px] break-words drop-shadow-md">
          {title}
        </h2>

        {/* Circular image overlapping right edge */}
        <div className="absolute right-[-32px] top-1/2 -translate-y-1/2 w-[140px] h-[140px] sm:w-[140px] sm:h-[140px] rounded-full border-[4px] border-white/40 shadow-md overflow-hidden bg-transparent z-20 transition-transform duration-500 group-hover:scale-105">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            width={140}
            height={140}
          />
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
