"use client";
import React, { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceHeroSection from "@/components/ServiceHeroSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createWhatsAppLink, formatBookingMessage, DESTINATION_PHONE_NUMBER, getConfirmationMessage } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
import { Checkbox } from "@/components/ui/checkbox";
import serviceMenagePonctuel from "@/assets/service-placement-gestion.png";
import "@/styles/sticky-summary.css";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

const PlacementEntreprise = () => {
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        serviceType: "flexible",
        structureType: "bureaux",
        frequency: "oneshot",
        subFrequency: "",
        numberOfPeople: 1,
        city: "",
        neighborhood: "",
        schedulingTime: "morning",
        schedulingDate: "",
        fixedTime: "14:00",
        entityName: "",
        contactPerson: "",
        phoneNumber: "",
        phonePrefix: "+212",
        useWhatsappForPhone: true,
        whatsappPrefix: "+212",
        whatsappNumber: "",
        email: "",
        changeRepereNotes: ""
    });

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

        if (!formData.entityName || !formData.contactPerson || !formData.phoneNumber || !formData.city || !formData.neighborhood || !formData.email) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        const frequencyLabel = getFrequencyLabel(formData.frequency, formData.subFrequency);

        const bookingData = {
            ...formData,
            frequencyLabel,
            phoneNumber: `${formData.phonePrefix} ${formData.phoneNumber}`,
            whatsappNumber: formData.useWhatsappForPhone
                ? `${formData.phonePrefix} ${formData.phoneNumber}`
                : `${formData.whatsappPrefix} ${formData.whatsappNumber}`
        };

        const message = formatBookingMessage("Placement & Gestion de Propreté", bookingData, "Sur devis", true);
        const whatsappLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, message);

        // Send email notification (async)
        sendBookingEmail("Placement & Gestion de Propreté", bookingData, "Sur devis", true).catch(console.error);

        // window.open(whatsappLink, '_blank');
        setShowConfirmation(true);
    };

    const incrementPeople = () => setFormData({ ...formData, numberOfPeople: formData.numberOfPeople + 1 });
    const decrementPeople = () => setFormData({ ...formData, numberOfPeople: Math.max(1, formData.numberOfPeople - 1) });

    const frequencies = [
        { value: "4foisSemaine", label: "4 fois par semaine" },
        { value: "2foisMois", label: "2 fois par mois" },
        { value: "1foisSemaine", label: "Une fois par semaine" },
        { value: "5foisSemaine", label: "5 fois par semaine" },
        { value: "6foisSemaine", label: "6 fois par semaine" },
        { value: "7foisSemaine", label: "7 fois par semaine" },
        { value: "3foisSemaine", label: "3 fois par semaine" },
        { value: "1semaine2", label: "Une semaine sur deux" },
        { value: "1foisMois", label: "1 fois par mois" }
    ];

    const getFrequencyLabel = (value: string, subValue: string) => {
        if (value === "oneshot") return "Une fois";
        const freq = frequencies.find(f => f.value === subValue);
        return freq ? `Abonnement - ${freq.label}` : "Abonnement";
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f0f4f0]">
            <Header />

            <main className="flex-1 flex flex-col" style={{ "--primary": "54 95% 49%" } as React.CSSProperties}>
                <ServiceHeroSection
                    title="Placement & Gestion de Propreté pour Entreprises"
                    isCollapsible={false}
                    description="Des solutions sur mesure pour l'entretien de vos locaux. Choisissez entre notre offre flexible pour garder le contrôle ou notre offre premium pour une gestion à 360° sans soucis."
                    image={serviceMenagePonctuel.src}
                    primaryColor="#f1db08"
                />

                <section className="py-16 container px-6">
                    <div className="grid md:grid-cols-2 gap-12 mb-16 px-4">
                        {/* Flexible Service */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-yellow-100 flex flex-col h-full">
                            <h2 className="text-2xl font-black text-[#2d5a3f] mb-6 uppercase border-b pb-4">Service ménage flexible :</h2>
                            <div className="space-y-4 text-slate-700 flex-1">
                                <p className="font-bold">Vous gardez la main sur l’organisation. Nous sécurisons toute la partie RH.</p>
                                <p className="text-sm leading-relaxed">
                                    Nous mettons à votre disposition une intervenante de ménage dédiée, aux horaires et au rythme qui conviennent à votre activité. Vos équipes pilotent les priorités sur site (zones, tâches, horaires), tandis qu’Agence Ménage prend en charge l’ensemble du “back-office” : administratif, paie, suivi et gestion des imprévus.
                                </p>
                                <div className="space-y-2 pt-4">
                                    <p className="font-bold text-sm uppercase text-[#2d5a3f]">Ce que vous obtenez :</p>
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                        <li>Zéro gestion RH (contrats, paie, suivi administratif)</li>
                                        <li>Stabilité & continuité : remplacement organisé en cas de départ ou d’insatisfaction</li>
                                        <li>Flexibilité : planning adapté à vos contraintes (matin, soir, week-end)</li>
                                        <li>Budget clair : une solution simple, sans complexité interne</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-auto pt-8">
                                <div className="bg-[#8b9d77] p-6 rounded-2xl shadow-sm text-center">
                                    <p className="text-[13px] font-bold text-white leading-relaxed">
                                        Idéal pour les entreprises qui veulent garder le contrôle opérationnel, tout en externalisant la gestion du personnel.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Premium Service */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-yellow-100 flex flex-col h-full ring-2 ring-[#f1db08]/20">
                            <h2 className="text-2xl font-black text-[#2d5a3f] mb-6 uppercase border-b pb-4">Service ménage Premium - gestion 360</h2>
                            <div className="space-y-4 text-slate-700 flex-1">
                                <p className="font-bold">Vous n’achetez pas “du ménage”. Vous achetez un standard de propreté garanti.</p>
                                <p className="text-sm leading-relaxed">
                                    Avec notre offre clé en main, nous pilotons la prestation de A à Z : dimensionnement des équipes, organisation, méthodes, produits, matériel et, selon la taille du dispositif, supervision sur place. Votre entreprise n’a rien à gérer : vous bénéficiez d’un service encadré, mesuré, et stable.
                                </p>
                                <div className="space-y-2 pt-4">
                                    <p className="font-bold text-sm uppercase text-[#2d5a3f]">Nos engagements (SLA) :</p>
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                        <li>Continuité garantie : en cas d’absence, remplacement le jour même</li>
                                        <li>Contrôle qualité : check-lists, inspections et plan d'actions correctives</li>
                                        <li>Réactivité : traitement des réclamations sous 24h avec actions concrètes</li>
                                    </ul>
                                </div>
                                <div className="space-y-2 pt-4">
                                    <p className="font-bold text-sm uppercase text-[#2d5a3f]">Ce que vous obtenez :</p>
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                        <li>Un plan de nettoyage sur mesure (zones critiques, sanitaires, open space...)</li>
                                        <li>Équipes dédiées + supervision (selon volumes)</li>
                                        <li>Reporting simple : suivi régulier, qualité mesurée</li>
                                        <li>Résultat constant, sans impact sur votre activité</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-auto pt-8">
                                <div className="bg-[#b48d43] p-6 rounded-2xl shadow-sm text-center">
                                    <p className="text-[13px] font-bold text-white leading-relaxed">
                                        Idéal pour les entreprises qui veulent un service premium, sans gestion interne, avec une obligation de résultat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mb-16">
                        <Button
                            onClick={scrollToForm}
                            className="bg-[#b46d2f] hover:bg-[#9a5d28] text-white px-8 py-4 text-base font-bold rounded-full shadow-lg shadow-[#b46d2f]/20 transition-all hover:scale-105 active:scale-95 h-auto"
                        >
                            Contactez-nous
                        </Button>
                    </div>

                    {showForm && (
                        <div
                            ref={formRef}
                            className="py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both"
                        >
                            <div className="max-w-5xl mx-auto">
                                <div className="bg-[#fefce8] rounded-lg p-6 text-center mb-8 border border-[#fef08a]">
                                    <h2 className="text-2xl font-bold text-[#2d5a3f] mb-2 uppercase tracking-wide">
                                        FORMULAIRE DE RESERVATION
                                    </h2>
                                </div>

                                <form id="booking-form" onSubmit={handleSubmit} noValidate className={`flex flex-col lg:grid lg:grid-cols-3 gap-8 ${wasValidated ? 'was-validated' : ''}`}>
                                    {/* Summary Column */}
                                    <div className="lg:col-span-1 lg:order-last sticky-reservation-summary-container">
                                        <div className="lg:sticky lg:top-24 space-y-6">
                                            <div className="bg-white rounded-lg border border-[#f1db08]/20 shadow-sm p-6 space-y-4 relative">
                                                <h3 className="text-xl font-bold text-[#b48d00] border-b border-[#f1db08]/10 pb-2 text-center">
                                                    Ma Réservation
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between gap-4 border-b border-slate-50 pb-2">
                                                        <span className="text-muted-foreground text-sm">Service:</span>
                                                        <span className="font-bold text-right text-[#b48d00] text-sm">Placement & Gestion</span>
                                                    </div>

                                                    {/* Detailed info - hidden on mobile when collapsed */}
                                                    <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-muted-foreground text-sm">Offre:</span>
                                                            <span className="font-medium text-right text-slate-700 text-sm capitalize">{formData.serviceType}</span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-muted-foreground text-sm">Structure:</span>
                                                            <span className="font-medium text-right text-slate-700 text-sm capitalize">{formData.structureType}</span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-muted-foreground text-sm">Fréquence:</span>
                                                            <span className="font-medium text-right text-slate-700 text-xs">
                                                                {getFrequencyLabel(formData.frequency, formData.subFrequency)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-muted-foreground text-sm">Personnel:</span>
                                                            <span className="font-medium text-right text-slate-700 text-sm">{formData.numberOfPeople} Pers.</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-[#5bbd82]/20">
                                                    <div className="flex justify-between items-center bg-[#f1db08]/5 p-3 rounded-lg border border-[#f1db08]/10">
                                                        <span className="text-xs font-bold text-[#b48d00] uppercase tracking-wider">Prix HT</span>
                                                        <span className="text-lg font-black text-[#b48d00]">SUR DEVIS</span>
                                                    </div>
                                                </div>

                                                {/* Toggle Button for Mobile */}
                                                <button
                                                    type="button"
                                                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                                    className="lg:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#b48d00] text-white flex items-center justify-center shadow-lg border-2 border-white z-20 hover:bg-[#b48d00]/90 transition-transform active:scale-90"
                                                >
                                                    {isSummaryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Fields Column */}
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="bg-white rounded-2xl p-4 md:p-8 border shadow-sm space-y-10">

                                            {/* Service Type Selection */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold bg-[#5bbd82]/10 text-[#2d5a3f] p-3 rounded-lg text-center uppercase border border-[#5bbd82]/20">
                                                    Type de service
                                                </h3>
                                                <RadioGroup
                                                    value={formData.serviceType}
                                                    onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                >
                                                    <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${formData.serviceType === "flexible" ? 'border-[#f1db08] bg-[#fefce8]' : 'border-slate-100 hover:border-yellow-200'}`}>
                                                        <RadioGroupItem value="flexible" id="serv-flexible" className="border-[#f1db08] text-[#f1db08]" />
                                                        <Label htmlFor="serv-flexible" className="font-bold text-sm text-slate-700 cursor-pointer">Service ménage flexible</Label>
                                                    </div>
                                                    <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${formData.serviceType === "premium" ? 'border-[#f1db08] bg-[#fefce8]' : 'border-slate-100 hover:border-yellow-200'}`}>
                                                        <RadioGroupItem value="premium" id="serv-premium" className="border-[#f1db08] text-[#f1db08]" />
                                                        <Label htmlFor={`serv-premium`} className="font-bold text-sm text-slate-700 cursor-pointer">Service ménage Premium</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            {/* Structure Type Selection */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold bg-[#f1db08]/10 text-[#b48d00] p-3 rounded-lg text-center uppercase border border-[#f1db08]/20">
                                                    Type de structure
                                                </h3>
                                                <div className="p-4 bg-muted/20 rounded-xl border border-muted">
                                                    <RadioGroup
                                                        value={formData.structureType}
                                                        onValueChange={(value) => setFormData({ ...formData, structureType: value })}
                                                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                                    >
                                                        {[
                                                            "Bureaux", "Magasin/Boutique", "Restaurant/Café", "Clinique",
                                                            "Hôpital", "Hôtel", "Riad", "Immeuble/Résidence/Luxe", "Entrepôt"
                                                        ].map((type) => (
                                                            <div key={type} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer group ${formData.structureType === type.toLowerCase() ? 'border-[#f1db08] bg-white ring-2 ring-[#f1db08]/10' : 'border-transparent bg-white/50 hover:bg-white'}`}>
                                                                <RadioGroupItem value={type.toLowerCase()} id={`struct-${type}`} className="mb-2 border-[#f1db08] text-[#f1db08]" />
                                                                <Label htmlFor={`struct-${type}`} className="font-bold text-[10px] text-slate-700 text-center leading-tight cursor-pointer">{type}</Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                </div>
                                            </div>

                                            {/* Frequency Section */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold bg-[#f1db08]/10 text-[#b48d00] p-3 rounded-lg text-center uppercase border border-[#f1db08]/20">
                                                    Choisissez la fréquence
                                                </h3>
                                                <div className="flex bg-slate-100 p-1 rounded-full w-full max-w-md mx-auto">
                                                    <button
                                                        type="button"
                                                        className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${formData.frequency === "oneshot"
                                                            ? "bg-[#f1db08] text-slate-800 shadow-sm"
                                                            : "text-slate-500 hover:text-[#b48d00]"
                                                            }`}
                                                        onClick={() => setFormData({ ...formData, frequency: "oneshot", subFrequency: "" })}
                                                    >
                                                        Une fois
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${formData.frequency === "subscription"
                                                            ? "bg-[#f1db08] text-slate-800 shadow-sm"
                                                            : "text-slate-500 hover:text-[#b48d00]"
                                                            }`}
                                                        onClick={() => setFormData({ ...formData, frequency: "subscription" })}
                                                    >
                                                        Abonnement
                                                    </button>
                                                </div>
                                                {formData.frequency === "subscription" && (
                                                    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <Select
                                                            value={formData.subFrequency}
                                                            onValueChange={(value) => setFormData({ ...formData, subFrequency: value })}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Fréquence d'abonnement" />
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

                                            {/* Resources Section */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold bg-[#f1db08]/10 text-[#b48d00] p-3 rounded-lg text-center uppercase border border-[#f1db08]/20">
                                                    Nombre de personne
                                                </h3>
                                                <div className="flex items-center justify-center gap-10 p-4 bg-slate-50 rounded-xl">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 rounded-full bg-slate-200 text-[#b48d00] hover:bg-slate-300 shadow-sm"
                                                        onClick={decrementPeople}
                                                    >
                                                        <span className="text-2xl">-</span>
                                                    </Button>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-3xl font-black text-[#b48d00] leading-none">
                                                            {formData.numberOfPeople}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 rounded-full bg-slate-200 text-[#b48d00] hover:bg-slate-300 shadow-sm"
                                                        onClick={incrementPeople}
                                                    >
                                                        <span className="text-2xl">+</span>
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Business Info Section */}
                                            <div className="space-y-6">
                                                <h3 className="text-lg font-bold bg-[#5bbd82]/10 text-[#2d5a3f] p-3 rounded-lg text-center uppercase border border-[#5bbd82]/20">
                                                    Les informations
                                                </h3>
                                                <p className="text-xs font-bold text-center text-slate-500 uppercase tracking-wider">
                                                    Un chargé de clientèle prendra contact avec vous dans les plus brefs délais.
                                                </p>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black text-slate-500 uppercase">Nom de l'entreprise*</Label>
                                                        <Input
                                                            placeholder="Votre société"
                                                            value={formData.entityName}
                                                            onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                                                            required
                                                            className="bg-white border-slate-200 focus:border-[#5bbd82] h-10"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black text-slate-500 uppercase">Personne à contacter*</Label>
                                                        <Input
                                                            placeholder="Nom complet"
                                                            value={formData.contactPerson}
                                                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                                            required
                                                            className="bg-white border-slate-200 focus:border-[#5bbd82] h-10"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black text-slate-500 uppercase">Téléphone*</Label>
                                                        <div className="space-y-3">
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    value={formData.phonePrefix}
                                                                    onChange={(e) => setFormData(prev => ({
                                                                        ...prev,
                                                                        phonePrefix: e.target.value,
                                                                        whatsappPrefix: prev.useWhatsappForPhone ? e.target.value : prev.whatsappPrefix
                                                                    }))}
                                                                    className="w-24 border-slate-300 font-bold text-[#1c6664] text-center"
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
                                                                    className="data-[state=checked]:bg-[#f1db08] border-[#f1db08]"
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
                                                        <Label className="text-xs font-black text-slate-500 uppercase">WhatsApp</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={formData.whatsappPrefix}
                                                                onChange={(e) => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                                                                className="bg-slate-50 border rounded-lg w-20 text-center font-bold text-[#b48d00] text-xs"
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
                                                    <div className="md:col-span-2 space-y-2">
                                                        <Label className="text-xs font-black text-slate-500 uppercase">Email*</Label>
                                                        <Input
                                                            type="email"
                                                            placeholder="votre@email.com"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            required
                                                            className="bg-white border-slate-200 focus:border-[#5bbd82] h-10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Location Section */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold bg-[#f1db08]/10 text-[#b48d00] p-3 rounded-lg text-center uppercase border border-[#f1db08]/20">
                                                    Où aura lieu votre ménage ?
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <Input
                                                        placeholder="Ville (ex: Casablanca)"
                                                        required
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        className="bg-white"
                                                    />
                                                    <Input
                                                        placeholder="Quartier (ex: Gauthier)"
                                                        required
                                                        value={formData.neighborhood}
                                                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                        className="bg-white"
                                                    />
                                                </div>
                                                <Textarea
                                                    placeholder="Champs de repère (Mosquée, École...)"
                                                    required
                                                    value={formData.changeRepereNotes}
                                                    onChange={(e) => setFormData({ ...formData, changeRepereNotes: e.target.value })}
                                                    className="bg-white h-20 resize-none"
                                                />
                                            </div>

                                            <div className="flex justify-center pt-8">
                                                <Button
                                                    type="submit"
                                                    className="bg-[#f1db08] hover:bg-[#e1cc07] text-slate-800 px-8 py-4 text-base font-bold shadow-lg shadow-[#f1db08]/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95"
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
                </section>
            </main>

            <Footer />

            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent className="sm:max-w-md bg-[#fefce8] border-[#f1db08]/20">
                    <DialogHeader>
                        <DialogTitle className="text-[#b48d00] text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed">
                            {getConfirmationMessage(formData.contactPerson, true)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button
                            onClick={() => setShowConfirmation(false)}
                            className="bg-[#f1db08] hover:bg-[#e1cc07] text-slate-800 rounded-full px-8"
                        >
                            Fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PlacementEntreprise;
