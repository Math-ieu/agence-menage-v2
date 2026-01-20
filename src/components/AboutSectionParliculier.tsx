"use client";
import { useEffect, useRef, useState } from "react";

const AboutSectionParticulier = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay was prevented:", error);
      });
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-16 bg-section-gray">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Qui sommes-nous ?
          </h2>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-slate-100">
            {isVisible && (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src="/Video-corrected.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionParticulier;
