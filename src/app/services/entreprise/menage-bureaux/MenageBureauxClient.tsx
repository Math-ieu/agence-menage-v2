"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceHeroSection from "@/components/ServiceHeroSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import serviceBureaux from "@/assets/service-menage-bureaux.png";
import { getConfirmationMessage } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
import { calculateSurchargeMultiplier } from "@/lib/pricing";
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

const INITIAL_FORM_DATA = {
    officeSurface: "0-70",
    frequency: "oneshot",
    subFrequency: "",
    duration: 2,
    numberOfPeople: 1,
    city: "Casablanca",
    neighborhood: "",
    schedulingTime: "morning",
    schedulingDate: "",
    schedulingType: "flexible",
    fixedTime: "14:00",
    additionalServices: {
        produitsEtOutils: false,
        torchonsEtSerpierres: false
    },
    phoneNumber: "",
    phonePrefix: "+212",
    useWhatsappForPhone: true,
    whatsappPrefix: "+212",
    whatsappNumber: "",
    entityName: "",
    contactPerson: "",
    email: "",
    changeRepereNotes: ""
};

export default function MenageBureauxClient() {
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const calculateResources = (range: string) => {
        switch (range) {
            case "0-70": return { duration: 2, people: 1 };
            case "71-150": return { duration: 4, people: 1 };
            case "151-300": return { duration: 8, people: 1 };
            case "300+": return { duration: 8, people: 2 };
            default: return { duration: 2, people: 1 };
        }
    };

    const handleSurfaceChange = (range: string) => {
        const { duration, people } = calculateResources(range);
        setFormData({
            ...formData,
            officeSurface: range,
            duration,
            numberOfPeople: people
        });
    };

    const handleIncrementDuration = () => {
        setFormData(prev => ({ ...prev, duration: prev.duration + 1 }));
    };

    const handleDecrementDuration = () => {
        const minResources = calculateResources(formData.officeSurface);
        if (formData.duration > minResources.duration) {
            setFormData(prev => ({ ...prev, duration: prev.duration - 1 }));
        }
    };

    const handleIncrementPeople = () => {
        setFormData(prev => ({ ...prev, numberOfPeople: prev.numberOfPeople + 1 }));
    };

    const handleDecrementPeople = () => {
        const minResources = calculateResources(formData.officeSurface);
        if (formData.numberOfPeople > minResources.people) {
            setFormData(prev => ({ ...prev, numberOfPeople: prev.numberOfPeople - 1 }));
        }
    };

    const multiplier = calculateSurchargeMultiplier(
        formData.schedulingDate,
        formData.schedulingType,
        formData.fixedTime,
        formData.schedulingTime
    );

    const perVisitBasePrice = formData.duration * formData.numberOfPeople * 60 * multiplier;
    const productsPrice = formData.additionalServices.produitsEtOutils ? 90 : 0;
    const torchonsPrice = formData.additionalServices.torchonsEtSerpierres ? 40 : 0;
    const perVisitTotal = perVisitBasePrice + productsPrice + torchonsPrice;

    let totalPrice = 0;
    let discountAmount = 0;
    const discountRate = 0.1;

    if (formData.frequency === "subscription") {
        const visitsMap: Record<string, number> = {
            "1foisParSemaine": 1,
            "2foisParSemaine": 2,
            "3foisParSemaine": 3,
            "4foisParSemaine": 4,
            "5foisParSemaine": 5,
            "6foisParSemaine": 6,
            "7foisParSemaine": 7,
            "3foisParMois": 3 / 4,
            "2foisParMois": 0.5,
            "1foisParMois": 0.25,
            "4foisParMois": 1,
        };
        const visitsPerWeek = visitsMap[formData.subFrequency] || 1;
        const subtotalMonthly = perVisitTotal * visitsPerWeek * 4;
        discountAmount = subtotalMonthly * discountRate;
        totalPrice = subtotalMonthly - discountAmount;
    } else {
        totalPrice = perVisitTotal;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasValidated(true);

        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        if (!formData.entityName || !formData.contactPerson || !formData.phoneNumber || !formData.city || !formData.neighborhood || !formData.schedulingDate) {
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

        try {
            await sendBookingEmail("Ménage Bureaux", bookingData, totalPrice, true);
            setShowConfirmation(true);
        } catch (error) {
            toast.error("Une erreur est survenue lors de l'envoi de votre demande.");
        }
    };

    const handleCloseConfirmation = (open: boolean) => {
        setShowConfirmation(open);
        if (!open) {
            setFormData(INITIAL_FORM_DATA);
            setWasValidated(false);
        }
    };

    const frequencies = FREQUENCES;

    const getFrequencyLabel = (value: string, subValue: string) => {
        if (value === "oneshot") return "Une fois";
        const freq = frequencies.find(f => f.value === subValue);
        return freq ? `Abonnement - ${freq.label}` : "Abonnement";
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div style={{ "--primary": "69 66% 51%" } as React.CSSProperties}>
                <ServiceHeroSection
                    title="Ménage Bureaux"
                    description="Nettoyage des espaces de travail afin de garantir un environnement propre, sain et agréable pour les employés et les visiteurs. La prestation comprend : Le dépoussiérage des bureaux, plans de travail et surfaces accessibles, Le nettoyage des sols (balayage, serpière…), Le vidage des poubelles, Le nettoyage des vitres accessibles, L’entretien des espaces communs (salles de réunion, couloirs, cuisine, escaliers), nettoyage des bureaux, chaises, sols, toilettes… ainsi que les balcons, escaliers lorsqu’ils sont accessibles."
                    image={serviceBureaux.src}
                    primaryColor="#c7dd54"
                    faqs={[
                        {
                            question: "Intervenez-vous en dehors des heures de bureau ?",
                            answer: "Oui, nous pouvons planifier les passages tôt le matin ou en soirée pour ne pas gêner le travail de vos collaborateurs."
                        },
                        {
                            question: "Le personnel est-il formé à la discrétion ?",
                            answer: "Absolument. Nos agents sont formés au respect de la confidentialité et à la discrétion nécessaire dans un environnement professionnel."
                        },
                        {
                            question: "Fournissez-vous les consommables (savon, papier) ?",
                            answer: "Nous pouvons intégrer la gestion des stocks et la recharge de vos consommables sanitaires dans notre forfait sur simple demande."
                        },
                        {
                            question: "Comment gérez-vous les clés de nos bureaux ?",
                            answer: "Nous avons une procédure rigoureuse de gestion des clés. Elles sont tracées et conservées en sécurité dans un coffre-fort au sein de notre agence."
                        }
                    ]}
                />

                <main className="flex-1 bg-background py-12">
                    <div className="container max-w-5xl">
                        <div className="bg-[#f2f8d9] rounded-lg p-6 text-center mb-8 border border-[#d6e792]">
                            <h2 className="text-2xl font-bold text-primary mb-2 uppercase tracking-wide">
                                FORMULAIRE DE RESERVATION
                            </h2>
                        </div>
                        <form id="booking-form" onSubmit={handleSubmit} noValidate className={`flex flex-col lg:grid lg:grid-cols-3 gap-8 ${wasValidated ? 'was-validated' : ''}`}>
                            <div className="lg:col-span-1 lg:order-last sticky-reservation-summary-container">
                                <div className="lg:sticky lg:top-24 space-y-6">
                                    <div className="bg-primary/5 rounded-lg border shadow-sm p-6 space-y-4 relative">
                                        <h3 className="text-xl font-bold text-primary border-b pb-2 text-center">
                                            Ma Réservation
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between gap-4 border-b border-primary/10 pb-2">
                                                <span className="text-muted-foreground">Service:</span>
                                                <span className="font-medium text-right">Ménage Bureaux</span>
                                            </div>

                                            {/* Detailed info - hidden on mobile when collapsed */}
                                            <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Fréquence:</span>
                                                    <span className="font-medium text-right text-sm">
                                                        {getFrequencyLabel(formData.frequency, formData.subFrequency)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Superficie:</span>
                                                    <span className="font-medium text-right">
                                                        {formData.officeSurface === "300+" ? "300m² et plus" : `${formData.officeSurface} m²`}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Personnes:</span>
                                                    <span className="font-medium text-right">{formData.numberOfPeople}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Durée:</span>
                                                    <span className="font-medium text-right">{formData.duration}h</span>
                                                </div>
                                                {formData.additionalServices.produitsEtOutils && (
                                                    <div className="flex justify-between gap-4 text-xs">
                                                        <span className="text-muted-foreground">Produits:</span>
                                                        <span className="font-medium text-right text-slate-700">+90 MAD</span>
                                                    </div>
                                                )}
                                                {formData.additionalServices.torchonsEtSerpierres && (
                                                    <div className="flex justify-between gap-4 text-xs">
                                                        <span className="text-muted-foreground">Torchons:</span>
                                                        <span className="font-medium text-right text-slate-700">+40 MAD</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between gap-4 border-t border-primary/10 pt-2">
                                                    <span className="text-muted-foreground">Date:</span>
                                                    <span className="font-medium text-right">{formData.schedulingDate || "Non définie"}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Heure:</span>
                                                    <span className="font-medium text-right text-slate-700">
                                                        {formData.schedulingType === "fixed" ? formData.fixedTime : (formData.schedulingTime === "morning" ? "Le matin" : "L'après midi")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t">
                                            {formData.frequency === "subscription" && discountAmount > 0 && (
                                                <div className="flex justify-between gap-4 text-red-600 font-bold bg-red-50 p-2 rounded mb-4 text-xs">
                                                    <span>Réduction (10%):</span>
                                                    <span>-{Math.round(discountAmount)} MAD</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold">
                                                    {formData.frequency === "subscription" ? "Total Mensuel HT" : "Total HT"}
                                                </span>
                                                <span className="text-2xl font-bold text-primary">
                                                    {totalPrice > 0 ? `${Math.round(totalPrice)} MAD` : "0 MAD"}
                                                </span>
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
                            </div>

                            <div className="lg:col-span-2 space-y-8">

                                <div className="bg-card rounded-lg p-4 md:p-6 border shadow-sm space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                            Superficie de votre cadre en M²
                                        </h3>
                                        <div className="p-6 bg-muted/30 rounded-xl border border-muted">
                                            <p className="text-center text-red-500 text-xs font-bold mb-4 italic">
                                                Indiquez le nombre total de m² de l'espace à prendre en compte (ex. 70 m²).
                                            </p>
                                            <div className="grid grid-cols-2 gap-6">
                                                {[
                                                    { range: "0-70", label: "0m² - 70 m²" },
                                                    { range: "71-150", label: "71m² - 150 m²" },
                                                    { range: "151-300", label: "151m² - 300 m²" },
                                                    { range: "300+", label: "300m² et plus" }
                                                ].map((item) => (
                                                    <div
                                                        key={item.range}
                                                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer group ${formData.officeSurface === item.range ? 'border-primary bg-white shadow-md' : 'border-transparent bg-white/50 hover:bg-white'}`}
                                                        onClick={() => handleSurfaceChange(item.range)}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border-2 mb-2 flex items-center justify-center ${formData.officeSurface === item.range ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                            {formData.officeSurface === item.range && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        </div>
                                                        <span className={`font-bold text-sm ${formData.officeSurface === item.range ? 'text-primary' : 'text-muted-foreground'}`}>
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4">
                                            Choisissez la fréquence
                                        </h3>
                                        <div className="p-4 bg-muted/30 rounded space-y-4">
                                            <div className="p-4 space-y-4">
                                                <div className="flex flex-col items-center gap-4">
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
                                                                    <SelectValue placeholder="Sélectionnez un abonnement" />
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
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                            Durée estimée
                                        </h3>
                                        <div className="flex items-center justify-center p-6 bg-muted/30 rounded-xl border border-muted">
                                            <div className="flex items-center gap-6">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-12 w-12 rounded-full bg-white border border-slate-200 text-primary hover:bg-slate-50 shadow-sm"
                                                    onClick={handleDecrementDuration}
                                                    disabled={formData.duration <= calculateResources(formData.officeSurface).duration}
                                                >
                                                    <span className="text-2xl font-bold pb-1">-</span>
                                                </Button>
                                                <div className="bg-white px-8 py-4 rounded-full border border-muted shadow-sm flex flex-col items-center min-w-[140px]">
                                                    <span className="text-3xl font-black text-primary">{formData.duration}</span>
                                                    <span className="text-sm font-bold text-muted-foreground uppercase">Heures</span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-12 w-12 rounded-full bg-white border border-slate-200 text-primary hover:bg-slate-50 shadow-sm"
                                                    onClick={handleIncrementDuration}
                                                >
                                                    <span className="text-2xl font-bold pb-1">+</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                            Nombre de personne
                                        </h3>
                                        <div className="flex items-center justify-center p-6 bg-muted/30 rounded-xl border border-muted">
                                            <div className="flex items-center gap-6">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-12 w-12 rounded-full bg-white border border-slate-200 text-primary hover:bg-slate-50 shadow-sm"
                                                    onClick={handleDecrementPeople}
                                                    disabled={formData.numberOfPeople <= calculateResources(formData.officeSurface).people}
                                                >
                                                    <span className="text-2xl font-bold pb-1">-</span>
                                                </Button>
                                                <div className="bg-white px-8 py-4 rounded-full border border-muted shadow-sm flex flex-col items-center min-w-[140px]">
                                                    <span className="text-3xl font-black text-primary">{formData.numberOfPeople}</span>
                                                    <span className="text-sm font-bold text-muted-foreground uppercase">Personne(s)</span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-12 w-12 rounded-full bg-white border border-slate-200 text-primary hover:bg-slate-50 shadow-sm"
                                                    onClick={handleIncrementPeople}
                                                >
                                                    <span className="text-2xl font-bold pb-1">+</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                            Où aura lieu votre ménage ?
                                        </h3>
                                        <div className="p-6 bg-muted/30 rounded-xl border border-muted space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-muted-foreground uppercase">Ville</Label>
                                                    <Input
                                                        placeholder="ex: Casablanca"
                                                        required
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        className="bg-white"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-muted-foreground uppercase">Adresse (Quartier)</Label>
                                                    <Input
                                                        placeholder="Quartier"
                                                        required
                                                        value={formData.neighborhood}
                                                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                        className="bg-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Champs de repère</Label>
                                                <Textarea
                                                    placeholder="Donnez-nous des repères visuels proches (Mosquée, École, Pharmacie...)"
                                                    required
                                                    value={formData.changeRepereNotes}
                                                    onChange={(e) => setFormData({ ...formData, changeRepereNotes: e.target.value })}
                                                    className="bg-white min-h-[80px] text-sm resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4">
                                            Planning pour votre demande
                                        </h3>
                                        <div className="grid md:grid-cols-3 gap-6 p-4 border rounded-xl bg-white shadow-sm">
                                            {/* Heure fixe */}
                                            <div className="text-center space-y-3">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="bureau-fixed"
                                                        name="schedulingType"
                                                        checked={formData.schedulingType === "fixed"}
                                                        onChange={() => setFormData({ ...formData, schedulingType: "fixed" })}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <Label htmlFor="bureau-fixed" className="font-bold text-primary text-sm cursor-pointer text-center">Je souhaite une heure fixe</Label>
                                                </div>
                                                <div className="flex justify-center">
                                                    <input
                                                        type="time"
                                                        required
                                                        value={formData.fixedTime}
                                                        onChange={(e) => setFormData({ ...formData, fixedTime: e.target.value })}
                                                        disabled={formData.schedulingType !== "fixed"}
                                                        className="w-32 text-center text-xl font-bold h-12 border-primary border h-10 rounded-md"
                                                    />
                                                </div>
                                            </div>

                                            {/* Flexible */}
                                            <div className="text-center space-y-3">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="bureau-flexible"
                                                        name="schedulingType"
                                                        checked={formData.schedulingType === "flexible"}
                                                        onChange={() => setFormData({ ...formData, schedulingType: "flexible" })}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <Label htmlFor="bureau-flexible" className="font-bold text-primary text-sm cursor-pointer text-center">Je suis flexible</Label>
                                                </div>
                                                <RadioGroup
                                                    value={formData.schedulingTime}
                                                    onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })}
                                                    disabled={formData.schedulingType !== "flexible"}
                                                    className="space-y-2 text-left inline-block"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="morning" id="bureau-morning" />
                                                        <Label htmlFor="bureau-morning">Le matin</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="afternoon" id="bureau-afternoon" />
                                                        <Label htmlFor="bureau-afternoon">L'après midi</Label>
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
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                            Services optionnels
                                        </h3>
                                        <div className="p-6 bg-muted/30 rounded-xl border border-muted space-y-6">
                                            <div className="bg-white p-6 rounded-xl border border-muted flex flex-col items-center gap-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <p className="text-sm font-bold text-slate-800 mb-1">Produit fournis par l'agence ménage :</p>
                                                    <p className="text-[10px] text-slate-500 italic max-w-xs">• Nettoyant multi-usage • Nettoyant vitres • Désinfectants • Produit sols • Kit de nettoyage complet</p>
                                                </div>
                                                <div className="flex items-center justify-between w-full pt-4 border-t">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-lg bg-pink-50 flex items-center justify-center">
                                                            <span className="text-2xl">🧴</span>
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-bold text-slate-700 leading-tight">Prix HT : 90 MAD</p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={formData.additionalServices.produitsEtOutils}
                                                        onCheckedChange={(checked) =>
                                                            setFormData({
                                                                ...formData,
                                                                additionalServices: { ...formData.additionalServices, produitsEtOutils: checked }
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="bg-[#f0f9ff] p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                                        <span className="text-2xl">🧹</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-700">Torchons et serpières : + 40 MAD</p>
                                                </div>
                                                <Switch
                                                    checked={formData.additionalServices.torchonsEtSerpierres}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            additionalServices: { ...formData.additionalServices, torchonsEtSerpierres: checked }
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-muted/30 rounded-xl p-6 border border-muted">
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-6 uppercase">
                                            Les informations
                                        </h3>
                                        <p className="text-xs font-bold text-center text-slate-500 mb-6 uppercase tracking-wider">
                                            Un chargé de clientèle prendra contact avec vous dans les plus brefs délais.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Nom de l'entreprise*</Label>
                                                <Input
                                                    placeholder="Nom de votre société"
                                                    value={formData.entityName}
                                                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                                                    required
                                                    className="bg-white h-12"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Personne à contacter*</Label>
                                                <Input
                                                    placeholder="Votre nom complet"
                                                    value={formData.contactPerson}
                                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                                    required
                                                    className="bg-white h-12"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Numéro de téléphone*</Label>
                                                <div className="space-y-3">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={formData.phonePrefix}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                phonePrefix: e.target.value,
                                                                whatsappPrefix: prev.useWhatsappForPhone ? e.target.value : prev.whatsappPrefix
                                                            }))}
                                                            className="w-24 border-slate-300 font-bold text-primary text-center"
                                                            placeholder="+212"
                                                        />
                                                        <Input
                                                            placeholder="6 12 00 00 00"
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
                                                            className="bg-white h-12 flex-1"
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
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Numéro whatsapp*</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={formData.whatsappPrefix}
                                                        onChange={(e) => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                                                        className="bg-slate-100 border rounded-lg w-20 text-center font-bold text-primary"
                                                        placeholder="+212"
                                                        disabled={formData.useWhatsappForPhone}
                                                    />
                                                    <Input
                                                        placeholder="6 12 00 00 00"
                                                        value={formData.whatsappNumber}
                                                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                                        className="bg-white h-12"
                                                        disabled={formData.useWhatsappForPhone}
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Email*</Label>
                                                <Input
                                                    type="email"
                                                    placeholder="votre@email.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                    className="bg-white h-12"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center pt-8">
                                        <Button
                                            type="submit"
                                            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-bold shadow-lg shadow-primary/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95"
                                        >
                                            Confirmer ma réservation
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </main>
            </div>

            <Footer />

            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md bg-[#fdf8f1] border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed whitespace-pre-line">
                            {getConfirmationMessage(formData.contactPerson, false)}
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
