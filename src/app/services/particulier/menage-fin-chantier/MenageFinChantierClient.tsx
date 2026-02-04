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
import { toast } from "sonner";
import serviceChantier from "@/assets/service-fin-chantier-particulier.png";
import { getConfirmationMessage } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
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
    surfaceArea: 50,
    city: "Casablanca",
    neighborhood: "",
    schedulingTime: "morning",
    schedulingHours: "09:00 - 12:00",
    schedulingDate: "",
    fixedTime: "14:00",
    additionalServices: {},
    phoneNumber: "",
    phonePrefix: "+212",
    useWhatsappForPhone: true,
    whatsappPrefix: "+212",
    whatsappNumber: "",
    firstName: "",
    lastName: "",
    changeRepereNotes: ""
};

export default function MenageFinChantierClient() {
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasValidated(true);

        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.city || !formData.neighborhood) {
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
            await sendBookingEmail("Nettoyage Fin de chantier", bookingData, "Sur devis", false);
            setShowConfirmation(true);
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

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div style={{ "--primary": "142 45% 40%", "--secondary": "142 30% 85%" } as React.CSSProperties}>
                <ServiceHeroSection
                    title="Nettoyage Fin de chantier"
                    description={`Le ménage de fin de chantier consiste à effectuer un nettoyage approfondi du logement ou des locaux après des travaux, afin de les rendre propres, sains et prêts à être utilisés.

La prestation comprend : L’évacuation des poussières et résidus de chantier, Le nettoyage des sols (balayage, aspiration et lavage),Le dépoussiérage et le nettoyage des surfaces, murs et plinthes accessibles, Le nettoyage des vitres accessibles et encadrements, La désinfection des sanitaires, Le nettoyage de la cuisine, L’entretien des escaliers, balcons, terrasses et autres espaces accessibles.`}
                    image={serviceChantier.src}
                    primaryColor="#c2e5c2"
                />

                <main className="flex-1 bg-background py-12">
                    <div className="container max-w-5xl">
                        <div className="bg-[#f0f9f0] rounded-lg p-6 text-center mb-8 border border-[#c2e5c2]">
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
                                                <span className="font-medium text-right text-slate-700 text-xs">Nettoyage Fin de chantier</span>
                                            </div>

                                            {/* Detailed info - hidden on mobile when collapsed */}
                                            <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Surface:</span>
                                                    <span className="font-medium text-right text-slate-700">{formData.surfaceArea} m²</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold">Total</span>
                                                <span className="text-xl font-bold text-primary italic">Sur devis</span>
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
                                        <h3 className="text-xl font-bold bg-[#c2e5c2] text-slate-800 p-3 rounded-lg mb-4 text-center">
                                            Type d'habitation
                                        </h3>
                                        <RadioGroup
                                            value={formData.propertyType}
                                            onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                                            className="flex flex-wrap gap-8 p-4"
                                        >
                                            {["Studio", "Appartement", "Duplex", "Villa", "Maison"].map((type) => (
                                                <div key={type} className="flex items-center space-x-3">
                                                    <RadioGroupItem value={type.toLowerCase()} id={type} className="border-primary text-primary" />
                                                    <Label htmlFor={type} className="font-medium text-slate-700">{type}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>

                                    <div className="bg-card rounded-lg border shadow-sm space-y-6">
                                        <h3 className="text-xl font-bold bg-[#c2e5c2] text-slate-800 p-3 rounded-lg mb-4 text-center">
                                            Indiquez la superficie de votre espace en m².
                                        </h3>
                                        <div className="p-8 space-y-8">
                                            <div className="flex items-center gap-4">
                                                <Label htmlFor="surface" className="font-bold text-slate-700 whitespace-nowrap">Surface (m²) :</Label>
                                                <Input
                                                    id="surface"
                                                    type="number"
                                                    min="1"
                                                    required
                                                    value={formData.surfaceArea}
                                                    onChange={(e) => setFormData({ ...formData, surfaceArea: parseInt(e.target.value) || 0 })}
                                                    className="text-lg font-bold border-slate-300 w-32"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-[#c2e5c2] text-slate-800 p-3 rounded-lg mb-4 text-center">
                                            Où aura lieu votre ménage ?
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-xl bg-white mb-4">
                                            <Input
                                                placeholder="Ville , Casablanca"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="border-slate-300"
                                            />
                                            <Input
                                                placeholder="Adresse"
                                                required
                                                value={formData.neighborhood}
                                                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                className="border-slate-300"
                                            />
                                        </div>
                                        <div className="p-4 border rounded-xl bg-white">
                                            <Label className="font-bold text-slate-700">Champs de repère</Label>
                                            <Textarea
                                                placeholder="Donnez-nous des repères pour faciliter le travail de ménage (points de référence pour la tournée du nettoyeur) après les points de repère"
                                                required
                                                value={formData.changeRepereNotes}
                                                onChange={(e) => setFormData({ ...formData, changeRepereNotes: e.target.value })}
                                                className="mt-2 border-slate-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <h3 className="text-xl font-bold bg-[#c2e5c2] text-slate-800 p-3 text-center">
                                            Mes informations
                                        </h3>
                                        <div className="p-4 bg-primary/5 text-center">
                                            <p className="text-sm font-bold text-primary">
                                                Un chargé de clientèle prendra contact avec vous dans les plus brefs délais.
                                            </p>
                                        </div>
                                        <div className="p-6 grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-slate-700 text-sm">Numéro de téléphone*</Label>
                                                <div className="space-y-3">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={formData.phonePrefix}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                phonePrefix: e.target.value,
                                                                whatsappPrefix: prev.useWhatsappForPhone ? e.target.value : prev.whatsappPrefix
                                                            }))}
                                                            className="w-24 border-slate-300 font-bold text-slate-600 text-center"
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
                                                <Label className="font-bold text-slate-700 text-sm">Numéro whatsapp</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={formData.whatsappPrefix}
                                                        onChange={(e) => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                                                        className="bg-slate-100 border rounded-lg w-24 text-center font-bold text-primary"
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
                                                <Label className="font-bold text-slate-700 text-sm">Nom*</Label>
                                                <Input
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    required
                                                    className="mt-1 border-slate-300 h-11"
                                                    placeholder="Votre nom"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-slate-700 text-sm">Prénom*</Label>
                                                <Input
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    required
                                                    className="mt-1 border-slate-300 h-11"
                                                    placeholder="Votre prénom"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center pt-8">
                                        <Button
                                            type="submit"
                                            className="bg-[#c2e5c2] hover:bg-[#b0dbb0] text-slate-800 px-8 py-4 text-base font-bold shadow-lg shadow-[#c2e5c2]/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95"
                                        >
                                            Demander un devis
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
                <DialogContent className="sm:max-w-md bg-[#f0f9f0] border-[#c2e5c2]/20">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed whitespace-pre-line">
                            {getConfirmationMessage(`${formData.firstName} ${formData.lastName}`, true)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button
                            onClick={() => handleCloseConfirmation(false)}
                            className="bg-[#c2e5c2] hover:bg-[#b0dbb0] text-slate-800 rounded-full px-8"
                        >
                            Fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
