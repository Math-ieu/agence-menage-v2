"use client";

import Link from "next/link";
import { particulierServices, entrepriseServices } from "@/constants/services";

interface OtherServicesProps {
    type: "particulier" | "entreprise";
    currentServiceUrl: string;
}

const OtherServices = ({ type, currentServiceUrl }: OtherServicesProps) => {
    const services = type === "particulier" ? particulierServices : entrepriseServices;
    const otherServices = services.filter(service => service.url !== currentServiceUrl);

    if (otherServices.length === 0) return null;

    return (
        <section className="py-16 bg-slate-50 border-t">
            <div className="container max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-primary mb-12 text-center uppercase tracking-wider">
                    Voir d'autres services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherServices.map((service) => (
                        <Link
                            key={service.url}
                            href={service.url}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="font-bold text-xl text-slate-800 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <div
                                    className="w-2 h-2 rounded-full mt-2"
                                    style={{ backgroundColor: service.color }}
                                />
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                                {service.description}
                            </p>
                            <div className="mt-6 flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                                En savoir plus
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OtherServices;
