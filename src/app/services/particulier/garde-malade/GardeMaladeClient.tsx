"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SERVICE_COLORS } from "@/constants/service-colors";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceHeroSection from "@/components/ServiceHeroSection";
import OtherServices from "@/components/OtherServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getConfirmationMessage } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
import "@/styles/sticky-summary.css";
import { FREQUENCES } from "@/app/frequences";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

// New assets
import gardeMaladeHero from "@/assets/service-garde-malade.png";
import handsCare from "@/assets/hands-care.png";
import caregiverVisit from "@/assets/caregiver-visit.png";

const INITIAL_FORM_DATA = {
    frequency: "oneshot",
    subFrequency: "",
    duration: 24,
    numberOfPeople: 1,
    careLocation: "domicile",
    careAddress: "",
    city: "Casablanca",
    neighborhood: "",
    patientAge: "",
    patientGender: "",
    mobility: "",
    healthIssues: "",
    schedulingTime: "morning",
    schedulingDate: "",
    schedulingType: "flexible",
    fixedTime: "14:00",
    numberOfDays: 1,
    additionalNotes: "",
    phoneNumber: "",
    phonePrefix: "+212",
    useWhatsappForPhone: true,
    whatsappPrefix: "+212",
    whatsappNumber: "",
    firstName: "",
    lastName: ""
};

