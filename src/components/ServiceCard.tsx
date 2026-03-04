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
    <div className="flex items-center min-w-[300px] w-[300px] sm:min-w-[340px] sm:w-[340px] h-48 sm:h-52 group py-4 pr-[32px] shrink-0">
      <div
        className="w-full h-full relative rounded-3xl shadow-sm hover:shadow-lg transition-transform duration-300 group-hover:-translate-y-1 flex items-center pl-6 pr-14"
        style={{ backgroundColor: color }}
      >
        <h2 className="text-white text-[24px] sm:text-[30px] font-bold leading-snug z-10 w-[150px] sm:w-[160px] break-words drop-shadow-md">
          {title}
        </h2>

        {/* Circular image overlapping right edge */}
        <div className="absolute right-[-32px] top-1/2 -translate-y-1/2 w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] rounded-full border-[4px] border-white/40 shadow-md overflow-hidden bg-transparent z-20 transition-transform duration-500 group-hover:scale-105">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
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
