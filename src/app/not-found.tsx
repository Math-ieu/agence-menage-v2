"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                <Link href="/">
                    <Button className="rounded-full px-8">
                        Retour à l'accueil
                    </Button>
                </Link>
            </main>
            <Footer />
        </div>
    );
}
