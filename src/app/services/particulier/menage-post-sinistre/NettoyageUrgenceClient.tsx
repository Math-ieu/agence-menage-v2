"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { SERVICE_COLORS } from "@/constants/service-colors";
import Link from "next/link";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { createWhatsAppLink, formatBookingMessage, DESTINATION_PHONE_NUMBER, getConfirmationMessage } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
import serviceUrgence from "@/assets/service-nettoyage-urgence.webp";
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
import { CASABLANCA_NEIGHBORHOODS, DEFAULT_CITY, CITIES, SURCHARGE_CITIES, NEIGHBORHOODS_BY_CITY } from "@/constants/locations";

const INITIAL_FORM_DATA = {
    propertyType: "appartement",
    interventionNature: "sinistre",
    surface: "50",
    schedulingType: "flexible",
    fixedTime: "14:00",
    schedulingTime: "morning",
    schedulingDate: "",
    additionalServices: {
        produitsEtOutils: false,
        torchonsEtSerpierres: false
    },
    city: DEFAULT_CITY,
    neighborhood: "",
    changeRepereNotes: "",
    phoneNumber: "",
    phonePrefix: "+212",
    useWhatsappForPhone: true,
    whatsappPrefix: "+212",
    whatsappNumber: "",
    firstName: "",
    lastName: "",
    frequency: "oneshot",
    additionalInfo: ""
};

