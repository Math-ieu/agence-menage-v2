"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SafeEmailLink from "@/components/SafeEmailLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { sendContactEmail } from "@/app/actions";
import { useSiteConfig } from "@/context/SiteConfigContext";

export default function ContactClient() {
    const router = useRouter();
    const { config } = useSiteConfig();
    const [wasValidated, setWasValidated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [useWhatsappForPhone, setUseWhatsappForPhone] = useState(true);
    const [activeMap, setActiveMap] = useState<"casablanca" | "rabat">("casablanca");

    // Champs non-contrôlés (lus au submit) pour éviter de re-rendre tout le
    // formulaire à chaque frappe (optimisation INP).
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phonePrefixRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const whatsappPrefixRef = useRef<HTMLInputElement>(null);
    const whatsappNumberRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasValidated(true);

        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        const phonePrefix = phonePrefixRef.current?.value.trim() || "+212";
        const phoneNumber = phoneNumberRef.current?.value.trim() ?? "";
        const whatsappPrefix = whatsappPrefixRef.current?.value.trim() || "+212";
        const whatsappNumber = whatsappNumberRef.current?.value.trim() ?? "";

        const processedData = {
            name: nameRef.current?.value.trim() ?? "",
            email: emailRef.current?.value.trim() ?? "",
            useWhatsappForPhone,
            message: messageRef.current?.value.trim() ?? "",
            phoneNumber: `${phonePrefix} ${phoneNumber}`,
            whatsappNumber: useWhatsappForPhone
                ? `${phonePrefix} ${phoneNumber}`
                : `${whatsappPrefix} ${whatsappNumber}`
        };

        setIsSubmitting(true);
        try {
            // Send email copy via Resend
            await sendContactEmail(processedData);

            toast.success("Votre message a été bien envoyé. Notre équipe vous contactera sous peu.");

            setWasValidated(false);

            // Redirect to fixed confirmation page for Google Ads tracking
            router.push('/contact/merci');
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-primary/5 py-16 px-4">
                    <div className="container max-w-5xl text-center">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-6">Contactez-nous</h1>
                        <p className="text-xl md:text-2xl font-bold text-slate-800 mb-4 max-w-3xl mx-auto">
                            Nous sommes à votre écoute
                        </p>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Pour toute question, demande de devis personnalisé ou information complémentaire,
                            n'hésitez pas à nous envoyer un message.
                        </p>
                    </div>
                </section>

                {/* Form Section */}
                <section className="py-16 px-2 sm:px-4 bg-slate-50">
                    <div className="container max-w-6xl mx-auto px-0 sm:px-4">
                        <div className="grid xl:grid-cols-2 gap-8 xl:gap-12">
                            {/* Form */}
                            <div className="bg-card p-6 md:p-8 rounded-lg shadow-sm border border-slate-100 h-full xl:order-2">
                                <div className="mb-8 text-center xl:text-left">
                                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Ecrivez-nous</h2>
                                    <p className="text-slate-500">Remplissez le formulaire et nous vous répondrons dans les plus brefs délais</p>
                                </div>

                                <form onSubmit={handleSubmit} noValidate className={`space-y-6 ${wasValidated ? 'was-validated' : ''}`}>
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="font-semibold text-slate-700">Nom*</Label>
                                        <Input
                                            id="name"
                                            required
                                            ref={nameRef}
                                            className="border-slate-200 h-12 rounded-xl focus:ring-primary focus:border-primary transition-all"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="font-semibold text-slate-700">Email*</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            ref={emailRef}
                                            className="border-slate-200 h-12 rounded-xl focus:ring-primary focus:border-primary transition-all"
                                            placeholder="votre@email.com"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="font-semibold text-slate-700">Numéro de téléphone*</Label>
                                            <div className="space-y-3">
                                                <div className="flex gap-2">
                                                    <Input
                                                        ref={phonePrefixRef}
                                                        defaultValue="+212"
                                                        className="w-20 border-slate-200 h-12 rounded-xl text-center font-bold text-slate-600 focus:ring-primary focus:border-primary transition-all"
                                                        placeholder="+212"
                                                    />
                                                    <Input
                                                        id="phone"
                                                        required
                                                        placeholder="6XXXXXXXX"
                                                        ref={phoneNumberRef}
                                                        className="border-slate-200 h-12 rounded-xl focus:ring-primary focus:border-primary transition-all flex-1"
                                                    />
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="useWhatsapp"
                                                        checked={useWhatsappForPhone}
                                                        onCheckedChange={(checked) => setUseWhatsappForPhone(!!checked)}
                                                        className="data-[state=checked]:bg-primary border-primary rounded"
                                                    />
                                                    <label
                                                        htmlFor="useWhatsapp"
                                                        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 cursor-pointer"
                                                    >
                                                        Utilisez-vous ce numéro pour WhatsApp ?
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="whatsapp" className="font-semibold text-slate-700">Numéro whatsapp</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    ref={whatsappPrefixRef}
                                                    defaultValue="+212"
                                                    className="w-20 border-slate-200 h-12 rounded-xl text-center font-bold text-slate-600 focus:ring-primary focus:border-primary transition-all"
                                                    placeholder="+212"
                                                    disabled={useWhatsappForPhone}
                                                />
                                                <Input
                                                    id="whatsapp"
                                                    placeholder="6XXXXXXXX"
                                                    ref={whatsappNumberRef}
                                                    className="border-slate-200 h-12 rounded-xl focus:ring-primary focus:border-primary transition-all flex-1"
                                                    disabled={useWhatsappForPhone}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="font-semibold text-slate-700">Message*</Label>
                                        <Textarea
                                            id="message"
                                            required
                                            rows={6}
                                            ref={messageRef}
                                            className="border-slate-200 rounded-2xl resize-none focus:ring-primary focus:border-primary transition-all p-4"
                                            placeholder="Comment pouvons-nous vous aider ?"
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-center">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-bold shadow-lg shadow-primary/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Envoi en cours...
                                                </div>
                                            ) : (
                                                "Envoyer le message"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>

                            {/* Contact Info & Map */}
                            <div className="flex flex-col h-full space-y-8">
                                {/* Info Elements */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center xl:text-left">Nos Coordonnées</h3>

                                    <div className="space-y-6">
                                        {(config.bureau_casa_address || config.bureau_rabat_address) && (
                                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">Nos Adresses</h4>
                                                    <div className="text-slate-600 mt-2 space-y-3">
                                                        {config.bureau_casa_address && (
                                                            <p className="leading-relaxed text-sm sm:text-base">
                                                                <span className="font-extrabold text-slate-800 block text-sm">{config.bureau_casa_label || "Bureau Casablanca"}</span>
                                                                {config.bureau_casa_address}
                                                            </p>
                                                        )}
                                                        {config.bureau_rabat_address && (
                                                            <p className="leading-relaxed text-sm sm:text-base">
                                                                <span className="font-extrabold text-slate-800 block text-sm">{config.bureau_rabat_label || "Bureau Rabat"}</span>
                                                                {config.bureau_rabat_address}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {(config.phone_mobile_1 || config.phone_mobile_2) && (
                                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">Service Client</h4>
                                                    <div className="flex flex-col gap-1 mt-1">
                                                        {config.phone_mobile_1 && (
                                                            <a href={`tel:${config.phone_mobile_1_intl || config.phone_mobile_1}`} className="text-slate-600 hover:text-primary transition-colors">
                                                                {config.phone_mobile_1}
                                                            </a>
                                                        )}
                                                        {config.phone_mobile_2 && (
                                                            <a href={`tel:${config.phone_mobile_2_intl || config.phone_mobile_2}`} className="text-slate-600 hover:text-primary transition-colors">
                                                                {config.phone_mobile_2}
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {config.email_contact && (
                                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">Email</h4>
                                                    <SafeEmailLink
                                                        email={config.email_contact}
                                                        className="text-slate-600 hover:text-primary transition-colors mt-1 block"
                                                    >
                                                        {config.email_contact}
                                                    </SafeEmailLink>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Map */}
                                {(config.bureau_casa_maps_url || config.bureau_rabat_maps_url) && (
                                    <div className="flex-1 flex flex-col space-y-3">
                                        {/* Map tabs */}
                                        {config.bureau_casa_maps_url && config.bureau_rabat_maps_url && (
                                            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveMap("casablanca")}
                                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                                                        activeMap === "casablanca"
                                                            ? "bg-white text-primary shadow-sm"
                                                            : "text-slate-600 hover:text-slate-900"
                                                    }`}
                                                >
                                                    {config.bureau_casa_label || "Bureau de Casablanca"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveMap("rabat")}
                                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                                                        activeMap === "rabat"
                                                            ? "bg-white text-primary shadow-sm"
                                                            : "text-slate-600 hover:text-slate-900"
                                                    }`}
                                                >
                                                    {config.bureau_rabat_label || "Bureau de Rabat"}
                                                </button>
                                            </div>
                                        )}

                                        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex-1 min-h-[400px] overflow-hidden">
                                            <iframe
                                                src={
                                                    activeMap === "casablanca"
                                                        ? (config.bureau_casa_maps_url || config.bureau_rabat_maps_url)
                                                        : (config.bureau_rabat_maps_url || config.bureau_casa_maps_url)
                                                }
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                                className="rounded-xl w-full h-full"
                                                title={`Localisation Agence ${activeMap === "casablanca" ? (config.bureau_casa_label || "Casablanca") : (config.bureau_rabat_label || "Rabat")}`}
                                            ></iframe>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
