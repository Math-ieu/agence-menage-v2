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
        "relative rounded-3xl h-40 md:h-56 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden flex",
        !isHexColor && colorClasses[color as keyof typeof colorClasses]
      )}
      style={isHexColor ? { backgroundColor: color } : {}}
    >
      {/* Left side - Color background with text */}
      <div className="flex-1 p-6 flex flex-col justify-start z-10">
        <h3 className="text-foreground font-[900] text-2xl md:text-[38px] leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-foreground/70 text-base md:text-lg mt-1 leading-[38px]">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side - Image */}
      {image && (
        <div className="w-1/2 h-full relative">
          <img
            src={typeof image === "string" ? image : image?.src}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );

  if (url) {
    return <Link href={url}>{cardContent}</Link>;
  }

  return cardContent;
};

export default ServiceCard;
