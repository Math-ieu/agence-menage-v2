"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICE_COLORS } from "@/constants/service-colors";
import { ChevronDown, ChevronUp } from "lucide-react";
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
import serviceAirbnb from "@/assets/service-menage-airbnb.webp";
import { createWhatsAppLink, formatBookingMessage, DESTINATION_PHONE_NUMBER, getConfirmationMessage } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
import "@/styles/sticky-summary.css";
import { Checkbox } from "@/components/ui/checkbox";
import { FREQUENCES } from "@/app/frequences";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { CASABLANCA_NEIGHBORHOODS, DEFAULT_CITY, CITIES, SURCHARGE_CITIES, NEIGHBORHOODS_BY_CITY } from "@/constants/locations";

const frequencies = FREQUENCES;

const INITIAL_FORM_DATA = {
    propertyType: "appartement",
    formula: "A",
    sizeTier: "1chambre",
    conso: false,
    linenSets: 0,
    city: DEFAULT_CITY,
    neighborhood: "",
    schedulingTime: "morning",
    schedulingDate: "",
    schedulingType: "flexible",
    fixedTime: "14:00",
    phoneNumber: "",
    phonePrefix: "+212",
    useWhatsappForPhone: true,
    whatsappPrefix: "+212",
    whatsappNumber: "",
    firstName: "",
    lastName: "",
    changeRepereNotes: ""
};

