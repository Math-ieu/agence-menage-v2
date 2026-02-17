"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceHeroSection from "@/components/ServiceHeroSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { createWhatsAppLink, formatBookingMessage, DESTINATION_PHONE_NUMBER, getConfirmationMessage } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
import serviceUrgence from "@/assets/service-nettoyage-urgence.png";
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
    propertyType: "appartement",
    interventionNature: "sinistre",
    schedulingType: "flexible",
    fixedTime: "14:00",
    schedulingTime: "morning",
    schedulingDate: "",
    additionalServices: {
        produitsEtOutils: false,
        torchonsEtSerpierres: false
    },
    city: "Casablanca",
    neighborhood: "",
    changeRepereNotes: "",
    phoneNumber: "",
    phonePrefix: "+212",
    useWhatsappForPhone: true,
    whatsappPrefix: "+212",
    whatsappNumber: "",
    firstName: "",
    lastName: "",
    frequency: "oneshot"
};

const NettoyageUrgenceContent = () => {
    const searchParams = useSearchParams();
    const isEntrepriseStatus = searchParams.get("type") === "entreprise";
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const SERVICE_COLOR = "#1e40af"; // Deep blue

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
            const message = formatBookingMessage("Nettoyage d'urgence", bookingData, price, isEntrepriseStatus);

            // Send Email
            await sendBookingEmail("Nettoyage d'urgence", bookingData, price, isEntrepriseStatus);

            // Open WhatsApp
            const whatsappLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, message);

            // window.open(whatsappLink, "_blank");

            setShowConfirmation(true);
        } catch (error) {
            toast.error("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    const handleCloseConfirmation = (open: boolean) => {
        setShowConfirmation(open);
        if (!open) {
            setWasValidated(false);
            setFormData(INITIAL_FORM_DATA);
        }
    };

    const serviceDescription = `Le service de nettoyage d’urgence vise à rétablir rapidement la propreté des espaces. Assurer une intervention rapide et ciblée en cas de situation nécessitant une remise en état immédiate des lieux.

Les interventions d’urgence couvrent exclusivement les cas suivants :
- Incendie
- Inondation ou dégât des eaux
- Post/Après événement (fête, réception, rassemblement professionnel ou privé)
- Remise en état express des espaces avant ou après une occupation urgente`;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div style={{ "--primary": "224 71% 40%" } as React.CSSProperties}>
                <main className="flex-1">
                    <ServiceHeroSection
                        title="Nettoyage d'urgence"
                        description={serviceDescription}
                        image={serviceUrgence.src}
                        primaryColor={SERVICE_COLOR}
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

                    <section id="booking-form" className="py-12 bg-background">
                        <div className="container max-w-5xl mx-auto px-4">
                            <div className="bg-[#f0f4f9] rounded-lg p-6 text-center mb-8 border border-[#1e40af]/20">
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
                                                    <span className="font-bold text-right text-slate-700 text-sm">Nettoyage d'urgence</span>
                                                </div>

                                                {/* Detailed info - hidden on mobile when collapsed */}
                                                <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                    <div className="flex justify-between gap-4 border-b border-primary/10 pb-2">
                                                        <span className="text-muted-foreground text-sm">Type:</span>
                                                        <span className="font-medium text-right text-sm capitalize">{formData.propertyType}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4 border-b border-primary/10 pb-2">
                                                        <span className="text-muted-foreground text-sm">Nature:</span>
                                                        <span className="font-medium text-right text-sm">
                                                            {formData.interventionNature === 'sinistre' ? 'Après sinistre' :
                                                                formData.interventionNature === 'event' ? 'Post évènement' :
                                                                    formData.interventionNature === 'express' ? 'Remise en état' : 'Autre situation'}
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

                                                    {(formData.additionalServices.produitsEtOutils || formData.additionalServices.torchonsEtSerpierres) && (
                                                        <div className="space-y-2 pt-2">
                                                            <span className="text-muted-foreground text-xs font-bold uppercase">Options:</span>
                                                            {formData.additionalServices.produitsEtOutils && (
                                                                <div className="flex justify-between gap-4 text-xs">
                                                                    <span>Produits:</span>
                                                                    <span className="font-medium">+90 MAD</span>
                                                                </div>
                                                            )}
                                                            {formData.additionalServices.torchonsEtSerpierres && (
                                                                <div className="flex justify-between gap-4 text-xs">
                                                                    <span>Torchons:</span>
                                                                    <span className="font-medium">+40 MAD</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
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
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4"
                                            >
                                                <div className="flex flex-col p-6 border-2 rounded-xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 bg-white shadow-sm relative min-h-[120px] justify-center text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="flex items-center space-x-3">
                                                            <RadioGroupItem value="sinistre" id="sinistre" className="border-primary text-primary" />
                                                            <Label htmlFor="sinistre" className="font-bold text-lg cursor-pointer text-primary">Nettoyage après sinistre</Label>
                                                        </div>
                                                        <p className="text-sm text-red-600 font-semibold">(incendie, inondation...)</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col p-6 border-2 rounded-xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 bg-white shadow-sm relative min-h-[120px] justify-center text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <RadioGroupItem value="event" id="event" className="border-primary text-primary" />
                                                        <Label htmlFor="event" className="font-bold text-lg cursor-pointer text-primary leading-tight">Nettoyage post/après évènement</Label>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col p-6 border-2 rounded-xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 bg-white shadow-sm relative min-h-[120px] justify-center text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <RadioGroupItem value="express" id="express" className="border-primary text-primary" />
                                                        <Label htmlFor="express" className="font-bold text-lg cursor-pointer text-primary">Remise en état express</Label>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col p-6 border-2 rounded-xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 bg-white shadow-sm relative min-h-[120px] justify-center text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <RadioGroupItem value="autre" id="autre" className="border-primary text-primary" />
                                                        <Label htmlFor="autre" className="font-bold text-lg cursor-pointer text-primary leading-tight">Autre situation urgente (à préciser)</Label>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        {/* Planning */}
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                                Planning pour votre demande
                                            </h3>
                                            <div className="grid md:grid-cols-3 gap-6 p-4 border rounded-xl bg-white">
                                                {/* Heure fixe */}
                                                <div className="text-center space-y-3">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            id="fixed"
                                                            name="schedulingType"
                                                            checked={formData.schedulingType === "fixed"}
                                                            onChange={() => setFormData({ ...formData, schedulingType: "fixed" })}
                                                            className="w-4 h-4 text-primary"
                                                        />
                                                        <Label htmlFor="fixed" className="font-bold text-primary text-sm cursor-pointer text-center">Je souhaite une heure fixe</Label>
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <Input
                                                            type="time"
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
                                                            id="flexible"
                                                            name="schedulingType"
                                                            checked={formData.schedulingType === "flexible"}
                                                            onChange={() => setFormData({ ...formData, schedulingType: "flexible" })}
                                                            className="w-4 h-4 text-primary"
                                                        />
                                                        <Label htmlFor="flexible" className="font-bold text-primary text-sm cursor-pointer text-center">Je suis flexible</Label>
                                                    </div>
                                                    <RadioGroup
                                                        value={formData.schedulingTime}
                                                        onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })}
                                                        disabled={formData.schedulingType !== "flexible"}
                                                        className="space-y-2 text-left inline-block"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="morning" id="morning" className="border-primary text-primary" />
                                                            <Label htmlFor="morning" className="text-sm font-medium">Le matin</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="afternoon" id="afternoon" className="border-primary text-primary" />
                                                            <Label htmlFor="afternoon" className="text-sm font-medium">L'après midi</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </div>

                                                {/* Date */}
                                                <div className="text-center space-y-3">
                                                    <div className="font-bold text-primary text-sm">Date d'intervention</div>
                                                    <Input
                                                        type="date"
                                                        required
                                                        value={formData.schedulingDate}
                                                        onChange={(e) => setFormData({ ...formData, schedulingDate: e.target.value })}
                                                        className="w-full border-slate-300 h-12 font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Service Optionnels */}
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                                Service Optionnels
                                            </h3>
                                            <div className="bg-primary/5 border-2 border-dashed rounded-xl p-8 space-y-6">
                                                <p className="text-center text-sm font-bold text-slate-600 uppercase tracking-widest">Produits fournis par l'agence :</p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 shadow-sm transition-all hover:border-primary/20">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                                                                🧴
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-sm text-primary">Produits : 90 MAD</p>
                                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Kit complet</p>
                                                            </div>
                                                        </div>
                                                        <Switch
                                                            checked={formData.additionalServices.produitsEtOutils}
                                                            onCheckedChange={(val) => setFormData({
                                                                ...formData,
                                                                additionalServices: { ...formData.additionalServices, produitsEtOutils: val }
                                                            })}
                                                            className="data-[state=checked]:bg-primary"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 shadow-sm transition-all hover:border-primary/20">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                                                                🧹
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-sm text-primary">Chiffons : 40 MAD</p>
                                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Torchons et serpillères</p>
                                                            </div>
                                                        </div>
                                                        <Switch
                                                            checked={formData.additionalServices.torchonsEtSerpierres}
                                                            onCheckedChange={(val) => setFormData({
                                                                ...formData,
                                                                additionalServices: { ...formData.additionalServices, torchonsEtSerpierres: val }
                                                            })}
                                                            className="data-[state=checked]:bg-primary"
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
                                                    <Label className="text-[10px] font-bold text-primary uppercase ml-1 underline">Adresse (précisez la votre)*</Label>
                                                    <Input
                                                        required
                                                        placeholder="Adresse"
                                                        value={formData.neighborhood}
                                                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                        className="h-12 font-medium border-primary/20"
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
                                                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-bold shadow-lg shadow-primary/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95 tracking-widest"
                                            >
                                                Confirmer ma réservation
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>

                    <section className="py-12 bg-slate-50 border-t">
                        <div className="container max-w-5xl mx-auto px-4 text-center">
                            <h2 className="text-2xl font-bold text-primary mb-8">Voir d'autres services</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Link href="/services/particulier/menage-standard" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow group">
                                    <h3 className="font-bold text-lg text-primary group-hover:text-primary/80 mb-2">Ménage Standard</h3>
                                    <p className="text-sm text-slate-600">Entretien régulier de votre domicile.</p>
                                </Link>
                                <Link href="/services/particulier/grand-menage" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow group">
                                    <h3 className="font-bold text-lg text-primary group-hover:text-primary/80 mb-2">Grand Ménage</h3>
                                    <p className="text-sm text-slate-600">Nettoyage en profondeur pour une hygiène totale.</p>
                                </Link>
                                <Link href="/" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow group">
                                    <h3 className="font-bold text-lg text-primary group-hover:text-primary/80 mb-2">Tous nos services</h3>
                                    <p className="text-sm text-slate-600">Découvrez l'ensemble de nos prestations.</p>
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />

            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md bg-[#f0f4f9] border-primary/20">
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
