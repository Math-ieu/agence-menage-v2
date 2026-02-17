"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, ArrowLeft, Phone, Calendar } from "lucide-react";
import { Suspense } from "react";

function ThankYouContent() {
    return (
        <main className="flex-1 flex items-center justify-center py-20 px-4">
            <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 p-8 md:p-16 text-center space-y-8 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>

                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-bounce-slow">
                        <CheckCircle2 className="w-12 h-12 text-primary" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Merci pour votre confiance !
                    </h1>
                    <p className="text-xl text-slate-600 font-medium max-w-lg mx-auto leading-relaxed">
                        Votre demande de réservation a été transmise avec succès à nos équipes.
                    </p>
                    <p className="text-slate-500 italic">
                        Un conseiller de l'Agence Ménage vous contactera très prochainement pour confirmer les détails de votre prestation.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-left py-8 border-y border-slate-100">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-slate-900">Rappel rapide</p>
                            <p className="text-sm text-slate-500">Un conseiller vous appellera dans les plus brefs délais.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-slate-900">Confirmation</p>
                            <p className="text-sm text-slate-500">Nous validerons ensemble la date et l'heure.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all text-center"
                    >
                        Retour à l'accueil
                    </Link>
                    <Link
                        href="/#services-particuliers"
                        className="w-full sm:w-auto px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-full hover:bg-slate-200 transition-all text-center flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voir nos services
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function ThankYouPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <Suspense fallback={<div className="flex-1 flex items-center justify-center">Chargement...</div>}>
                <ThankYouContent />
            </Suspense>
            <Footer />
        </div>
    );
}
