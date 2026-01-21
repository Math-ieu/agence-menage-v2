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
import serviceAirbnb from "@/assets/service-menage-airbnb.png";
import { createWhatsAppLink, formatBookingMessage, DESTINATION_PHONE_NUMBER, getConfirmationMessage } from "@/lib/whatsapp";
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

const MenageAirbnb = () => {
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState({
        propertyType: "studio",
        frequency: "oneshot",
        duration: 4,
        numberOfPeople: 1,
        city: "",
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
    });

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

        const message = formatBookingMessage("Ménage Airbnb", bookingData, "Sur devis", false);
        const whatsappLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, message);

        // Send email notification (async)
        sendBookingEmail("Ménage Airbnb", bookingData, "Sur devis", false).catch(console.error);

        window.open(whatsappLink, '_blank');
        setShowConfirmation(true);
    };

    const incrementPeople = () => setFormData({ ...formData, numberOfPeople: formData.numberOfPeople + 1 });
    const decrementPeople = () => setFormData({ ...formData, numberOfPeople: Math.max(1, formData.numberOfPeople - 1) });

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div style={{ "--primary": "175 35% 72%" } as React.CSSProperties}>
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
                    primaryColor="#9ed2ce"
                />

                <main className="flex-1 bg-background py-12">
                    <div className="container max-w-5xl">
                        <div className="bg-[#f0f9f8] rounded-lg p-6 text-center mb-8 border border-[#9ed2ce]/30">
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
                                                <span className="font-medium text-right text-slate-700">Ménage Airbnb</span>
                                            </div>

                                            {/* Detailed info - hidden on mobile when collapsed */}
                                            <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Fréquence:</span>
                                                    <span className="font-medium text-right text-slate-700">
                                                        {formData.frequency === "oneshot" ? "Une fois" : "Abonnement"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Personnes:</span>
                                                    <span className="font-medium text-right text-slate-700">{formData.numberOfPeople}</span>
                                                </div>
                                                <div className="flex justify-between gap-4 border-t border-primary/10 pt-2">
                                                    <span className="text-muted-foreground">Date:</span>
                                                    <span className="font-medium text-right text-slate-700">{formData.schedulingDate || "Non définie"}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Heure:</span>
                                                    <span className="font-medium text-right text-slate-700">{formData.fixedTime}</span>
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
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
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

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                            Choisissez la fréquence
                                        </h3>
                                        <div className="p-4 space-y-4">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="flex bg-slate-100 p-1 rounded-full w-full max-w-md mx-auto">
                                                    <button
                                                        type="button"
                                                        className={`flex-1 py-3 px-6 rounded-full font-bold transition-all ${formData.frequency === "oneshot"
                                                            ? "bg-primary text-white shadow-sm"
                                                            : "text-slate-500 hover:text-primary"
                                                            }`}
                                                        onClick={() => setFormData({ ...formData, frequency: "oneshot" })}
                                                    >
                                                        une fois
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
                                                    <div className="text-center animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <p className="text-sm font-bold text-primary">
                                                            Variable selon les réservations
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4">
                                            Nombre de personne
                                        </h3>
                                        <div className="flex items-center justify-center gap-8 p-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-10 w-10 rounded-full border-primary text-primary hover:bg-primary/10"
                                                onClick={decrementPeople}
                                            >
                                                <span className="text-2xl">-</span>
                                            </Button>
                                            <span className="text-2xl font-bold text-primary min-w-[40px] text-center">
                                                {formData.numberOfPeople}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-10 w-10 rounded-full border-primary text-primary hover:bg-primary/10"
                                                onClick={incrementPeople}
                                            >
                                                <span className="text-2xl">+</span>
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                            Planning pour votre demande
                                        </h3>
                                        <div className="grid md:grid-cols-3 gap-6 p-4 border rounded-xl bg-white">
                                            <div className="text-center space-y-3">
                                                <div className="font-bold text-primary text-sm">Je souhaite une heure fixe</div>
                                                <div className="flex justify-center">
                                                    <Input
                                                        type="time"
                                                        required
                                                        value={formData.fixedTime}
                                                        onChange={(e) => setFormData({ ...formData, fixedTime: e.target.value })}
                                                        className="w-32 text-center text-xl font-bold h-12 border-primary/30"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-center space-y-3">
                                                <div className="font-bold text-primary text-sm">Je suis flexible et disponible</div>
                                                <RadioGroup
                                                    value={formData.schedulingTime}
                                                    onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })}
                                                    className="space-y-2 text-left inline-block"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="morning" id="morning" className="border-primary text-primary" />
                                                        <Label htmlFor="morning" className="text-sm font-medium">Le matin (09h - 12h)</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="afternoon" id="afternoon" className="border-primary text-primary" />
                                                        <Label htmlFor="afternoon" className="text-sm font-medium">L'après midi (13h - 18h)</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
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
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
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
                                                placeholder="Quartier : j'inscris le nom"
                                                required
                                                value={formData.neighborhood}
                                                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                className="border-slate-300"
                                            />
                                        </div>
                                        <div className="p-4 border rounded-xl bg-white">
                                            <Label className="font-bold text-primary">Champs de repère</Label>
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
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 text-center">
                                            Mes informations
                                        </h3>
                                        <div className="p-6 grid md:grid-cols-2 gap-4">
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
                                                <Label className="font-bold text-primary text-sm">Nom*</Label>
                                                <Input
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    required
                                                    className="mt-1 border-slate-300 h-11"
                                                    placeholder="Votre nom"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-primary text-sm">Prénom*</Label>
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
                                            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-bold shadow-lg shadow-primary/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95"
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

            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent className="sm:max-w-md bg-[#f0f9f8] border-[#9ed2ce]/20">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed">
                            {getConfirmationMessage(`${formData.firstName} ${formData.lastName}`, true)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button
                            onClick={() => setShowConfirmation(false)}
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

export default MenageAirbnb;
