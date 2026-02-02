"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createWhatsAppLink, formatCandidateMessage, DESTINATION_PHONE_NUMBER } from "@/lib/whatsapp";
import { sendEmployeeEmail } from "@/app/actions";
import heroImage from "@/assets/hero-espace-employe.png";

import { GraduationCap, Clock, MapPin, Heart } from "lucide-react";

const INITIAL_FORM_DATA = {
    firstName: "",
    lastName: "",
    phonePrefix: "+212",
    phoneNumber: "",
    useWhatsappForPhone: true,
    whatsappPrefix: "+212",
    whatsappNumber: "",
    position: "",
    experience: "",
    languages: [] as string[],
    nationality: "",
    neighborhood: "",
    city: "",
};

const EspaceEmploye = () => {
    const [wasValidated, setWasValidated] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const positions = [
        "Femme de ménage",
        "Aide senior/garde de personne agée"
    ];

    const experiences = [
        "Débutante : 0 à 6 mois",
        "Intermédiaire : 6 mois à 2 ans",
        "Confirmée : 2 ans à 5 ans",
        "Experte : 5 ans et plus"
    ];

    const availableLanguages = ["Arabe", "Français", "Anglais"];

    const benefits = [
        {
            icon: GraduationCap,
            title: "Formation adaptée",
            description: "Une formation continue et adaptée à votre métier pour exceller dans vos missions."
        },
        {
            icon: Clock,
            title: "Horaires flexibles",
            description: "Organisez votre temps de travail selon vos propres disponibilités."
        },
        {
            icon: MapPin,
            title: "Proximité",
            description: "Nous vous proposons des missions au plus proche de votre domicile."
        },
        {
            icon: Heart,
            title: "Équipe bienveillante",
            description: "Une équipe à l'écoute qui vous accompagne au quotidien."
        }
    ];

    const toggleLanguage = (lang: string) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.includes(lang)
                ? prev.languages.filter(l => l !== lang)
                : [...prev.languages, lang]
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasValidated(true);

        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        if (formData.languages.length === 0) {
            toast.error("Veuillez sélectionner au moins une langue parlée.");
            const langSection = document.getElementById('languages-section');
            if (langSection) {
                langSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        const processedData = {
            ...formData,
            phoneNumber: `${formData.phonePrefix} ${formData.phoneNumber}`,
            whatsappNumber: formData.useWhatsappForPhone
                ? `${formData.phonePrefix} ${formData.phoneNumber}`
                : `${formData.whatsappPrefix} ${formData.whatsappNumber}`
        };

        const message = formatCandidateMessage(processedData);
        const whatsappLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, message);

        // Send email copy via Resend (async)
        sendEmployeeEmail(processedData).catch(console.error);

        // window.open(whatsappLink, "_blank");
        toast.success("Votre formulaire a été bien rempli et envoyé avec succès.");

        // Reset form
        setFormData(INITIAL_FORM_DATA);
        setWasValidated(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-36 px-4 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${heroImage})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60" />
                    </div>

                    <div className="relative container max-w-5xl text-center">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-6">Espace employé</h1>
                        <p className="text-xl md:text-2xl font-bold text-slate-800 mb-4 max-w-3xl mx-auto">
                            Rejoignez une équipe qui vous accompagne et vous forme
                        </p>
                        <p className="text-lg text-slate-800 font-medium max-w-2xl mx-auto">
                            Vous êtes femme de ménage, aide à domicile ou intervenante auprès de seniors ?
                            Que vous soyez débutante ou expérimentée, nous vous accompagnons.
                        </p>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-16 px-4">
                    <div className="container max-w-5xl">
                        <h2 className="text-2xl font-bold text-center text-primary mb-12">
                            Pourquoi rejoindre Agence Ménage ?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="text-center group">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                                        <benefit.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-primary mb-2">{benefit.title}</h3>
                                    <p className="text-slate-600 text-sm">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <section className="py-16 px-2 sm:px-4 bg-slate-50">
                    <div className="container max-w-4xl px-0 sm:px-4">
                        <div className="bg-card p-6 rounded-lg shadow-sm border border-slate-100">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-slate-800 mb-2">Formulaire de candidature</h2>
                                <p className="text-slate-500">Remplissez les informations ci-dessous pour postuler</p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate className={`space-y-8 ${wasValidated ? 'was-validated' : ''}`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Nom*</Label>
                                        <Input
                                            id="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            className="border-slate-300 h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Prénom*</Label>
                                        <Input
                                            id="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            className="border-slate-300 h-11"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Numéro de téléphone*</Label>
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <Input
                                                    value={formData.phonePrefix}
                                                    onChange={e => setFormData(prev => ({
                                                        ...prev,
                                                        phonePrefix: e.target.value,
                                                        whatsappPrefix: prev.useWhatsappForPhone ? e.target.value : prev.whatsappPrefix
                                                    }))}
                                                    className="w-20 border-slate-300 h-11 text-center font-bold text-slate-600"
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
                                                    className="border-slate-300 h-11 flex-1"
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
                                                    className="data-[state=checked]:bg-primary border-primary"
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
                                        <Label htmlFor="whatsapp">Numéro whatsapp</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={formData.whatsappPrefix}
                                                onChange={e => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                                                className="w-20 border-slate-300 h-11 text-center font-bold text-slate-600"
                                                placeholder="+212"
                                                disabled={formData.useWhatsappForPhone}
                                            />
                                            <Input
                                                id="whatsapp"
                                                placeholder="6XXXXXXXX"
                                                value={formData.whatsappNumber}
                                                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                                className="border-slate-300 h-11 flex-1"
                                                disabled={formData.useWhatsappForPhone}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Label>Poste disponible*</Label>
                                        <Select
                                            required
                                            value={formData.position}
                                            onValueChange={value => setFormData({ ...formData, position: value })}
                                        >
                                            <SelectTrigger className={`border-slate-300 h-11 ${wasValidated && !formData.position ? 'border-red-500 shadow-[0_0_0_1px_#ef4444]' : ''}`}>
                                                <SelectValue placeholder="Sélectionnez le poste souhaité" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {positions.map(p => (
                                                    <SelectItem key={p} value={p}>{p}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Niveau d'expérience*</Label>
                                        <Select
                                            required
                                            value={formData.experience}
                                            onValueChange={value => setFormData({ ...formData, experience: value })}
                                        >
                                            <SelectTrigger className={`border-slate-300 h-11 ${wasValidated && !formData.experience ? 'border-red-500 shadow-[0_0_0_1px_#ef4444]' : ''}`}>
                                                <SelectValue placeholder="Niveau d'expérience" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {experiences.map(exp => (
                                                    <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4" id="languages-section">
                                        <Label>Langues parlées*</Label>
                                        <div className={`flex flex-wrap gap-4 p-4 border rounded-xl bg-slate-50 transition-all ${wasValidated && formData.languages.length === 0 ? 'border-red-500 bg-red-50 shadow-[0_0_0_1px_#ef4444]' : 'border-slate-200'}`}>
                                            {availableLanguages.map(lang => (
                                                <div key={lang} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`lang-${lang}`}
                                                        checked={formData.languages.includes(lang)}
                                                        onCheckedChange={() => toggleLanguage(lang)}
                                                    />
                                                    <Label htmlFor={`lang-${lang}`} className="cursor-pointer font-medium text-slate-700">{lang}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="nationality">Nationalité*</Label>
                                        <Input
                                            id="nationality"
                                            required
                                            value={formData.nationality}
                                            onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                                            className="border-slate-300 h-11"
                                            placeholder="Ex: Marocaine"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <div className="space-y-2">
                                        <Label htmlFor="neighborhood">Adresse*</Label>
                                        <Input
                                            id="neighborhood"
                                            required
                                            value={formData.neighborhood}
                                            onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                                            className="border-slate-300 h-11"
                                            placeholder="Adresse"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ville*</Label>
                                        <Input
                                            id="city"
                                            required
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            className="border-slate-300 h-11"
                                            placeholder="Ex: Casablanca"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center pt-8">
                                    <Button
                                        type="submit"
                                        className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-bold shadow-lg shadow-primary/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95"
                                    >
                                        Soumettre ma candidature
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default EspaceEmploye;
