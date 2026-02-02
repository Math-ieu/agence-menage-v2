"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createWhatsAppLink, formatContactMessage, DESTINATION_PHONE_NUMBER } from "@/lib/whatsapp";
import { Checkbox } from "@/components/ui/checkbox";
import { sendContactEmail } from "@/app/actions";

const INITIAL_FORM_DATA = {
    name: "",
    email: "",
    phonePrefix: "+212",
    phoneNumber: "",
    useWhatsappForPhone: true,
    whatsappPrefix: "+212",
    whatsappNumber: "",
    message: ""
};

const Contact = () => {
    const router = useRouter();
    const [wasValidated, setWasValidated] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasValidated(true);

        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        const processedData = {
            ...formData,
            phoneNumber: `${formData.phonePrefix} ${formData.phoneNumber}`,
            whatsappNumber: formData.useWhatsappForPhone
                ? `${formData.phonePrefix} ${formData.phoneNumber}`
                : `${formData.whatsappPrefix} ${formData.whatsappNumber}`
        };

        const whatsappMessage = formatContactMessage(processedData);
        // const whatsappLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, whatsappMessage);

        // Send email copy via Resend (async)
        sendContactEmail(processedData).catch(console.error);

        // window.open(whatsappLink, "_blank");
        toast.success("Votre message a été bien envoyé. Notre équipe vous contactera sous peu.");

        // Reset form
        setFormData(INITIAL_FORM_DATA);
        setWasValidated(false);

        // Redirect to fixed confirmation page for Google Ads tracking
        router.push('/contact/merci');
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
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                                                        value={formData.phonePrefix}
                                                        onChange={e => setFormData(prev => ({
                                                            ...prev,
                                                            phonePrefix: e.target.value,
                                                            whatsappPrefix: prev.useWhatsappForPhone ? e.target.value : prev.whatsappPrefix
                                                        }))}
                                                        className="w-20 border-slate-200 h-12 rounded-xl text-center font-bold text-slate-600 focus:ring-primary focus:border-primary transition-all"
                                                        placeholder="+212"
                                                    />
                                                    <Input
                                                        id="phone"
                                                        required
                                                        placeholder="6XXXXXXXX"
                                                        value={formData.phoneNumber}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                phoneNumber: val,
                                                                whatsappNumber: prev.useWhatsappForPhone ? val : prev.whatsappNumber
                                                            }));
                                                        }}
                                                        className="border-slate-200 h-12 rounded-xl focus:ring-primary focus:border-primary transition-all flex-1"
                                                    />
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="useWhatsapp"
                                                        checked={formData.useWhatsappForPhone}
                                                        onCheckedChange={(checked) => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                useWhatsappForPhone: !!checked,
                                                                whatsappNumber: checked ? prev.phoneNumber : prev.whatsappNumber,
                                                                whatsappPrefix: checked ? prev.phonePrefix : prev.whatsappPrefix
                                                            }));
                                                        }}
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
                                                    value={formData.whatsappPrefix}
                                                    onChange={e => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                                                    className="w-20 border-slate-200 h-12 rounded-xl text-center font-bold text-slate-600 focus:ring-primary focus:border-primary transition-all"
                                                    placeholder="+212"
                                                    disabled={formData.useWhatsappForPhone}
                                                />
                                                <Input
                                                    id="whatsapp"
                                                    placeholder="6XXXXXXXX"
                                                    value={formData.whatsappNumber}
                                                    onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                                    className="border-slate-200 h-12 rounded-xl focus:ring-primary focus:border-primary transition-all flex-1"
                                                    disabled={formData.useWhatsappForPhone}
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
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="border-slate-200 rounded-2xl resize-none focus:ring-primary focus:border-primary transition-all p-4"
                                            placeholder="Comment pouvons-nous vous aider ?"
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-center">
                                        <Button
                                            type="submit"
                                            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-bold shadow-lg shadow-primary/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95"
                                        >
                                            Envoyer le message
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
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">Notre Adresse</h4>
                                                <p className="text-slate-600 mt-1">
                                                    36 boulevard d’anfa, résidence Anafe A,<br />
                                                    etage 7, Casablanca
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">Service Client</h4>
                                                <div className="flex flex-col gap-1 mt-1">
                                                    <a href="tel:+212664331463" className="text-slate-600 hover:text-primary transition-colors">06 64 33 14 63</a>
                                                    <a href="tel:+212664226790" className="text-slate-600 hover:text-primary transition-colors">06 64 22 67 90</a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">Email</h4>
                                                <a href="mailto:contact@agencemenage.ma" className="text-slate-600 hover:text-primary transition-colors mt-1 block">
                                                    contact@agencemenage.ma
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Map */}
                                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex-1 min-h-[400px] overflow-hidden">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.4846067727145!2d-7.6324838!3d33.5932599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM1JzM1LjciTiA3wrAzNyc1Ni45Ilc!5e0!3m2!1sfr!2sma!4v1635848529285!5m2!1sfr!2sma"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        className="rounded-xl w-full h-full"
                                        title="Localisation Agence"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
