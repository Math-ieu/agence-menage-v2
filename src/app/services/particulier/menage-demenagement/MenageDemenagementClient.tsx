"use client";

import { useState, Suspense } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import serviceDemenagement from "@/assets/service-menage-demenagement.png";
import { createWhatsAppLink, formatBookingMessage, DESTINATION_PHONE_NUMBER, getConfirmationMessage } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
import { calculateSurchargeMultiplier } from "@/lib/pricing";
import "@/styles/sticky-summary.css";
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
    propertyType: "studio",
    frequency: "oneshot",
    subFrequency: "",
    surfaceArea: 50,
    cleanlinessType: "normal",
    accommodationState: "vide",
    city: "",
    neighborhood: "",
    schedulingTime: "morning",
    schedulingDate: "",
    schedulingType: "flexible",
    fixedTime: "14:00",
    additionalServices: {
        nettoyageTerrasse: false,
        baiesVitrees: false
    },
    phoneNumber: "",
    phonePrefix: "+212",
    useWhatsappForPhone: true,
    whatsappPrefix: "+212",
    whatsappNumber: "",
    firstName: "",
    lastName: "",
    changeRepereNotes: ""
};

const MenageDemenagementContent = () => {
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const router = useRouter();

    const calculateBasePrice = (surface: number) => {
        if (surface <= 50) return 590;
        if (surface <= 80) return 890;
        if (surface <= 120) return 1290;
        if (surface <= 180) return 1790;
        if (surface <= 250) return 2490;
        return 0; // "Sur devis"
    };

    const basePrice = calculateBasePrice(formData.surfaceArea);
    const isIntensive = formData.cleanlinessType === "intensif";
    const intensivePrice = isIntensive && basePrice > 0 ? basePrice * 0.15 : 0;

    const additionalCosts = (formData.additionalServices.nettoyageTerrasse ? 500 : 0);

    let totalPrice = 0;
    let discountAmount = 0;
    const discountRate = 0.1;

    const multiplier = calculateSurchargeMultiplier(
        formData.schedulingDate,
        formData.schedulingType,
        formData.fixedTime,
        formData.schedulingTime
    );

    const corePrice = (basePrice + intensivePrice) * multiplier;

    if (formData.frequency === "subscription") {
        const visitsMap: Record<string, number> = {
            "4foisSemaine": 4,
            "1foisSemaine": 1,
            "2foisMois": 0.5,
            "1foisMois": 0.25,
            "1semaine2": 0.5,
            "1foisAn": 1 / 52 // Very low frequency, but following the pattern
        };
        const visitsPerWeek = visitsMap[formData.subFrequency] || 1;
        const perVisitPrice = corePrice + additionalCosts;
        const subtotalMonthly = perVisitPrice * visitsPerWeek * 4;
        discountAmount = subtotalMonthly * discountRate;
        totalPrice = subtotalMonthly - discountAmount;
    } else {
        totalPrice = corePrice > 0 ? corePrice + additionalCosts : 0;
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

        const bookingData = {
            ...formData,
            phoneNumber: `${formData.phonePrefix} ${formData.phoneNumber}`,
            whatsappNumber: formData.useWhatsappForPhone
                ? `${formData.phonePrefix} ${formData.phoneNumber}`
                : `${formData.whatsappPrefix} ${formData.whatsappNumber}`
        };

        const message = formatBookingMessage("Ménage post-déménagement", bookingData, totalPrice || "Sur devis", false);
        const whatsappLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, message);

        // Send email notification (async)
        sendBookingEmail("Ménage post-déménagement", bookingData, totalPrice || "Sur devis", false).catch(console.error);

        router.push(window.location.pathname + "/merci");
    };

    const handleCloseConfirmation = (open: boolean) => {
        setShowConfirmation(open);
        if (!open) {
            setWasValidated(false);
            setFormData(INITIAL_FORM_DATA);
        }
    };

    const frequencies = [
        { value: "4foisSemaine", label: "4 fois par semaine" },
        { value: "1foisSemaine", label: "Une fois par semaine" },
        { value: "2foisMois", label: "2 fois par mois" },
        { value: "1foisMois", label: "Une fois par mois" },
        { value: "1semaine2", label: "Une semaine sur deux" },
        { value: "1foisAn", label: "1 fois par an" }
    ];

    const getFrequencyLabel = (value: string, subValue: string) => {
        if (value === "oneshot") return "Une fois";
        const freq = frequencies.find(f => f.value === subValue);
        return freq ? `Abonnement - ${freq.label}` : "Abonnement";
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="bg-[hsl(var(--primary)/0.05)]" style={{ "--primary": SERVICE_COLORS.DEMENAGEMENT.hsl, "--secondary": `${SERVICE_COLORS.DEMENAGEMENT.hsl.split(' ').slice(0, 2).join(' ')} 95%` } as React.CSSProperties}>
                <ServiceHeroSection
                    title="Ménage post - déménagement"
                    description={`Ménage post-déménagement : – tout inclus :
- Dépoussiérage complet : surfaces, plinthes, portes, poignées, interrupteurs
- Sols : aspiration + lavage/dégraissage (toutes surfaces)
- Cuisine : dégraissage plans de travail, évier/robinetterie, façades (désinfection)
- Salle de bain & WC : nettoyage + désinfection, détartrage léger, miroirs
- Finitions : cadres/rebords, coins, contrôle final pièce par pièce

Produits + matériel + main-d'œuvre inclus.
Options possibles : vitres extérieures/grandes baies, terrasse.`}
                    image={serviceDemenagement.src}
                    primaryColor={SERVICE_COLORS.DEMENAGEMENT.hex}
                    faqs={[
                        {
                            question: "Fournissez-vous le matériel et les produits pour ce type de ménage ?",
                            answer: "Oui, absolument. Nous savons qu'un déménagement est une source de stress et que vos affaires sont souvent déjà emballées. C'est pourquoi, contrairement à nos prestations standards, le nettoyage post-déménagement (ou avant emménagement) inclut d'office l'utilisation de tous nos produits d'entretien professionnels ainsi que notre propre matériel. Nos équipes arrivent équipées de A à Z."
                        },
                        {
                            question: "Que comprend exactement cette prestation de nettoyage à vide ?",
                            answer: "Il s'agit d'une remise à blanc complète de votre espace. Nous traitons le logement en profondeur : lessivage des portes, des interrupteurs et des plinthes, nettoyage intérieur et extérieur des placards vides, désinfection totale des pièces d'eau (sanitaires, salle de bain) et de la cuisine, ainsi que le lavage des vitres. L'objectif est de rendre ou d'intégrer un espace irréprochable."
                        },
                        {
                            question: "Le logement doit-il être entièrement vidé de ses meubles avant votre arrivée ?",
                            answer: "Pour vous garantir un résultat Premium et un nettoyage véritablement approfondi (notamment pour les sols et les murs), nous demandons que le logement soit totalement vide de ses meubles et cartons. L'espace dégagé permet à nos intervenantes d'être d'une efficacité redoutable dans les moindres recoins."
                        },
                        {
                            question: "Faut-il que l'eau et l'électricité soient toujours activées ?",
                            answer: "Oui, c'est un point indispensable. Pour pouvoir utiliser notre matériel électrique et procéder au lessivage et à la désinfection de vos surfaces, l'eau courante et l'électricité doivent impérativement être actives le jour de notre intervention à Casablanca."
                        }
                    ]}
                />

                <main className="flex-1 bg-transparent py-12">
                    <div className="container max-w-5xl px-4 mx-auto">
                        <div className="bg-primary/5 rounded-lg p-6 text-center mb-8 border border-primary/20">
                            <h2 className="text-2xl font-bold text-primary mb-2 uppercase tracking-wide">
                                FORMULAIRE DE RESERVATION
                            </h2>
                        </div>
                        <form id="booking-form" onSubmit={handleSubmit} noValidate className={`flex flex-col lg:grid lg:grid-cols-3 gap-8 ${wasValidated ? 'was-validated' : ''}`}>
                            <div className="lg:col-span-1 lg:order-last sticky-reservation-summary-container">
                                <div className="lg:sticky lg:top-24 space-y-6">
                                    <div className="bg-primary/5 rounded-lg border border-primary/20 shadow-sm p-6 space-y-4 relative">
                                        <h3 className="text-xl font-bold text-primary border-b border-primary/20 pb-2 text-center">
                                            Ma Réservation
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between gap-4 border-b border-primary/10 pb-2">
                                                <span className="text-muted-foreground">Service:</span>
                                                <span className="font-medium text-right text-slate-700">Post-déménagement</span>
                                            </div>

                                            {/* Detailed info - hidden on mobile when collapsed */}
                                            <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Superficie:</span>
                                                    <span className="font-medium text-right text-slate-700">
                                                        {formData.surfaceArea >= 300 ? "300m² et plus" : `${formData.surfaceArea} m²`}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Salissure:</span>
                                                    <span className="font-medium text-right uppercase text-slate-700">{formData.cleanlinessType}</span>
                                                </div>
                                                {formData.additionalServices.nettoyageTerrasse && (
                                                    <div className="flex justify-between gap-4 text-xs">
                                                        <span className="text-muted-foreground">Nettoyage Terrasse:</span>
                                                        <span className="font-medium text-right text-slate-700">+500 MAD</span>
                                                    </div>
                                                )}
                                                {formData.additionalServices.baiesVitrees && (
                                                    <div className="flex justify-between gap-4 text-xs">
                                                        <span className="text-muted-foreground">Baies Vitrées:</span>
                                                        <span className="font-medium text-right text-slate-700 italic text-[10px]">Sur devis</span>
                                                    </div>
                                                )}
                                                {intensivePrice > 0 && (
                                                    <div className="flex justify-between gap-4 text-red-600 font-bold bg-red-50 p-2 rounded">
                                                        <span>Majoration Intensif (15%):</span>
                                                        <span>+{intensivePrice} MAD</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between gap-4 border-t border-primary/10 pt-2">
                                                    <span className="text-muted-foreground">Date:</span>
                                                    <span className="font-medium text-right text-slate-700">{formData.schedulingDate || "Non définie"}</span>
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
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-lg font-bold">Total</span>
                                                <span className="text-2xl font-bold text-primary">
                                                    {totalPrice > 0 ? `${Math.round(totalPrice)} MAD` : "SUR DEVIS"}
                                                </span>
                                            </div>
                                            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 text-center">
                                                <p className="text-primary font-bold text-sm leading-tight">
                                                    Prestation tout compris : main-d'œuvre, produits et équipements de ménage.
                                                </p>
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
                                <div className="bg-card rounded-lg p-4 md:p-8 border shadow-sm space-y-10">
                                    <div>
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 rounded-lg text-center mb-4 uppercase">
                                            Type d'habitation
                                        </h3>
                                        <RadioGroup
                                            value={formData.propertyType}
                                            onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                                            className="flex flex-wrap items-center justify-center gap-8 p-4"
                                        >
                                            {["Studio", "Appartement", "Duplex", "Villa", "Maison"].map((type) => (
                                                <div key={type} className="flex items-center space-x-3">
                                                    <RadioGroupItem value={type.toLowerCase()} id={`pd-${type}`} className="border-primary text-primary" />
                                                    <Label htmlFor={`pd-${type}`} className="font-bold text-slate-700">{type}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 rounded-lg text-center mb-4">
                                            Indiquez la superficie de votre espace en m².
                                        </h3>
                                        <div className="px-8 py-10 border rounded-xl bg-white shadow-sm space-y-8">
                                            <div className="relative pt-6">
                                                <div className="absolute -top-4 left-0 transition-all duration-200" style={{ left: `${(formData.surfaceArea / 300) * 100}%`, transform: 'translateX(-50%)' }}>
                                                    <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm border border-primary/20 whitespace-nowrap">
                                                        {formData.surfaceArea >= 300 ? "300m² et plus" : `${formData.surfaceArea}m²`}
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[formData.surfaceArea]}
                                                    onValueChange={(value) => setFormData({ ...formData, surfaceArea: value[0] })}
                                                    max={300}
                                                    min={0}
                                                    step={1}
                                                    className="cursor-pointer"
                                                />
                                                <div className="flex justify-between mt-4 text-xs font-medium text-slate-400">
                                                    <span>0m²</span>
                                                    <span>300m²</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 rounded-lg text-center mb-4 uppercase">
                                            Le logement sera
                                        </h3>
                                        <RadioGroup
                                            value={formData.accommodationState}
                                            onValueChange={(value) => setFormData({ ...formData, accommodationState: value })}
                                            className="flex flex-wrap items-center justify-center gap-12 p-4"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value="vide" id="vide" className="border-primary text-primary" />
                                                <Label htmlFor="vide" className="font-bold text-slate-700">Vide</Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value="semi-meuble" id="semi-meuble" className="border-primary text-primary" />
                                                <Label htmlFor="semi-meuble" className="font-bold text-slate-700">Semi meublé</Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value="meuble" id="meuble" className="border-primary text-primary" />
                                                <Label htmlFor="meuble" className="font-bold text-slate-700">Meublé</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>


                                    <div>
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 rounded-lg text-center mb-4 uppercase">
                                            Type de salissure
                                        </h3>
                                        <div className="bg-white border rounded-xl p-4">
                                            <RadioGroup
                                                value={formData.cleanlinessType}
                                                onValueChange={(value) => setFormData({ ...formData, cleanlinessType: value })}
                                                className="flex items-center justify-center gap-12 p-4"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <RadioGroupItem value="normal" id="normal" className="border-primary text-primary" />
                                                    <Label htmlFor="normal" className="font-bold text-slate-700">Normal</Label>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <RadioGroupItem value="intensif" id="intensif" className="border-primary text-primary" />
                                                    <Label htmlFor="intensif" className="font-bold text-slate-700 flex flex-col items-start gap-1">
                                                        <span>Intensif</span>
                                                        {formData.cleanlinessType === "intensif" && (
                                                            <span className="text-red-600 text-[11px] font-bold leading-tight italic">
                                                                (calcaire marqué, cuisine très encrassée, poussière lourde)
                                                            </span>
                                                        )}
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 rounded-lg mb-4 text-center uppercase">
                                            Services Optionnels
                                        </h3>
                                        <div className="p-6 border rounded-xl bg-slate-50/50 space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-white border border-primary/10 rounded-xl shadow-sm">
                                                <span className="font-bold text-primary text-sm">Nettoyage Terrasse : 500 MAD</span>
                                                <Switch
                                                    checked={formData.additionalServices.nettoyageTerrasse}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            additionalServices: { ...formData.additionalServices, nettoyageTerrasse: checked }
                                                        })
                                                    }
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-white border border-primary/10 rounded-xl shadow-sm">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-primary text-sm">Baies Vitrées : à partir de 30 MAD/m2</span>
                                                    <span className="text-[10px] text-slate-400">(max 3 mètre de hauteur)</span>
                                                </div>
                                                <Switch
                                                    checked={formData.additionalServices.baiesVitrees}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            additionalServices: { ...formData.additionalServices, baiesVitrees: checked }
                                                        })
                                                    }
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 rounded-lg mb-4 text-center">
                                            Planning pour votre demande
                                        </h3>
                                        <div className="grid md:grid-cols-3 gap-6 p-4 border rounded-xl bg-white shadow-sm">
                                            {/* Heure fixe */}
                                            <div className="text-center space-y-3">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="pd-fixed"
                                                        name="schedulingType"
                                                        checked={formData.schedulingType === "fixed"}
                                                        onChange={() => setFormData({ ...formData, schedulingType: "fixed" })}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <Label htmlFor="pd-fixed" className="font-bold text-primary text-sm cursor-pointer text-center">Je souhaite une heure fixe</Label>
                                                </div>
                                                <div className="flex justify-center">
                                                    <Input
                                                        type="time"
                                                        required
                                                        value={formData.fixedTime}
                                                        onChange={(e) => setFormData({ ...formData, fixedTime: e.target.value })}
                                                        disabled={formData.schedulingType !== "fixed"}
                                                        className="w-32 text-center text-xl font-bold h-12 border-primary/30"
                                                    />
                                                </div>
                                            </div>

                                            {/* Flexible */}
                                            <div className="text-center space-y-3">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="pd-flexible"
                                                        name="schedulingType"
                                                        checked={formData.schedulingType === "flexible"}
                                                        onChange={() => setFormData({ ...formData, schedulingType: "flexible" })}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <Label htmlFor="pd-flexible" className="font-bold text-primary text-sm cursor-pointer text-center">Je suis flexible</Label>
                                                </div>
                                                <RadioGroup
                                                    value={formData.schedulingTime}
                                                    onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })}
                                                    disabled={formData.schedulingType !== "flexible"}
                                                    className="space-y-2 text-left inline-block"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="morning" id="pd-morning" className="border-primary text-primary" />
                                                        <Label htmlFor="pd-morning" className="text-sm font-medium">Le matin</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="afternoon" id="pd-afternoon" className="border-primary text-primary" />
                                                        <Label htmlFor="pd-afternoon" className="text-sm font-medium">L'après midi</Label>
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
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 rounded-lg mb-4 text-center uppercase">
                                            Où aura lieu votre ménage ?
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-xl bg-white mb-4 shadow-sm">
                                            <Input
                                                placeholder="Ville , Casablanca"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="border-slate-300 h-11"
                                            />
                                            <Input
                                                placeholder="Adresse"
                                                required
                                                value={formData.neighborhood}
                                                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                className="border-slate-300 h-11"
                                            />
                                        </div>
                                        <div className="p-4 border rounded-xl bg-white shadow-sm">
                                            <Label className="font-bold text-primary text-xs uppercase mb-2 block">Champs de repère</Label>
                                            <Textarea
                                                placeholder="Donnez-nous des repères pour faciliter le travail de ménage"
                                                required
                                                value={formData.changeRepereNotes}
                                                onChange={(e) => setFormData({ ...formData, changeRepereNotes: e.target.value })}
                                                className="mt-2 border-slate-300 min-h-[100px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white border border-primary/10 rounded-xl overflow-hidden shadow-sm">
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 text-center uppercase">
                                            Mes Informations
                                        </h3>
                                        <div className="p-6 grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-primary text-xs uppercase">Numéro de téléphone*</Label>
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
                                                            onFocus={() => {
                                                                if (typeof window !== "undefined" && (window as any).gtag) {
                                                                    (window as any).gtag('event', 'conversion', {
                                                                        'send_to': 'AW-17907112455/phone_field_interact',
                                                                    });
                                                                }
                                                            }}
                                                            onChange={(e) => {
                                                                const newVal = e.target.value;
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    phoneNumber: newVal,
                                                                    whatsappNumber: prev.useWhatsappForPhone ? newVal : prev.whatsappNumber
                                                                }));
                                                            }}
                                                            required
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
                                                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                                                        >
                                                            Utilisez-vous ce numéro pour WhatsApp ?
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-primary text-xs uppercase">Numéro whatsapp</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={formData.whatsappPrefix}
                                                        onChange={(e) => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                                                        className="w-20 border-slate-300 font-bold text-primary text-center"
                                                        placeholder="+212"
                                                        disabled={formData.useWhatsappForPhone}
                                                    />
                                                    <Input
                                                        placeholder="6 12 00 00 00"
                                                        value={formData.whatsappNumber}
                                                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                                        className="border-slate-300 h-11"
                                                        disabled={formData.useWhatsappForPhone}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-primary text-xs uppercase">Nom*</Label>
                                                <Input
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    required
                                                    className="border-slate-300 h-11"
                                                    placeholder="Votre nom"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-primary text-xs uppercase">Prénom*</Label>
                                                <Input
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    required
                                                    className="border-slate-300 h-11"
                                                    placeholder="Votre prénom"
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
                <OtherServices type="particulier" currentServiceUrl="/services/particulier/menage-demenagement" />
            </div>

            <Footer />

            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md bg-white border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed">
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
};

export default function MenageDemenagementClient() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-2xl text-primary animate-pulse">Chargement...</div>}>
            <MenageDemenagementContent />
        </Suspense>
    );
}
