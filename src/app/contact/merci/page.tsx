"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquare, Home } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
    useEffect(() => {
        // Trigger GTM conversion event on page load
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'conversion', {
                'send_to': 'AW-17907112455/IwYmCPvxvu4bEIe049pC'
            });
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 flex items-center justify-center py-20 px-4">
                <div className="container max-w-2xl text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-8 border-4 border-white shadow-lg animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">
                        Merci pour votre message !
                    </h1>

                    <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                        Votre demande a bien été reçue. Nous l'étudions avec attention et un membre de notre équipe vous contactera dans les plus brefs délais.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                        <Button asChild variant="outline" className="h-12 rounded-full border-primary text-primary hover:bg-primary/5">
                            <Link href="/" className="flex items-center gap-2">
                                <Home className="w-5 h-5" />
                                Retour à l'accueil
                            </Link>
                        </Button>
                        <Button asChild className="h-12 rounded-full bg-primary text-white hover:bg-primary/90">
                            <Link href="/contact" className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Nouveau message
                            </Link>
                        </Button>
                    </div>

                    
                </div>
            </main>

            <Footer />
        </div>
    );
}
