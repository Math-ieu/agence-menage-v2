import photoMehdi from "@/assets/photo-mehdi-presentation.png";

const PresentationSection = () => {
    return (
        <section className="relative py-20 bg-[#F2F2F2] overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-10 left-10 opacity-40 pointer-events-none">
                <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 50 C 50 10, 80 90, 120 50 S 180 10, 220 50" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M20 70 C 60 30, 90 110, 130 70 S 190 30, 230 70" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
                </svg>
            </div>

            <div className="absolute top-0 right-0 opacity-30 pointer-events-none translate-x-1/2 -translate-y-1/2">
                <div className="grid grid-cols-12 gap-3">
                    {[...Array(96)].map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-slate-400" />
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 pointer-events-none z-0">
                <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border-[60px] md:border-[100px] border-[#287271]/20" />
                <div className="absolute inset-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-[#287271] opacity-90 translate-x-1/4 translate-y-1/4" />
            </div>

            <div className="container relative z-10 mx-auto max-w-6xl">
                <div className="flex flex-col items-center">

                    {/* Mobile & Tablet: Photo at top */}
                    <div className="xl:hidden -mb-12 relative z-20">
                        <img
                            src={photoMehdi.src}
                            alt="Mehdi HARIT"
                            className="w-56 h-auto drop-shadow-xl"
                        />
                    </div>

                    {/* The Quote Box */}
                    <div className="relative w-full max-w-5xl">
                        <div className="bg-[#EAEAEA] rounded-[40px] px-8 py-4 md:px-16 md:py-6 shadow-xl relative mt-4 md:mt-0">

                            <div className="relative">
                                {/* Top Quote Mark */}
                                <div className="text-black text-4xl md:text-5xl font-serif leading-none select-none absolute -top-4 left-0 md:-top-6">
                                    “
                                </div>

                                <div className="space-y-3 text-slate-800 text-lg md:text-xl xl:text-2xl leading-tight text-center xl:text-left pt-2">
                                    <p>
                                        À Casablanca, nous recherchons un service qui respecte notre rythme, nos espaces et nos standards.
                                    </p>
                                    <p>
                                        <span className="font-bold">Agence Ménage</span> est née de cette exigence : une propreté premium, encadrée et durable, pour les particuliers et les entreprises.
                                    </p>
                                    <p>
                                        Adossés à <span className="font-bold">Agence Premium</span> et <span className="font-bold">Nounou.ma</span>, et accompagnés par <span className="font-bold">Julien COSTAN ZANON</span> (15 ans d'expertise en Suisse), nous appliquons une méthode rigoureuse et un contrôle qualité constant.
                                    </p>
                                    <p>
                                        Bienvenue chez <span className="font-bold">Agence Ménage</span>.
                                    </p>
                                </div>

                                {/* Bottom Quote Mark & Author Block */}
                                <div className="flex flex-col xl:flex-row items-center xl:items-end mt-0">
                                    {/* Desktop Photo: positioned bottom-left corner */}
                                    <div className="hidden xl:block flex-shrink-0 -mb-28 -ml-56 xl:-ml-64">
                                        <img
                                            src={photoMehdi.src}
                                            alt="Mehdi HARIT"
                                            className="w-72 lg:w-80 h-auto drop-shadow-2xl"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col items-center xl:items-start pl-0 xl:pl-20 relative">
                                        {/* Bottom Quote Mark - Closer to text */}
                                        <div className="text-black text-4xl md:text-5xl font-serif leading-none select-none mb-2 xl:absolute xl:-top-36 xl:left-72">
                                            ”
                                        </div>

                                        <div className="text-center xl:text-left mt-0">
                                            <h4 className="text-[#287271] text-xl md:text-2xl font-black mb-0">Mehdi HARIT</h4>
                                            <p className="text-slate-600 text-xs md:text-sm font-bold uppercase tracking-wider">
                                                General Manager du groupe agence premium
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PresentationSection;