export default function MenageAirbnbClient() {
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const AIRBNB_PRICES = {
        A: {
            studio: 130,
            "1chambre": 165,
            "2chambres": 195,
            "3chambres": 260,
            "4chambres": 325,
            villa: 390
        },
        B: {
            studio: 220,
            "1chambre": 255,
            "2chambres": 285,
            "3chambres": 350,
            "4chambres": 415,
            villa: 480
        }
    } as const;

    const SIZE_LABELS: Record<string, string> = {
        studio: "Studio",
        "1chambre": "1 chambre",
        "2chambres": "2 chambres",
        "3chambres": "3 chambres",
        "4chambres": "4 chambres",
        villa: "Villa"
    };

    const basePrice = AIRBNB_PRICES[formData.formula as "A" | "B"][formData.sizeTier as keyof typeof AIRBNB_PRICES.A];
    let totalPrice = basePrice;
    if (formData.conso) {
        totalPrice += 25;
    }
    if (formData.formula === "B" && formData.linenSets > 0) {
        totalPrice += formData.linenSets * 90;
    }
    if (SURCHARGE_CITIES.includes(formData.city)) {
        totalPrice += 50;
    }

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

        setIsSubmitting(true);
        try {
            const bookingData = {
                ...formData,
                frequency: "oneshot",
                frequencyLabel: "Une fois",
                numberOfPeople: 1,
                propertyType: formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1),
                serviceType: formData.formula === "A" ? "Formule A — Ménage seul" : "Formule B — Ménage + set de linge",
                type_habitation: `${formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1)} (${SIZE_LABELS[formData.sizeTier]})`,
                additionalServices: {
                    reassortConso: formData.conso,
                    setsDeLinge: formData.formula === "B" && formData.linenSets > 0,
                    setsDeLingeCount: formData.formula === "B" ? formData.linenSets : 0
                },
                phoneNumber: `${formData.phonePrefix} ${formData.phoneNumber}`,
                whatsappNumber: formData.useWhatsappForPhone
                    ? `${formData.phonePrefix} ${formData.phoneNumber}`
                    : `${formData.whatsappPrefix} ${formData.whatsappNumber}`
            };

            const message = formatBookingMessage("Ménage Airbnb", bookingData, totalPrice, false);
            const whatsappLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, message);

            // Send email notification (await to ensure back-office recording)
            const result = await sendBookingEmail("Ménage Airbnb", bookingData, totalPrice, false);

            if (result.success) {
                setShowConfirmation(true);
            } else {
                if (result.emailSent) {
                    toast.warning("Demande envoyée par email, mais l'enregistrement automatique a échoué. Nous vous contacterons rapidement.");
                    setShowConfirmation(true);
                } else {
                    toast.error("Une erreur est survenue lors de la réservation. Veuillez nous contacter via WhatsApp.");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue lors de la réservation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseConfirmation = (open: boolean) => {
        setShowConfirmation(open);
        if (!open) {
            setWasValidated(false);
            setFormData(INITIAL_FORM_DATA);
            router.push(window.location.pathname + "/merci");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="bg-[hsl(var(--primary)/0.05)]" style={{ "--primary": SERVICE_COLORS.AIRBNB.hsl } as React.CSSProperties}>
                <ServiceHeroSection
                    title="Ménage Airbnb"
                    description={`Le ménage Airbnb a pour objectif d’assurer la propreté et l’entretien courant des espaces attribués.
Il comprend le :

- Nettoyage de cuisine
- Lavage de vaisselle
- Balayage du sol et des tapis
- Nettoyage du sol
- Nettoyage des portes de placard
- Nettoyage des chambres
- Nettoyages des salles de bains et toilettes
- Depoussierage des meubles
- Nettoyage des vitres intérieurs accessibles
- Changement des draps
- Rangement de la vaisselle
- Vidage et nettoyage de la poubelle`}
                    image={serviceAirbnb.src}
                    primaryColor={SERVICE_COLORS.AIRBNB.hex}
                    faqs={[
                        {
                            question: "Gérez-vous le séchage et le repassage du linge de maison (draps, serviettes) ?",
                            answer: "Oui, nous savons que la qualité du linge est le premier critère pour obtenir un avis 5 étoiles de vos voyageurs. C'est pourquoi nous proposons, en option complémentaire, la prise en charge du séchage et du repassage minutieux de vos draps et serviettes pour garantir des lits dignes d'un service hôtelier à chaque nouvelle arrivée."
                        },
                        {
                            question: "Gérez-vous le réapprovisionnement des consommables de base (savon, papier toilette, café) ?",
                            answer: "Actuellement, nous concentrons toute notre expertise sur notre cœur de métier : l'excellence de la propreté Premium. Nous ne gérons donc pas les achats ni le réapprovisionnement de vos consommables. Nous vous invitons à laisser votre stock à disposition sur place, et nos équipes se chargeront de les disposer harmonieusement selon vos consignes avant l'arrivée de vos locataires."
                        },
                        {
                            question: "Pouvez-vous intervenir le dimanche entre deux réservations (check-out / check-in) ?",
                            answer: "Absolument. Nous connaissons les contraintes de la location courte durée à Casablanca et savons que les rotations n'attendent pas. Nos équipes spécialisées Airbnb sont pleinement opérationnelles 7 jours sur 7, du lundi au dimanche inclus, pour assurer des transitions parfaites et ponctuelles entre le départ d'un locataire et l'arrivée du suivant."
                        },
                        {
                            question: "Que se passe-t-il si votre équipe constate des dégradations laissées par les voyageurs ?",
                            answer: "Nous sommes vos yeux sur place. Dès qu'une de nos intervenantes constate une casse, une dégradation ou toute anomalie anormale dans votre logement, notre protocole est strict : nous prenons immédiatement des photos détaillées. Nous vous partageons ces preuves en temps réel et nous mettons en attente nos opérations de nettoyage jusqu'à réception de vos consignes. Vous êtes ainsi parfaitement protégé pour formuler vos réclamations sur la plateforme de réservation."
                        }
                    ]}
                />

                <main className="flex-1 bg-transparent py-12">
                    <div className="container max-w-5xl">
                        <div className="bg-primary/5 rounded-lg p-6 text-center mb-8 border border-primary/20">
                            <h2 className="text-2xl font-bold text-primary mb-2 uppercase tracking-wide">
                                FORMULAIRE DE RESERVATION
                            </h2>
                        </div>
                        <form id="booking-form" onSubmit={handleSubmit} noValidate className={`flex flex-col lg:grid lg:grid-cols-3 gap-8 ${wasValidated ? 'was-validated' : ''}`}>
                            <div className="lg:col-span-1 lg:order-last sticky-reservation-summary-container">
                                <div className="lg:sticky lg:top-24 space-y-6">
                                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 relative">
                                        <h3 className="text-lg font-bold bg-primary text-white py-2 px-4 rounded-lg text-center tracking-wide">
                                            Ma Réservation
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                                                <span className="text-slate-500">Service:</span>
                                                <span className="font-bold text-slate-800 text-right">Ménage Airbnb</span>
                                            </div>

                                            {/* Detailed info - hidden on mobile when collapsed */}
                                            <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                                                    <span className="text-slate-500">Type d'habitation:</span>
                                                    <span className="font-bold text-slate-800 text-right capitalize">
                                                        {formData.propertyType}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                                                    <span className="text-slate-500">Formule:</span>
                                                    <span className="font-bold text-slate-800 text-right">
                                                        {formData.formula === "A" ? "A — Ménage seul" : "B — Ménage + set de linge"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                                                    <span className="text-slate-500">Type:</span>
                                                    <span className="font-bold text-slate-800 text-right">
                                                        {SIZE_LABELS[formData.sizeTier]}
                                                    </span>
                                                </div>
                                                {formData.conso && (
                                                    <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                                                        <span className="text-slate-500">Réassort:</span>
                                                        <span className="font-bold text-slate-800 text-right">+25 DH</span>
                                                    </div>
                                                )}
                                                {formData.formula === "B" && formData.linenSets > 0 && (
                                                    <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                                                        <span className="text-slate-500">Sets de linge:</span>
                                                        <span className="font-bold text-slate-800 text-right">
                                                            {formData.linenSets} × 90 = {formData.linenSets * 90} DH
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                                                    <span className="text-slate-500">Date:</span>
                                                    <span className="font-bold text-slate-800 text-right">{formData.schedulingDate || "Non définie"}</span>
                                                </div>
                                                <div className="flex justify-between gap-4 pb-1 text-sm">
                                                    <span className="text-slate-500">Heure:</span>
                                                    <span className="font-bold text-slate-800 text-right">
                                                        {formData.schedulingType === "fixed" ? formData.fixedTime : (formData.schedulingTime === "morning" ? "Le matin" : "L'après midi")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-extrabold text-slate-800">Total</span>
                                                <span className="text-2xl font-black text-primary">{totalPrice} DH</span>
                                            </div>
                                        </div>

                                        {/* Toggle Button for Mobile */}
                                        <button
                                            type="button"
                                            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                            className="lg:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white z-20 hover:bg-primary/90 transition-transform active:scale-90"
                                        >
                                            {isSummaryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-8">
                                <div className="space-y-8">
                                    {/* Type d'habitation */}
                                    <div>
                                        <h3 className="text-lg font-bold bg-primary text-white py-2.5 px-4 rounded-lg mb-4 text-center tracking-wide">
                                            Type d'habitation
                                        </h3>
                                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                            <RadioGroup
                                                value={formData.propertyType}
                                                onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                                                className="flex flex-wrap gap-8 justify-start"
                                            >
                                                {["Studio", "Appartement", "Duplex", "Villa", "Maison"].map((type) => (
                                                    <div key={type} className="flex items-center space-x-3">
                                                        <RadioGroupItem value={type.toLowerCase()} id={type} className="border-primary text-primary" />
                                                        <Label htmlFor={type} className="font-extrabold text-slate-700 cursor-pointer select-none text-sm">{type}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    </div>

                                    {/* Nos formules, room size grid, and options */}
                                    <div>
                                        <h3 className="text-lg font-bold bg-primary text-white py-2.5 px-4 rounded-lg mb-4 text-center tracking-wide">
                                            Nos formules
                                        </h3>
                                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                                            {/* Formula cards selector */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Formula A */}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, formula: "A" })}
                                                    className={`p-6 rounded-2xl border-2 text-center transition-all duration-300 ${formData.formula === "A"
                                                        ? "bg-primary border-transparent text-white scale-[1.01]"
                                                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${formData.formula === "A" ? "text-white/80" : "text-slate-400"}`}>
                                                        FORMULE A
                                                    </div>
                                                    <div className="text-2xl font-extrabold">
                                                        Ménage seul
                                                    </div>
                                                </button>

                                                {/* Formula B */}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, formula: "B" })}
                                                    className={`p-6 rounded-2xl border-2 text-center transition-all duration-300 ${formData.formula === "B"
                                                        ? "bg-primary border-transparent text-white scale-[1.01]"
                                                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${formData.formula === "B" ? "text-white/80" : "text-slate-400"}`}>
                                                        FORMULE B
                                                    </div>
                                                    <div className="text-2xl font-extrabold">
                                                        Ménage + set de linge
                                                    </div>
                                                </button>
                                            </div>

                                            {/* Size cards grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                                                {Object.keys(AIRBNB_PRICES.A).map((sizeKey) => {
                                                    const sizeLabel = SIZE_LABELS[sizeKey];
                                                    const cardPrice = AIRBNB_PRICES[formData.formula as "A" | "B"][sizeKey as keyof typeof AIRBNB_PRICES.A];
                                                    const isSelected = formData.sizeTier === sizeKey;
                                                    return (
                                                        <button
                                                            key={sizeKey}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, sizeTier: sizeKey })}
                                                            className={`p-4 rounded-2xl border transition-all duration-300 text-left ${isSelected
                                                                ? "border-primary bg-white ring-2 ring-primary ring-offset-0 scale-[1.01]"
                                                                : "border-slate-200 bg-white hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            <div className={`font-bold text-sm ${isSelected ? "text-primary" : "text-slate-500"}`}>
                                                                {sizeLabel}
                                                            </div>
                                                            <div className="font-extrabold text-lg mt-1 text-slate-800">
                                                                {cardPrice} DH
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-slate-100 pt-2" />

                                            {/* Checkbox & count options */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between py-2">
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            id="reassort"
                                                            checked={formData.conso}
                                                            onCheckedChange={(checked) => setFormData({ ...formData, conso: !!checked })}
                                                            className="data-[state=checked]:bg-primary border-primary h-5 w-5 rounded"
                                                        />
                                                        <label htmlFor="reassort" className="font-extrabold text-slate-800 text-sm cursor-pointer select-none">
                                                            Réassort consommables
                                                        </label>
                                                    </div>
                                                    <span className="font-bold text-primary text-sm">
                                                        +25 DH
                                                    </span>
                                                </div>

                                                {formData.formula === "B" && (
                                                    <div className="p-4 border border-dashed border-primary/20 rounded-2xl bg-primary/5 space-y-3 animate-in fade-in duration-300">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div className="space-y-1">
                                                                <div className="font-extrabold text-primary text-sm md:text-base">
                                                                    — Ajout de set de linge : +90 DH / set
                                                                </div>
                                                                <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                                                                    2 grandes serviettes, 2 moyennes serviettes, 1 drap housse, 1 housse de couette, 1 drap lit, 2 tales d'oreiller
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2 bg-white shrink-0 self-end md:self-auto">
                                                                <button
                                                                    type="button"
                                                                    className="h-8 w-8 rounded-lg border border-primary text-primary bg-white hover:bg-primary/5 flex items-center justify-center font-bold text-lg transition-colors active:scale-95"
                                                                    onClick={() => setFormData(prev => ({ ...prev, linenSets: Math.max(0, prev.linenSets - 1) }))}
                                                                >
                                                                    -
                                                                </button>
                                                                <div className="w-12 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-800 font-extrabold text-sm bg-white">
                                                                    {formData.linenSets}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="h-8 w-8 rounded-lg border border-primary text-primary bg-white hover:bg-primary/5 flex items-center justify-center font-bold text-lg transition-colors active:scale-95"
                                                                    onClick={() => setFormData(prev => ({ ...prev, linenSets: prev.linenSets + 1 }))}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Planning */}
                                    <div>
                                        <h3 className="text-lg font-bold bg-primary text-white py-2.5 px-4 rounded-lg mb-4 text-center tracking-wide">
                                            Planning pour votre demande
                                        </h3>
                                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                {/* Column 1: Fixed Time */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-2.5">
                                                        <input
                                                            type="radio"
                                                            id="fixed"
                                                            name="schedulingType"
                                                            checked={formData.schedulingType === "fixed"}
                                                            onChange={() => setFormData({ ...formData, schedulingType: "fixed" })}
                                                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                                                        />
                                                        <label htmlFor="fixed" className="font-extrabold text-slate-800 text-sm cursor-pointer">
                                                            Je souhaite une heure fixe
                                                        </label>
                                                    </div>
                                                    <Input
                                                        type="time"
                                                        required
                                                        value={formData.fixedTime}
                                                        onChange={(e) => setFormData({ ...formData, fixedTime: e.target.value })}
                                                        disabled={formData.schedulingType !== "fixed"}
                                                        className="w-full max-w-[160px] text-center text-lg font-extrabold h-11 border-slate-200 rounded-xl"
                                                    />
                                                </div>

                                                {/* Column 2: Flexible */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-2.5">
                                                        <input
                                                            type="radio"
                                                            id="flexible"
                                                            name="schedulingType"
                                                            checked={formData.schedulingType === "flexible"}
                                                            onChange={() => setFormData({ ...formData, schedulingType: "flexible" })}
                                                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                                                        />
                                                        <label htmlFor="flexible" className="font-extrabold text-slate-800 text-sm cursor-pointer">
                                                            Je suis flexible
                                                        </label>
                                                    </div>
                                                    <RadioGroup
                                                        value={formData.schedulingTime}
                                                        onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })}
                                                        disabled={formData.schedulingType !== "flexible"}
                                                        className="space-y-2 pl-6"
                                                    >
                                                        <div className="flex items-center space-x-2.5">
                                                            <RadioGroupItem value="morning" id="morning" className="border-primary text-primary" />
                                                            <label htmlFor="morning" className="text-sm font-bold text-slate-700 cursor-pointer">
                                                                Le matin
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center space-x-2.5">
                                                            <RadioGroupItem value="afternoon" id="afternoon" className="border-primary text-primary" />
                                                            <label htmlFor="afternoon" className="text-sm font-bold text-slate-700 cursor-pointer">
                                                                L'après midi
                                                            </label>
                                                        </div>
                                                    </RadioGroup>
                                                </div>

                                                {/* Column 3: Date */}
                                                <div className="space-y-3">
                                                    <div className="font-extrabold text-slate-800 text-sm">Date</div>
                                                    <Input
                                                        type="date"
                                                        required
                                                        value={formData.schedulingDate}
                                                        onChange={(e) => setFormData({ ...formData, schedulingDate: e.target.value })}
                                                        className="w-full border-slate-200 rounded-xl h-11 text-slate-700 font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <h3 className="text-lg font-bold bg-primary text-white py-2.5 px-4 rounded-lg mb-4 text-center tracking-wide">
                                            Où aura lieu votre ménage ?
                                        </h3>
                                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-slate-400">Ville</Label>
                                                    <Select
                                                        value={formData.city}
                                                        onValueChange={(value) => setFormData({ ...formData, city: value, neighborhood: "" })}
                                                    >
                                                        <SelectTrigger className="border-slate-200 rounded-xl h-11">
                                                            <SelectValue placeholder="Sélectionner une ville" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {CITIES.map((c) => (
                                                                <SelectItem key={c} value={c}>
                                                                    {c}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-slate-400">Quartier</Label>
                                                    <Input
                                                        placeholder="Votre quartier"
                                                        value={formData.neighborhood}
                                                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                        className="border-slate-200 h-11 rounded-xl"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-100 rounded-xl">
                                                <div className="mt-0.5 text-orange-500 flex-shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="12" y1="8" x2="12" y2="12" />
                                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                                    </svg>
                                                </div>
                                                <p className="text-xs font-medium text-orange-800 leading-relaxed">
                                                    Si vous êtes dans les zones <span className="font-bold">Bouskoura, Dar Bouazza, Mansouria, Almaz, Sidi Rahal, Benslimane, Mohammédia, Ville Verte...</span> un supplément de <span className="font-bold whitespace-nowrap px-1 bg-orange-200/50 rounded-md text-orange-700">50 MAD</span> vous sera facturé pour faciliter le déplacement.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-extrabold text-slate-700 text-sm">Champs de repère</Label>
                                                <Textarea
                                                    placeholder="Donnez-nous des repères pour faciliter le travail de ménage (points de référence pour la tournée du nettoyeur) après les points de repère"
                                                    required
                                                    value={formData.changeRepereNotes}
                                                    onChange={(e) => setFormData({ ...formData, changeRepereNotes: e.target.value })}
                                                    className="border-slate-200 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Client info */}
                                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                                        <h3 className="text-lg font-bold bg-primary text-white py-2.5 px-4 text-center tracking-wide">
                                            Mes informations
                                        </h3>
                                        <div className="p-6 grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-extrabold text-slate-700 text-sm">Numéro de téléphone*</Label>
                                                <div className="space-y-3">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={formData.phonePrefix}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                phonePrefix: e.target.value,
                                                                whatsappPrefix: prev.useWhatsappForPhone ? e.target.value : prev.whatsappPrefix
                                                            }))}
                                                            className="w-24 border-slate-200 font-bold text-primary text-center rounded-xl"
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
                                                            className="border-slate-200 h-11 flex-1 rounded-xl"
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
                                                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 cursor-pointer select-none"
                                                        >
                                                            Utilisez-vous ce numéro pour WhatsApp ?
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-extrabold text-slate-700 text-sm">Numéro whatsapp</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={formData.whatsappPrefix}
                                                        onChange={(e) => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                                                        className="w-20 border-slate-200 font-bold text-primary text-center rounded-xl"
                                                        placeholder="+212"
                                                        disabled={formData.useWhatsappForPhone}
                                                    />
                                                    <Input
                                                        placeholder="6 12 00 00 00"
                                                        value={formData.whatsappNumber}
                                                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                                        className="border-slate-200 h-11 rounded-xl"
                                                        disabled={formData.useWhatsappForPhone}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-extrabold text-slate-700 text-sm">Nom*</Label>
                                                <Input
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    required
                                                    className="mt-1 border-slate-200 h-11 rounded-xl"
                                                    placeholder="Votre nom"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-extrabold text-slate-700 text-sm">Prénom*</Label>
                                                <Input
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    required
                                                    className="mt-1 border-slate-200 h-11 rounded-xl"
                                                    placeholder="Votre prénom"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center pt-8">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-bold h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Envoi en cours...
                                                </div>
                                            ) : (
                                                "Réserver maintenant"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
                <OtherServices type="particulier" currentServiceUrl="/services/particulier/menage-airbnb" />
            </div>

            <Footer />

            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md bg-white border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed">
                            {getConfirmationMessage(`${formData.firstName} ${formData.lastName}`, false)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button
                            onClick={() => handleCloseConfirmation(false)}
                            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 font-bold"
                        >
                            Fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

