import Link from "next/link";
import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";

interface ServiceCardProps {
  title: string;
  subtitle?: string;
  color: "green" | "orange" | "purple" | "yellow" | "blue" | string;
  image?: string | StaticImageData;
  url?: string;
}

const colorClasses = {
  green: "bg-service-green",
  orange: "bg-service-orange",
  purple: "bg-service-purple",
  yellow: "bg-service-yellow",
  blue: "bg-service-blue",
};

const ServiceCard = ({ title, subtitle, color, image, url }: ServiceCardProps) => {
  const isHexColor = color.startsWith("#");

  const cardContent = (
    <div
      className={cn(
        "relative rounded-[2.5rem] h-full cursor-pointer transition-all duration-500 hover:scale-[1.01] hover:shadow-xl overflow-hidden flex flex-col group shadow-lg border-0"
      )}
      style={isHexColor ? { backgroundColor: color } : {}}
    >
      {/* Top - Image Section with semi-transparent overlay */}
      {image && (
        <div className="w-full aspect-[4/3.5] relative overflow-hidden">
          <img
            src={typeof image === "string" ? image : image?.src}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
        </div>
      )}

      {/* Bottom - Content Section */}
      <div className="p-8 flex flex-col flex-1 text-black/80">
        <h3 className="font-black text-2xl md:text-3xl leading-tight mb-4 drop-shadow-sm min-h-[5rem] flex items-center">
          {title}
        </h3>
        {subtitle && (
          <p className="text-black/70 text-sm md:text-base line-clamp-3 leading-relaxed min-h-[5.5rem]">
            {subtitle}
          </p>
        )}

        <div className="mt-auto pt-8 flex items-center text-sm font-black uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300 text-black/90">
          Découvrir le service
          <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Subtle white shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-tr from-white to-transparent pointer-events-none transition-opacity duration-500" />
    </div>
  );

  if (url) {
    return <Link href={url} className="h-full block">{cardContent}</Link>;
  }

  return cardContent;
};

export default ServiceCard;
