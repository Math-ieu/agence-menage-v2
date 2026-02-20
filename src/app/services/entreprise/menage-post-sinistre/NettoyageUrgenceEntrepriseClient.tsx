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
    propertyType: "bureau",
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
    frequency: "oneshot",
    additionalInfo: ""
};

const NettoyageUrgenceContent = () => {
    const searchParams = useSearchParams();
    const isEntrepriseStatus = true;
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
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
            const message = formatBookingMessage("Ménage Post-sinistre (Entreprise)", bookingData, price, true);

            // Send Email
            await sendBookingEmail("Ménage Post-sinistre (Entreprise)", bookingData, price, true);

            // Open WhatsApp
            const whatsappLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, message);

            router.push(window.location.pathname + "/merci");
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

    const serviceDescription = `Le service de ménage post-sinistre en entreprise vise à rétablir la continuité de vos activités. Nous assurons une intervention rapide et professionnelle pour la remise en état de vos bureaux, locaux commerciaux ou entrepôts.

Nos équipes interviennent en urgence pour :
- Incendie ou départ de feu
- Dégâts des eaux et inondations
- Nettoyage expert après un événement professionnel
- Remise en état express avant inauguration ou visite importante`;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="bg-[hsl(var(--primary)/0.05)]" style={{ "--primary": SERVICE_COLORS.URGENCE_E.hsl } as React.CSSProperties}>
                <main className="flex-1">
                    <ServiceHeroSection
                        title="Ménage Post-sinistre"
                        description={serviceDescription}
                        image={serviceUrgence.src}
                        primaryColor={SERVICE_COLORS.URGENCE_E.hex}
                        faqs={[
                            {
                                question: "Quelle est votre réactivité pour une intervention en entreprise ?",
                                answer: "Pour un sinistre en milieu professionnel, chaque heure compte. Nous mobilisons nos équipes en priorité pour Casablanca afin de minimiser l'arrêt de votre activité. Notre objectif est une intervention dans les plus brefs délais après validation du devis."
                            },
                            {
                                question: "Disposez-vous d'équipements adaptés aux grands volumes ?",
                                answer: "Oui, nous sommes équipés de matériel industriel : aspirateurs de grande capacité, monobrosses professionnelles et agents nettoyants spécifiques pour traiter les locaux professionnels après un sinistre ou un événement de grande ampleur."
                            },
                            {
                                question: "Le devis est-il accepté par les assurances pro ?",
                                answer: "Tout à fait. Nous fournissons une facture et un devis détaillés conformes aux exigences des assurances professionnelles au Maroc pour faciliter la prise en charge de la remise en état de vos locaux."
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
                                                    <span className="font-bold text-right text-slate-700 text-sm">Ménage Post-sinistre Pro</span>
                                                </div>

                                                <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                    <div className="flex justify-between gap-4 border-b border-primary/10 pb-2">
                                                        <span className="text-muted-foreground text-sm">Type:</span>
                                                        <span className="font-medium text-right text-sm capitalize">{formData.propertyType}</span>
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
                                                <p className="text-[10px] text-gray-400 mt-1 italic text-center">Estimation pro après visite</p>
                                            </div>

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
                                        {/* Type de local */}
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                                Type de local professionnel
                                            </h3>
                                            <RadioGroup
                                                value={formData.propertyType}
                                                onValueChange={(val) => setFormData({ ...formData, propertyType: val })}
                                                className="flex flex-wrap gap-8 p-4"
                                            >
                                                {["Bureaux", "Commerce", "Showroom", "Entrepôt", "Autre"].map((type) => (
                                                    <div key={type} className="flex items-center space-x-3">
                                                        <RadioGroupItem value={type.toLowerCase()} id={`type-${type}`} className="border-primary text-primary" />
                                                        <Label htmlFor={`type-${type}`} className="font-medium text-slate-700 capitalize cursor-pointer">{type}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>

                                        {/* Nature de l'urgence */}
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                                Nature de l'urgence pro
                                            </h3>
                                            <RadioGroup
                                                value={formData.interventionNature}
                                                onValueChange={(val) => setFormData({ ...formData, interventionNature: val })}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4"
                                            >
                                                <div className="flex flex-col p-6 border-2 rounded-xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 bg-white shadow-sm relative min-h-[120px] justify-center text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <RadioGroupItem value="sinistre" id="sinistre" className="border-primary text-primary" />
                                                        <Label htmlFor="sinistre" className="font-bold text-lg cursor-pointer text-primary leading-tight">Dégât des eaux / Incendie</Label>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col p-6 border-2 rounded-xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 bg-white shadow-sm relative min-h-[120px] justify-center text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <RadioGroupItem value="event" id="event" className="border-primary text-primary" />
                                                        <Label htmlFor="event" className="font-bold text-lg cursor-pointer text-primary leading-tight">Post-événement pro</Label>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col p-6 border-2 rounded-xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 bg-white shadow-sm relative min-h-[120px] justify-center text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <RadioGroupItem value="express" id="express" className="border-primary text-primary" />
                                                        <Label htmlFor="express" className="font-bold text-lg cursor-pointer text-primary leading-tight">Remise en état inaugurale</Label>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col p-6 border-2 rounded-xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 bg-white shadow-sm relative min-h-[120px] justify-center text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <RadioGroupItem value="autre" id="autre" className="border-primary text-primary" />
                                                        <Label htmlFor="autre" className="font-bold text-lg cursor-pointer text-primary leading-tight">Autre besoin immédiat</Label>
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

                                        {/* Planning */}
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                                Planning d'intervention pro
                                            </h3>
                                            <div className="grid md:grid-cols-3 gap-6 p-4 border rounded-xl bg-white">
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
                                                        <Label htmlFor="fixed" className="font-bold text-primary text-sm cursor-pointer text-center">Heure fixe souhaitée</Label>
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
                                                        <Label htmlFor="flexible" className="font-bold text-primary text-sm cursor-pointer text-center">Flexible (Matin/AM)</Label>
                                                    </div>
                                                    <RadioGroup
                                                        value={formData.schedulingTime}
                                                        onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })}
                                                        disabled={formData.schedulingType !== "flexible"}
                                                        className="space-y-2 text-left inline-block"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="morning" id="morning" className="border-primary text-primary" />
                                                            <Label htmlFor="morning" className="text-sm font-medium">Matinée</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="afternoon" id="afternoon" className="border-primary text-primary" />
                                                            <Label htmlFor="afternoon" className="text-sm font-medium">Après-midi</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </div>

                                                <div className="text-center space-y-3">
                                                    <div className="font-bold text-primary text-sm">Date souhaitée</div>
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

                                        {/* Localisation */}
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                                Où se situe votre entreprise ?
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
                                                    <Label className="text-[10px] font-bold text-primary uppercase ml-1 underline">Adresse professionnelle*</Label>
                                                    <Input
                                                        required
                                                        placeholder="Adresse complète"
                                                        value={formData.neighborhood}
                                                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                        className="h-12 font-medium border-primary/20"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-4 border rounded-xl bg-white shadow-sm">
                                                <Label className="font-bold text-primary text-sm mb-2 block">Notes spécifiques pour l'intervention</Label>
                                                <Textarea
                                                    placeholder="Précisez ici les accès, les contraintes horaires professionnelles ou toute information utile pour notre équipe d'intervention..."
                                                    value={formData.changeRepereNotes}
                                                    onChange={(e) => setFormData({ ...formData, changeRepereNotes: e.target.value })}
                                                    className="min-h-[120px] font-medium leading-relaxed border-slate-200"
                                                />
                                            </div>
                                        </div>

                                        {/* Mes Informations */}
                                        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 text-center">
                                                Informations de contact entreprise
                                            </h3>
                                            <div className="p-6 grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-primary text-sm">Téléphone mobile direct*</Label>
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
                                                    <Label className="font-bold text-primary text-sm"> WhatsApp professionnel</Label>
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
                                                    <Label className="font-bold text-primary text-sm">Nom du contact*</Label>
                                                    <Input
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                        required
                                                        className="h-11 border-slate-300 font-bold"
                                                        placeholder="Nom"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-primary text-sm">Prénom du contact*</Label>
                                                    <Input
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                        required
                                                        className="h-11 border-slate-300 capitalize font-bold"
                                                        placeholder="Prénom"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center pt-8">
                                            <Button
                                                type="submit"
                                                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-bold shadow-lg shadow-primary/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95 tracking-widest"
                                            >
                                                Demander un devis
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                </main>
                <OtherServices type="entreprise" currentServiceUrl="/services/entreprise/menage-post-sinistre" />
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

export default function NettoyageUrgenceEntrepriseClient() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-2xl text-primary animate-pulse">Chargement...</div>}>
            <NettoyageUrgenceContent />
        </Suspense>
    );
}