const NettoyageUrgenceContent = () => {
    const searchParams = useSearchParams();
    const isEntrepriseStatus = searchParams.get("type") === "entreprise";
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasValidated(true);

        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.neighborhood || !formData.schedulingDate) {
            toast.error("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        setIsSubmitting(true);
        try {
            const bookingData = {
                ...formData,
                phoneNumber: `${formData.phonePrefix} ${formData.phoneNumber}`,
                whatsappNumber: formData.useWhatsappForPhone
                    ? `${formData.phonePrefix} ${formData.phoneNumber}`
                    : `${formData.whatsappPrefix} ${formData.whatsappNumber}`,
                schedulingTime: formData.schedulingType === "fixed"
                    ? formData.fixedTime
                    : (formData.schedulingTime === "morning" ? "Matin (8h-13h)" : "Journée (10h+)")
            };

            const price = "Sur DEVIS";
            const message = formatBookingMessage("Ménage Post-sinistre", bookingData, price, isEntrepriseStatus);

            // Send Email & Record Demand
            const result = await sendBookingEmail("Ménage Post-sinistre", bookingData, price, isEntrepriseStatus);

            if (result.success) {
                setShowConfirmation(true);
            } else {
                if (result.emailSent) {
                    toast.warning("Demande envoyée par email, mais l'enregistrement automatique a échoué. Nous vous contacterons rapidement.");
                    setShowConfirmation(true);
                } else {
                    toast.error("Une erreur est survenue. Veuillez nous contacter via WhatsApp.");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue. Veuillez réessayer.");
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

    const serviceDescription = `Le service de ménage post-sinistre vise à rétablir rapidement la propreté des espaces. Assurer une intervention rapide et ciblée en cas de situation nécessitant une remise en état immédiate des lieux.

Les interventions d’urgence couvrent exclusivement les cas suivants :
- Incendie
- Inondation ou dégât des eaux
- Post/Après événement (fête, réception, rassemblement professionnel ou privé)
- Remise en état express des espaces avant ou après une occupation urgente`;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="bg-[hsl(var(--primary)/0.05)]" style={{ "--primary": SERVICE_COLORS.URGENCE_P.hsl } as React.CSSProperties}>
                <main className="flex-1">
                    <ServiceHeroSection
                        title="Ménage Post-sinistre"
                        description={serviceDescription}
                        image={serviceUrgence.src}
                        primaryColor={SERVICE_COLORS.URGENCE_P.hex}
                        faqs={[
                            {
                                question: "Quels types d'urgences et de sinistres prenez-vous en charge ?",
                                answer: "Nos équipes spécialisées interviennent pour toutes les situations critiques nécessitant une remise en état express : dégâts des eaux (fuites, inondations), nettoyage après un départ de feu ou un accident domestique, mais également pour des urgences non catastrophiques comme un grand nettoyage extrême après une fête, une réception ou un événement ayant laissé vos espaces très salis."
                            },
                            {
                                question: "Avez-vous le matériel nécessaire pour aspirer l'eau ou nettoyer la suie ?",
                                answer: "Oui, un sinistre ne se nettoie pas avec un simple balai. Nous déployons immédiatement un équipement industriel adapté à la situation : aspirateurs à eau haute puissance pour assécher vos sols après une inondation, monobrosses, et produits professionnels capables d'éliminer les traces de suie, les odeurs tenaces ou les résidus d'accidents domestiques."
                            },
                            {
                                question: "Délivrez-vous des devis valables pour les déclarations d'assurance ?",
                                answer: "Absolument. Lors d'un dégât des eaux ou d'un incendie, votre assurance habitation prend souvent en charge les frais de remise en état. Agence Ménage vous fournit rapidement un devis détaillé et officiel, conforme aux exigences des compagnies d'assurance marocaines, pour faciliter vos démarches de remboursement."
                            },
                            {
                                question: "Pouvez-vous intervenir très rapidement pour un nettoyage après une fête ?",
                                answer: "La réactivité est au cœur de ce service. Que ce soit pour masquer les traces d'un dégât des eaux ou pour remettre à neuf votre villa après une grande réception, nous mobilisons nos équipes en urgence sur tout Casablanca. Nous agissons avec une totale discrétion et une efficacité redoutable pour que vous retrouviez un intérieur impeccable dans les plus brefs délais."
                            }
                        ]}
                    />

                    <section id="booking-form" className="py-12 bg-transparent">
                        <div className="container max-w-5xl mx-auto px-4">
                            <div className="bg-primary/5 rounded-lg p-6 text-center mb-8 border border-primary/20">
                                <h2 className="text-2xl font-bold text-primary mb-2 uppercase tracking-wide">
                                    FORMULAIRE DE RESERVATION
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} noValidate className={`flex flex-col lg:grid lg:grid-cols-3 gap-8 ${wasValidated ? "was-validated" : ""}`}>
                                {/* Summary Card (Right Column on Desktop) */}
                                <div className="lg:col-span-1 lg:order-last sticky-reservation-summary-container">
                                    <div className="lg:sticky lg:top-24 space-y-6">
                                        <div className="bg-primary/5 rounded-lg border shadow-sm p-6 space-y-4 relative">
                                            <h3 className="text-xl font-bold text-primary border-b pb-2 text-center">
                                                Ma Réservation
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between gap-4 border-b border-primary/10 pb-2">
                                                    <span className="text-muted-foreground text-sm">Service:</span>
                                                    <span className="font-bold text-right text-slate-700 text-sm">Ménage Post-sinistre</span>
                                                </div>

                                                {/* Detailed info - hidden on mobile when collapsed */}
                                                <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                    <div className="flex justify-between gap-4 border-b border-primary/10 pb-2">
                                                        <span className="text-muted-foreground text-sm">Type d'habitation:</span>
                                                        <span className="font-medium text-right text-sm capitalize">{formData.propertyType}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4 border-b border-primary/10 pb-2">
                                                        <span className="text-muted-foreground text-sm">Surface:</span>
                                                        <span className="font-medium text-right text-sm">{formData.surface} m²</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4 border-b border-primary/10 pb-2">
                                                        <span className="text-muted-foreground text-sm">Nature:</span>
                                                        <span className="font-medium text-right text-sm">
                                                            {formData.interventionNature === 'degat_des_eaux' ? 'Dégât des eaux' :
                                                                formData.interventionNature === 'incendie' ? 'Incendie' :
                                                                    formData.interventionNature === 'inondation' ? 'Inondation' : 'Non précisé'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between gap-4 border-b border-primary/10 pb-2">
                                                        <span className="text-muted-foreground text-sm">Date:</span>
                                                        <span className="font-medium text-right text-sm">{formData.schedulingDate || "Non définie"}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4 border-b border-primary/10 pb-2">
                                                        <span className="text-muted-foreground text-sm">Heure:</span>
                                                        <span className="font-medium text-right text-sm">
                                                            {formData.schedulingType === "fixed" ? formData.fixedTime : (formData.schedulingTime === "morning" ? "Le matin" : "L'après midi")}
                                                        </span>
                                                    </div>


                                                </div>
                                            </div>

                                            <div className="pt-4 border-t">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold">Total</span>
                                                    <span className="text-xl font-black text-primary italic">SUR DEVIS</span>
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-1 italic text-center">Estimation finale après visite</p>
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

                                {/* Form Column (Left) */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-card rounded-lg p-4 md:p-6 border shadow-sm space-y-8">
                                        {/* Type d'habitation */}
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                                Type d'habitation
                                            </h3>
                                            <RadioGroup
                                                value={formData.propertyType}
                                                onValueChange={(val) => setFormData({ ...formData, propertyType: val })}
                                                className="flex flex-wrap gap-8 p-4"
                                            >
                                                {["Studio", "Appartement", "Duplex", "Villa", "Bureau"].map((type) => (
                                                    <div key={type} className="flex items-center space-x-3">
                                                        <RadioGroupItem value={type.toLowerCase()} id={`type-${type}`} className="border-primary text-primary" />
                                                        <Label htmlFor={`type-${type}`} className="font-medium text-slate-700 capitalize cursor-pointer">{type}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>

                                        {/* Nature de l'intervention */}
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                                Nature de l'intervention
                                            </h3>
                                            <RadioGroup
                                                value={formData.interventionNature}
                                                onValueChange={(val) => setFormData({ ...formData, interventionNature: val })}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4"
                                            >
                                                <div className="flex flex-col p-6 border-2 rounded-xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 bg-white shadow-sm relative min-h-[120px] justify-center text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <RadioGroupItem value="degat_des_eaux" id="degat_des_eaux" className="border-primary text-primary" />
                                                        <Label htmlFor="degat_des_eaux" className="font-bold text-lg cursor-pointer text-primary">Dégât des eaux</Label>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col p-6 border-2 rounded-xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 bg-white shadow-sm relative min-h-[120px] justify-center text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <RadioGroupItem value="incendie" id="incendie" className="border-primary text-primary" />
                                                        <Label htmlFor="incendie" className="font-bold text-lg cursor-pointer text-primary leading-tight">Incendie</Label>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col p-6 border-2 rounded-xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 bg-white shadow-sm relative min-h-[120px] justify-center text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <RadioGroupItem value="inondation" id="inondation" className="border-primary text-primary" />
                                                        <Label htmlFor="inondation" className="font-bold text-lg cursor-pointer text-primary">Inondation</Label>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                            <div className="mt-4 px-4">
                                                <Label className="font-bold text-primary text-sm mb-2 block">Donnez-nous plus d’informations sur votre demande</Label>
                                                <Textarea
                                                    placeholder="Détaillez ici votre besoin spécifique (type de sinistre, surface concernée, urgence particulière...)"
                                                    value={formData.additionalInfo}
                                                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                                                    className="min-h-[100px] border-primary/20"
                                                />
                                            </div>
                                        </div>

                                        {/* Superficie de l'espace */}
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                                Indiquez la superficie de votre espace en m²
                                            </h3>
                                            <div className="p-6 border border-primary/20 rounded-xl bg-white shadow-none flex items-center justify-start gap-4">
                                                <Label htmlFor="surface" className="font-bold text-slate-700 text-base shrink-0">
                                                    Surface (m²) :
                                                </Label>
                                                <Input
                                                    id="surface"
                                                    type="number"
                                                    min="1"
                                                    value={formData.surface}
                                                    onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                                                    className="w-32 text-center font-bold text-lg border-primary/20 focus-visible:ring-primary h-11"
                                                />
                                            </div>
                                        </div>

                                        {/* Planning */}
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                                Planning pour votre demande
                                            </h3>
                                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
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
                                                        <div className="font-extrabold text-slate-800 text-sm">Date d'intervention</div>
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



                                        {/* Où aura lieu votre ménage */}
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                                Où aura lieu votre ménage ?
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-xl bg-white mb-4">
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] font-bold text-primary uppercase ml-1 underline">Ville*</Label>
                                                    <Input
                                                        required
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        className="h-12 font-medium border-primary/20"
                                                        placeholder="Ex: Casablanca"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] font-bold text-primary uppercase ml-1 underline">Quartier*</Label>
                                                    <Input
                                                        placeholder="Votre quartier"
                                                        value={formData.neighborhood}
                                                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                        className="h-12 border-primary/20 bg-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-4 border rounded-xl bg-white shadow-sm">
                                                <Label className="font-bold text-primary text-sm mb-2 block">Champs de repère</Label>
                                                <Textarea
                                                    placeholder="Précisez-nous des repères pour faciliter le travail de notre équipe (Ex: En face de l'école ou à côté de la boulangerie) ainsi que les particularités de l'espace..."
                                                    value={formData.changeRepereNotes}
                                                    onChange={(e) => setFormData({ ...formData, changeRepereNotes: e.target.value })}
                                                    className="min-h-[120px] font-medium leading-relaxed border-slate-200"
                                                />
                                            </div>
                                        </div>

                                        {/* Mes Informations */}
                                        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 text-center">
                                                Mes informations
                                            </h3>
                                            <div className="p-6 grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-primary text-sm">Numéro de téléphone*</Label>
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
                                                    <Label className="font-bold text-primary text-sm">Numéro whatsapp</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={formData.whatsappPrefix}
                                                            onChange={(e) => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                                                            className="w-24 border-slate-300 font-bold text-primary text-center"
                                                            placeholder="+212"
                                                            disabled={formData.useWhatsappForPhone}
                                                        />
                                                        <Input
                                                            placeholder="6 12 00 00 00"
                                                            value={formData.whatsappNumber}
                                                            onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                                            className="border-slate-300 h-11 flex-1"
                                                            disabled={formData.useWhatsappForPhone}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-primary text-sm">Nom*</Label>
                                                    <Input
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                        required
                                                        className="h-11 border-slate-300 font-bold"
                                                        placeholder="Votre nom"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-primary text-sm">Prénom*</Label>
                                                    <Input
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                        required
                                                        className="h-11 border-slate-300 capitalize font-bold"
                                                        placeholder="Votre prénom"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center pt-8">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-bold shadow-lg shadow-primary/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95 tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Envoi en cours...
                                                    </div>
                                                ) : (
                                                    "Demander un devis"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>

                    <OtherServices type="particulier" currentServiceUrl="/services/particulier/menage-post-sinistre" />
                </main>
            </div>
            <Footer />

            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md bg-white border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed">
                            {getConfirmationMessage(formData.firstName, true)}
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

export default function NettoyageUrgenceClient() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-2xl text-primary animate-pulse">Chargement...</div>}>
            <NettoyageUrgenceContent />
        </Suspense>
    );
}