export default function GardeMaladeClient() {
    const [showForm, setShowForm] = useState(false);
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const router = useRouter();

    const totalPrice = 0;

    const scrollToForm = () => {
        setShowForm(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasValidated(true);

        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.city || !formData.neighborhood || !formData.schedulingDate) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        const bookingData = {
            ...formData,
            phoneNumber: `${formData.phonePrefix} ${formData.phoneNumber}`,
            whatsappNumber: formData.useWhatsappForPhone
                ? `${formData.phonePrefix} ${formData.phoneNumber}`
                : `${formData.whatsappPrefix} ${formData.whatsappNumber}`
        };

        const priceValue = "Sur devis";

        try {
            await sendBookingEmail("Garde Malade", bookingData, priceValue, false);
            router.push(window.location.pathname + "/merci");
        } catch (error) {
            toast.error("Une erreur est survenue lors de l'envoi de votre demande.");
        }
    };

    const handleCloseConfirmation = (open: boolean) => {
        setShowConfirmation(open);
        if (!open) {
            setWasValidated(false);
            setFormData(INITIAL_FORM_DATA);
        }
    };

    const incrementPeople = () => setFormData({ ...formData, numberOfPeople: formData.numberOfPeople + 1 });
    const decrementPeople = () => setFormData({ ...formData, numberOfPeople: Math.max(1, formData.numberOfPeople - 1) });

    const incrementDays = () => setFormData({ ...formData, numberOfDays: formData.numberOfDays + 1 });
    const decrementDays = () => setFormData({ ...formData, numberOfDays: Math.max(1, formData.numberOfDays - 1) });

    const frequencies = FREQUENCES;

    const getFrequencyLabel = (value: string, subValue: string) => {
        if (value === "oneshot") return "Une fois - Tranche de 24h";
        const freq = frequencies.find(f => f.value === subValue);
        return freq ? `Abonnement - ${freq.label}` : "Abonnement";
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1 flex flex-col bg-[hsl(var(--primary)/0.05)]" style={{ "--primary": SERVICE_COLORS.GARDE_MALADE.hsl } as React.CSSProperties}>
                <ServiceHeroSection
                    title="Auxiliaires de vie / Garde malade"
                    description={`Le service d'auxiliaires de vie / garde malade à domicile à Casablanca, proposé par Agence Ménage, met à votre disposition des auxiliaires de vie à domicile expérimentées pour accompagner les patients dans leur quotidien, avec sérieux, discrétion et bienveillance.

Nos auxiliaires de vie assurent une présence 24h/24, 7j/7, selon les besoins en journée, la nuit, ou en continu. Elles interviennent auprès des personnes âgées ou en situation de dépendance.`}
                    image={gardeMaladeHero.src}
                    primaryColor={SERVICE_COLORS.GARDE_MALADE.hex}
                    faqs={[
                        {
                            question: "Quelles sont l'expérience et les qualifications de vos auxiliaires de vie ?",
                            answer: "Confier un proche vulnérable exige une confiance absolue. Toutes nos auxiliaires de vie possèdent une solide expérience sur le terrain avec des références rigoureusement contrôlées. Elles sont qualifiées pour gérer des situations variées, allant de la simple compagnie pour les seniors jusqu'à l'assistance complète pour des pathologies lourdes (Alzheimer, Parkinson, paralysie). De plus, toutes nos intervenantes savent parfaitement lire et écrire, une compétence indispensable pour le bon suivi des prescriptions médicales."
                        },
                        {
                            question: "Quelles tâches exactes prenez-vous en charge au quotidien ?",
                            answer: "Nos gardes malades assurent l'ensemble des gestes essentiels pour le confort de votre proche : aide à la toilette (incluant le change), préparation et aide à la prise des repas, rappel de la prise de médicaments et accompagnement moral. Cependant, notre cadre d'intervention est strictement non médical : nous n'effectuons aucun acte infirmier (administration d'oxygène, prises de sang, soins de plaies ou kinésithérapie)."
                        },
                        {
                            question: "Dois-je m'engager sur une semaine complète ou proposez-vous des interventions courtes ?",
                            answer: "Vous bénéficiez d'une flexibilité totale pour vous adapter à l'état de santé de votre proche. Vous pouvez faire appel à nous pour quelques heures par jour (pour les repas ou les médicaments), pour remplacer votre auxiliaire de vie habituelle pendant son jour de repos, ou pour un besoin temporaire de quelques jours (par exemple, suite à une opération chirurgicale). Vous ne réservez que ce dont vous avez réellement besoin."
                        },
                        {
                            question: "Proposez-vous des gardes de nuit et que se passe-t-il si l'intervenante est absente ?",
                            answer: "La sécurité et le bien-être de vos proches ne s'arrêtent jamais. Nous pouvons intervenir 24h/24 et 7j/7, y compris les jours fériés. Par ailleurs, la continuité des soins est notre priorité absolue : en cas d'indisponibilité imprévue de votre auxiliaire de vie habituelle, nous garantissons son remplacement immédiat par un profil tout aussi expérimenté de notre agence."
                        }
                    ]}
                />

                <section className="bg-primary/5 py-8">
                    <div className="container px-6 relative">
                        <button
                            onClick={() => window.history.back()}
                            className="absolute -top-4 md:-top-8 left-0 xl:-left-4 p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
                            aria-label="Retour"
                        >
                            <ArrowLeft size={24} />
                        </button>

                        <div className="grid md:grid-cols-2 gap-16 items-center text-left py-12">
                            <div className="space-y-6">
                                <p className="text-xl text-slate-700 leading-relaxed font-bold">
                                    Nos auxiliaires de vie assurent une présence 24h/24, 7j/7, selon les besoins en journée, la nuit, ou en continu. Elles interviennent auprès des personnes âgées, des personnes en situation de dépendance, qu'elles en soient venues suite à une hospitalisation ou nécessitant simplement une présence rassurante à domicile.
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-80 h-80 rounded-full overflow-hidden border-[12px] border-white shadow-2xl ring-1 ring-primary/20">
                                    <img src={handsCare.src} alt="Mains soin" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-16 items-center text-right py-12">
                            <div className="flex justify-center md:order-first order-last text-left">
                                <div className="w-80 h-80 rounded-[3rem] rotate-6 overflow-hidden border-[12px] border-white shadow-2xl ring-1 ring-primary/20">
                                    <img src={caregiverVisit.src} alt="Visite soin" className="w-full h-full object-cover -rotate-6 scale-125" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <p className="text-xl text-slate-700 leading-relaxed font-bold">
                                    L'objectif est de garantir un cadre de vie confortable et sécurisant, tout en soutenant la famille au quotidien. Nos garde-malades / auxiliaires de vie veillent notamment à l'hygiène au confort, à l'aide à la mobilité et aux soins du corps, ainsi qu'à l'accompagnement dans les gestes de la vie courante. Elles contribuent également au bien-être moral de la personne aidée en créant un climat serein et une écoute active avec les proches.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/90 p-12 rounded-[3.5rem] shadow-2xl border-4 border-primary/10 max-w-3xl mx-auto relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                            <p className="text-2xl font-black text-primary leading-snug italic mb-4">
                                "Avec Agence Ménage, vous bénéficiez d'un service fiable et humain, dans un environnement familial afin de préserver la qualité de vie du patient et d'apporter de la sérénité à toute la famille."
                            </p>
                            <p className="text-primary/80 font-bold text-lg">Un assistant social et garde-malade vous rappelleront pour valider les points essentiels.</p>
                        </div>

                        <div className="pt-12 text-center">
                            <Button
                                onClick={scrollToForm}
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-xl font-bold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 h-auto uppercase"
                            >
                                Contactez-nous
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Reservation Form Container - Opens at the end of the page */}
                {showForm && (
                    <div
                        ref={formRef}
                        className="py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both"
                    >
                        <div className="container max-w-5xl px-6">
                            <div className="bg-primary/5 rounded-lg p-6 text-center mb-8 border border-primary/20">
                                <h2 className="text-2xl font-bold text-primary mb-2 uppercase tracking-wide">
                                    FORMULAIRE DE RESERVATION
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} noValidate className={`flex flex-col lg:grid lg:grid-cols-3 gap-8 ${wasValidated ? 'was-validated' : ''}`}>
                                <div className="lg:col-span-1 lg:order-last sticky-reservation-summary-container">
                                    <div className="lg:sticky lg:top-24 space-y-6">
                                        <div className="bg-primary/5 rounded-lg border border-primary/20 shadow-sm p-6 space-y-4">
                                            <h3 className="text-xl font-bold text-primary border-b border-primary/10 pb-2 text-center">
                                                Ma Réservation
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between gap-4 border-b border-primary/5 pb-2">
                                                    <span className="text-muted-foreground transition-all duration-300">Service:</span>
                                                    <span className="font-medium text-right text-primary">Garde Malade</span>
                                                </div>

                                                {/* Detailed info - hidden on mobile when collapsed */}
                                                <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                    <div className="flex justify-between gap-4">
                                                        <span className="text-muted-foreground">Fréquence:</span>
                                                        <span className="font-medium text-right text-slate-700 text-sm">
                                                            {getFrequencyLabel(formData.frequency, formData.subFrequency)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between gap-4">
                                                        <span className="text-muted-foreground">Jours:</span>
                                                        <span className="font-medium text-right text-slate-700">{formData.numberOfDays}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4">
                                                        <span className="text-muted-foreground">Personnes:</span>
                                                        <span className="font-medium text-right text-slate-700">{formData.numberOfPeople}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4 border-t border-primary/5 pt-2">
                                                        <span className="text-muted-foreground text-sm">Date début:</span>
                                                        <span className="font-medium text-right text-slate-700 text-sm">{formData.schedulingDate || "Non définie"}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4 border-b border-primary/5 pb-2">
                                                        <span className="text-muted-foreground text-sm">Heure:</span>
                                                        <span className="font-medium text-right text-slate-700 text-sm">
                                                            {formData.schedulingType === "fixed" ? formData.fixedTime : (formData.schedulingTime === "morning" ? "Le matin" : "L'après midi")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-primary/20">
                                                <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg border border-primary/10">
                                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                                        Estimation
                                                    </span>
                                                    <span className="text-lg font-black text-primary">
                                                        SUR DEVIS
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Toggle Button for Mobile */}
                                        <button
                                            type="button"
                                            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                            className="lg:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white z-20 hover:bg-primary/90 transition-transform active:scale-90"
                                        >
                                            {isSummaryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white rounded-lg p-4 md:p-6 border shadow-sm space-y-10">
                                        {/* Frequency Section */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                                Choisissez la fréquence
                                            </h3>
                                            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                                <div className="flex flex-col items-center gap-6">
                                                    <div className="flex bg-slate-100 p-1 rounded-full w-full max-w-md mx-auto">
                                                        <button
                                                            type="button"
                                                            className={`flex-1 py-3 px-6 rounded-full font-bold transition-all ${formData.frequency === "oneshot"
                                                                ? "bg-primary text-white shadow-sm"
                                                                : "text-slate-500 hover:text-primary"
                                                                }`}
                                                            onClick={() => setFormData({ ...formData, frequency: "oneshot", subFrequency: "" })}
                                                        >
                                                            Une fois
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`flex-1 py-3 px-6 rounded-full font-bold transition-all ${formData.frequency === "subscription"
                                                                ? "bg-primary text-white shadow-sm"
                                                                : "text-slate-500 hover:text-primary"
                                                                }`}
                                                            onClick={() => setFormData({ ...formData, frequency: "subscription" })}
                                                        >
                                                            Abonnement
                                                        </button>
                                                    </div>

                                                    {formData.frequency === "subscription" && (
                                                        <div className="w-full animate-in fade-in slide-in-from-top-2 duration-300">
                                                            <Select
                                                                value={formData.subFrequency}
                                                                onValueChange={(value) => setFormData({ ...formData, subFrequency: value })}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Sélectionnez une fréquence" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {frequencies.map((freq) => (
                                                                        <SelectItem key={freq.value} value={freq.value}>
                                                                            {freq.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* People Section */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                                Nombre de personne
                                            </h3>
                                            <div className="flex items-center justify-center gap-8 p-6 bg-slate-50/50 rounded-xl border border-slate-100">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 rounded-full bg-slate-200 text-primary hover:bg-slate-300"
                                                    onClick={decrementPeople}
                                                >
                                                    <span className="text-2xl">-</span>
                                                </Button>
                                                <span className="text-2xl font-bold text-primary min-w-[40px] text-center">
                                                    {formData.numberOfPeople}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 rounded-full bg-slate-200 text-primary hover:bg-slate-300"
                                                    onClick={incrementPeople}
                                                >
                                                    <span className="text-2xl">+</span>
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Planning Section */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                                Planning de la demande
                                            </h3>
                                            <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-100 space-y-8">
                                                <div className="grid md:grid-cols-3 gap-6">
                                                    {/* Heure fixe */}
                                                    <div className="text-center space-y-3">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <input
                                                                type="radio"
                                                                id="garde-fixed"
                                                                name="schedulingType"
                                                                checked={formData.schedulingType === "fixed"}
                                                                onChange={() => setFormData({ ...formData, schedulingType: "fixed" })}
                                                                className="w-4 h-4 text-primary"
                                                            />
                                                            <Label htmlFor="garde-fixed" className="font-bold text-primary text-sm cursor-pointer text-center">Je souhaite une heure fixe</Label>
                                                        </div>
                                                        <div className="flex justify-center">
                                                            <input
                                                                type="time"
                                                                required
                                                                value={formData.fixedTime}
                                                                onChange={(e) => setFormData({ ...formData, fixedTime: e.target.value })}
                                                                disabled={formData.schedulingType !== "fixed"}
                                                                className="w-32 text-center text-xl font-bold h-12 border-primary/30 rounded-md border"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Flexible */}
                                                    <div className="text-center space-y-3">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <input
                                                                type="radio"
                                                                id="garde-flexible"
                                                                name="schedulingType"
                                                                checked={formData.schedulingType === "flexible"}
                                                                onChange={() => setFormData({ ...formData, schedulingType: "flexible" })}
                                                                className="w-4 h-4 text-primary"
                                                            />
                                                            <Label htmlFor="garde-flexible" className="font-bold text-primary text-sm cursor-pointer text-center">Je suis flexible</Label>
                                                        </div>
                                                        <RadioGroup
                                                            value={formData.schedulingTime}
                                                            onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })}
                                                            disabled={formData.schedulingType !== "flexible"}
                                                            className="space-y-2 text-left inline-block"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="morning" id="garde-morning" className="border-primary text-primary" />
                                                                <Label htmlFor="garde-morning" className="text-sm font-medium">Le matin</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="afternoon" id="garde-afternoon" className="border-primary text-primary" />
                                                                <Label htmlFor="garde-afternoon" className="text-sm font-medium">L'après midi</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </div>

                                                    {/* Date */}
                                                    <div className="text-center space-y-3">
                                                        <div className="font-bold text-primary text-sm">Date</div>
                                                        <Input
                                                            type="date"
                                                            required
                                                            value={formData.schedulingDate}
                                                            onChange={(e) => setFormData({ ...formData, schedulingDate: e.target.value })}
                                                            className="w-full border-slate-300"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-dashed border-slate-300 flex flex-col items-center gap-4">
                                                    <Label className="text-sm font-bold text-slate-600">Nombre de jours</Label>
                                                    <div className="flex items-center gap-6 bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm transition-all duration-300">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full bg-slate-100 text-primary hover:bg-slate-200"
                                                            onClick={decrementDays}
                                                        >-</Button>
                                                        <span className="font-bold text-slate-700 uppercase text-sm">
                                                            {formData.numberOfDays} JOUR(S)
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full bg-slate-100 text-primary hover:bg-slate-200"
                                                            onClick={incrementDays}
                                                        >+</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Patient Profile Section */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                                Profil de la personne aidée
                                            </h3>
                                            <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-100 space-y-8">
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-600">Âge :</Label>
                                                        <div className="relative">
                                                            <Input
                                                                placeholder="Âge de la personne"
                                                                value={formData.patientAge}
                                                                onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                                                                className="pr-12"
                                                            />
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">ANS</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-600">Sexe :</Label>
                                                        <RadioGroup
                                                            value={formData.patientGender}
                                                            onValueChange={(value) => setFormData({ ...formData, patientGender: value })}
                                                            className="flex gap-6 pt-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="femme" id="patient-femme" className="border-primary text-primary" />
                                                                <Label htmlFor="patient-femme" className="text-sm font-medium">Femme</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="homme" id="patient-homme" className="border-primary text-primary" />
                                                                <Label htmlFor="patient-homme" className="text-sm font-medium">Homme</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <Label className="text-sm font-bold text-slate-600">Mobilité et Type :</Label>
                                                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                                                            <RadioGroup
                                                                value={formData.mobility}
                                                                onValueChange={(value) => setFormData({ ...formData, mobility: value })}
                                                                className="grid grid-cols-1 gap-2"
                                                            >
                                                                {["Adulte", "Personne Agée", "Autonome", "Besoin d'aide", "Alité(e)"].map((mob) => (
                                                                    <div key={mob} className="flex items-center space-x-2">
                                                                        <RadioGroupItem
                                                                            value={mob}
                                                                            id={`mob-${mob}`}
                                                                            className="border-primary text-primary"
                                                                        />
                                                                        <Label htmlFor={`mob-${mob}`} className="text-xs font-medium text-slate-700">{mob}</Label>
                                                                    </div>
                                                                ))}
                                                            </RadioGroup>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4 flex flex-col">
                                                        <Label className="text-sm font-bold text-slate-600">Pathologie :</Label>
                                                        <Textarea
                                                            required
                                                            value={formData.healthIssues}
                                                            onChange={(e) => setFormData({ ...formData, healthIssues: e.target.value })}
                                                            className="flex-1 min-h-[120px] text-sm resize-none"
                                                            placeholder="Détaillez ici la situation médicale..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Notes */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                                Autre précision
                                            </h3>
                                            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                                <Textarea
                                                    required
                                                    value={formData.additionalNotes}
                                                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                                                    className="min-h-[80px] text-sm resize-none"
                                                    placeholder="Ex: besoin d'un auxiliaire de vie homme, barrière de langue, régime particulier..."
                                                />
                                            </div>
                                        </div>

                                        {/* Location Section */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                                Lieu de la garde
                                            </h3>
                                            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                                <RadioGroup
                                                    value={formData.careLocation}
                                                    onValueChange={(value) => setFormData({ ...formData, careLocation: value })}
                                                    className="grid grid-cols-3 gap-4"
                                                >
                                                    {["Domicile", "Clinique", "Hôpital"].map((location) => (
                                                        <div key={location} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer group ${formData.careLocation === location.toLowerCase() ? 'border-primary bg-white' : 'border-transparent bg-white/50 hover:bg-white'}`}>
                                                            <RadioGroupItem value={location.toLowerCase()} id={`garde-${location}`} className="mb-2 border-primary text-primary" />
                                                            <Label htmlFor={`garde-${location}`} className="font-bold text-xs text-slate-700 cursor-pointer">{location}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </div>
                                        </div>

                                        {/* Address Section */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                                Adresse du lieu de la garde
                                            </h3>
                                            <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-100 space-y-6">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-600">Ville</Label>
                                                        <Input
                                                            placeholder="ex: Casablanca"
                                                            required
                                                            value={formData.city}
                                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                            className="h-10"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-600">Adresse (Quartier)</Label>
                                                        <Input
                                                            placeholder="Quartier"
                                                            required
                                                            value={formData.neighborhood}
                                                            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                            className="h-10"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-bold text-slate-600">Champs de repère</Label>
                                                    <Textarea
                                                        placeholder="Donnez-nous des repères visuels proches (Mosquée, École, Pharmacie...)"
                                                        required
                                                        value={formData.careAddress}
                                                        onChange={(e) => setFormData({ ...formData, careAddress: e.target.value })}
                                                        className="min-h-[60px] text-sm resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Personal Info Section */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                                Mes coordonnées
                                            </h3>
                                            <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-100 space-y-6">
                                                <div className="bg-primary/5 p-4 rounded-lg text-center border border-primary/10">
                                                    <p className="text-primary text-xs font-bold italic">"Un chargé de clientèle prendra contact avec vous dans les plus brefs delais."</p>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-600">Téléphone*</Label>
                                                        <div className="space-y-3">
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    value={formData.phonePrefix}
                                                                    onChange={(e) => setFormData(prev => ({
                                                                        ...prev,
                                                                        phonePrefix: e.target.value,
                                                                        whatsappPrefix: prev.useWhatsappForPhone ? e.target.value : prev.whatsappPrefix
                                                                    }))}
                                                                    className="w-20 font-bold text-primary text-xs text-center"
                                                                    placeholder="+212"
                                                                />
                                                                <Input
                                                                    placeholder="6 00 00 00 00"
                                                                    value={formData.phoneNumber}
                                                                    onChange={(e) => {
                                                                        const newVal = e.target.value;
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            phoneNumber: newVal,
                                                                            whatsappNumber: prev.useWhatsappForPhone ? newVal : prev.whatsappNumber
                                                                        }));
                                                                    }}
                                                                    required
                                                                    className="h-10 flex-1"
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
                                                                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                                                                >
                                                                    Utilisez-vous ce numéro pour WhatsApp ?
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-600">WhatsApp*</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={formData.whatsappPrefix}
                                                                onChange={(e) => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                                                                className="bg-slate-100 border rounded-lg w-20 text-center font-bold text-primary text-xs"
                                                                placeholder="+212"
                                                                disabled={formData.useWhatsappForPhone}
                                                            />
                                                            <Input
                                                                placeholder="6 00 00 00 00"
                                                                value={formData.whatsappNumber}
                                                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                                                className="h-10"
                                                                disabled={formData.useWhatsappForPhone}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-600">Nom*</Label>
                                                        <Input
                                                            placeholder="Votre nom"
                                                            value={formData.lastName}
                                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                            required
                                                            className="h-10"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-600">Prénom*</Label>
                                                        <Input
                                                            placeholder="Votre prénom"
                                                            value={formData.firstName}
                                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                            required
                                                            className="h-10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center pt-8">
                                            <Button
                                                type="submit"
                                                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-bold shadow-lg shadow-primary/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95"
                                            >
                                                Demander un devis
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <OtherServices type="particulier" currentServiceUrl="/services/particulier/garde-malade" />

            <Footer />

            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md bg-white border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed whitespace-pre-line">
                            {getConfirmationMessage(`${formData.firstName} ${formData.lastName}`, totalPrice === 0)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button
                            onClick={() => handleCloseConfirmation(false)}
                            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8"
                        >
                            Fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
