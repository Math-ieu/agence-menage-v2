"use client";

import { useState, Suspense } from "react";
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
import { getConfirmationMessage } from "@/lib/whatsapp";
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

function NettoyageUrgenceContent() {
    const searchParams = useSearchParams();
    const isEntrepriseStatus = searchParams.get("type") === "entreprise";
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const SERVICE_COLOR = "#1e40af";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasValidated(true);
        if (!e.currentTarget.checkValidity()) { e.currentTarget.reportValidity(); return; }
        if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.neighborhood || !formData.schedulingDate) {
            toast.error("Veuillez remplir tous les champs obligatoires."); return;
        }

        try {
            const bookingData = {
                ...formData,
                phoneNumber: `${formData.phonePrefix} ${formData.phoneNumber}`,
                whatsappNumber: formData.useWhatsappForPhone ? `${formData.phonePrefix} ${formData.phoneNumber}` : `${formData.whatsappPrefix} ${formData.whatsappNumber}`,
                schedulingTime: formData.schedulingType === "fixed" ? formData.fixedTime : (formData.schedulingTime === "morning" ? "Matin (8h-13h)" : "Journée (10h+)")
            };
            const price = "Sur DEVIS";
            await sendBookingEmail("Nettoyage d'urgence", bookingData, price, isEntrepriseStatus);
            setShowConfirmation(true);
        } catch (error) { toast.error("Une erreur est survenue."); }
    };

    const handleCloseConfirmation = (open: boolean) => {
        setShowConfirmation(open);
        if (!open) { setWasValidated(false); setFormData(INITIAL_FORM_DATA); }
    };

    const serviceDescription = `Le service de nettoyage d’urgence vise à rétablir rapidement la propreté des espaces... (etc)`;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div style={{ "--primary": "224 71% 40%" } as React.CSSProperties}>
                <main className="flex-1">
                    <ServiceHeroSection title="Nettoyage d'urgence" description={serviceDescription} image={serviceUrgence.src} primaryColor={SERVICE_COLOR} />
                    <section id="booking-form" className="py-12 bg-background">
                        <div className="container max-w-5xl mx-auto px-4">
                            <div className="bg-[#f0f4f9] rounded-lg p-6 text-center mb-8 border border-[#1e40af]/20">
                                <h2 className="text-2xl font-bold text-primary mb-2 uppercase tracking-wide">FORMULAIRE DE RESERVATION</h2>
                            </div>
                            <form onSubmit={handleSubmit} noValidate className={`flex flex-col lg:grid lg:grid-cols-3 gap-8 ${wasValidated ? "was-validated" : ""}`}>
                                <div className="lg:col-span-1 lg:order-last sticky-reservation-summary-container">
                                    <div className="lg:sticky lg:top-24 space-y-6">
                                        <div className="bg-primary/5 rounded-lg border shadow-sm p-6 space-y-4 relative">
                                            <h3 className="text-xl font-bold text-primary border-b pb-2 text-center">Ma Réservation</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between gap-4 border-b border-primary/10 pb-2"><span className="text-muted-foreground text-sm">Service:</span><span className="font-bold text-right text-slate-700 text-sm">Nettoyage d'urgence</span></div>
                                                <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                    <div className="flex justify-between gap-4 border-b border-primary/10 pb-2"><span className="text-muted-foreground text-sm">Type:</span><span className="font-medium text-right text-sm capitalize">{formData.propertyType}</span></div>
                                                    <div className="flex justify-between gap-4 border-b border-primary/10 pb-2"><span className="text-muted-foreground text-sm">Nature:</span><span className="font-medium text-right text-sm">{formData.interventionNature === 'sinistre' ? 'Après sinistre' : formData.interventionNature === 'event' ? 'Post évènement' : formData.interventionNature === 'express' ? 'Remise en état' : 'Autre'}</span></div>
                                                    <div className="flex justify-between gap-4 border-b border-primary/10 pb-2"><span className="text-muted-foreground text-sm">Date:</span><span className="font-medium text-right text-sm">{formData.schedulingDate || "Non définie"}</span></div>
                                                    <div className="flex justify-between gap-4 border-b border-primary/10 pb-2"><span className="text-muted-foreground text-sm">Heure:</span><span className="font-medium text-right text-sm">{formData.schedulingType === "fixed" ? formData.fixedTime : (formData.schedulingTime === "morning" ? "Le matin" : "L'après midi")}</span></div>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t">
                                                <div className="flex justify-between items-center"><span className="text-lg font-bold">Total</span><span className="text-xl font-black text-primary italic">SUR DEVIS</span></div>
                                            </div>
                                            <button type="button" onClick={() => setIsSummaryExpanded(!isSummaryExpanded)} className="lg:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white z-20 transition-transform active:scale-90">{isSummaryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-card rounded-lg p-4 md:p-6 border shadow-sm space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">Type d'habitation</h3>
                                            <RadioGroup value={formData.propertyType} onValueChange={(val) => setFormData({ ...formData, propertyType: val })} className="flex flex-wrap gap-8 p-4">
                                                {["Studio", "Appartement", "Duplex", "Villa", "Bureau"].map((type) => (
                                                    <div key={type} className="flex items-center space-x-3">
                                                        <RadioGroupItem value={type.toLowerCase()} id={`type-${type}`} className="border-primary text-primary" />
                                                        <Label htmlFor={`type-${type}`} className="font-medium text-slate-700 capitalize cursor-pointer">{type}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">Nature de l'intervention</h3>
                                            <RadioGroup value={formData.interventionNature} onValueChange={(val) => setFormData({ ...formData, interventionNature: val })} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                                {["sinistre", "event", "express", "autre"].map(nature => (
                                                    <div key={nature} className="flex flex-col p-6 border-2 rounded-xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all bg-white shadow-sm justify-center text-center">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="flex items-center space-x-3">
                                                                <RadioGroupItem value={nature} id={nature} className="border-primary text-primary" />
                                                                <Label htmlFor={nature} className="font-bold text-lg cursor-pointer text-primary leading-tight">
                                                                    {nature === 'sinistre' ? 'Après sinistre' : nature === 'event' ? 'Post évènement' : nature === 'express' ? 'Remise en état' : 'Autre situation'}
                                                                </Label>
                                                            </div>
                                                            {nature === 'sinistre' && <p className="text-sm text-red-600 font-semibold">(incendie, inondation...)</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">Planning</h3>
                                            <div className="grid md:grid-cols-3 gap-6 p-4 border rounded-xl bg-white">
                                                <div className="text-center space-y-3">
                                                    <div className="flex items-center justify-center space-x-2"><input type="radio" id="fixed" name="schedulingType" checked={formData.schedulingType === "fixed"} onChange={() => setFormData({ ...formData, schedulingType: "fixed" })} className="w-4 h-4 text-primary" /><Label htmlFor="fixed" className="font-bold text-primary text-sm cursor-pointer">Heure fixe</Label></div>
                                                    <div className="flex justify-center"><input type="time" value={formData.fixedTime} onChange={(e) => setFormData({ ...formData, fixedTime: e.target.value })} disabled={formData.schedulingType !== "fixed"} className="w-32 text-center text-xl font-bold h-12 border-primary/30 rounded-md border" /></div>
                                                </div>
                                                <div className="text-center space-y-3">
                                                    <div className="flex items-center justify-center space-x-2"><input type="radio" id="flexible" name="schedulingType" checked={formData.schedulingType === "flexible"} onChange={() => setFormData({ ...formData, schedulingType: "flexible" })} className="w-4 h-4 text-primary" /><Label htmlFor="flexible" className="font-bold text-primary text-sm cursor-pointer">Flexible</Label></div>
                                                    <RadioGroup value={formData.schedulingTime} onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })} disabled={formData.schedulingType !== "flexible"} className="space-y-2 text-left inline-block">
                                                        <div className="flex items-center space-x-2"><RadioGroupItem value="morning" id="morning" className="border-primary text-primary" /><Label htmlFor="morning" className="text-sm font-medium">Matin</Label></div>
                                                        <div className="flex items-center space-x-2"><RadioGroupItem value="afternoon" id="afternoon" className="border-primary text-primary" /><Label htmlFor="afternoon" className="text-sm font-medium">Après-midi</Label></div>
                                                    </RadioGroup>
                                                </div>
                                                <div className="text-center space-y-3"><div className="font-bold text-primary text-sm">Date</div><Input type="date" required value={formData.schedulingDate} onChange={(e) => setFormData({ ...formData, schedulingDate: e.target.value })} className="w-full border-slate-300 h-12 font-bold" /></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">Options</h3>
                                            <div className="bg-primary/5 border-2 border-dashed rounded-xl p-8 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 shadow-sm transition-all hover:border-primary/20">
                                                        <div className="flex items-center gap-4">🧴<div><p className="font-black text-sm text-primary">Produits : 90 MAD</p></div></div>
                                                        <Switch checked={formData.additionalServices.produitsEtOutils} onCheckedChange={(val) => setFormData({ ...formData, additionalServices: { ...formData.additionalServices, produitsEtOutils: val } })} className="data-[state=checked]:bg-primary" />
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 shadow-sm transition-all hover:border-primary/20">
                                                        <div className="flex items-center gap-4">🧹<div><p className="font-black text-sm text-primary">Chiffons : 40 MAD</p></div></div>
                                                        <Switch checked={formData.additionalServices.torchonsEtSerpierres} onCheckedChange={(val) => setFormData({ ...formData, additionalServices: { ...formData.additionalServices, torchonsEtSerpierres: val } })} className="data-[state=checked]:bg-primary" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">Lieu</h3>
                                            <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-xl bg-white mb-4">
                                                <Input required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="h-12 border-primary/20" placeholder="Ville" />
                                                <Input required placeholder="Adresse" value={formData.neighborhood} onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} className="h-12 border-primary/20" />
                                            </div>
                                            <Textarea placeholder="Repères..." value={formData.changeRepereNotes} onChange={(e) => setFormData({ ...formData, changeRepereNotes: e.target.value })} className="min-h-[120px] border-slate-200" />
                                        </div>
                                        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 text-center uppercase">Informations</h3>
                                            <div className="p-6 grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-primary text-sm">Téléphone*</Label>
                                                    <div className="flex gap-2"><Input value={formData.phonePrefix} onChange={(e) => setFormData(p => ({ ...p, phonePrefix: e.target.value }))} className="w-24 border-slate-300 font-bold text-primary text-center" placeholder="+212" /><Input placeholder="6..." value={formData.phoneNumber} onChange={(e) => setFormData(p => ({ ...p, phoneNumber: e.target.value }))} required className="border-slate-300 h-11 flex-1" /></div>
                                                </div>
                                                <div className="space-y-2"><Label className="font-bold text-primary text-sm">Nom*</Label><Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required className="h-11 border-slate-300" placeholder="Votre nom" /></div>
                                                <div className="space-y-2"><Label className="font-bold text-primary text-sm">Prénom*</Label><Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required className="h-11 border-slate-300" placeholder="Votre prénom" /></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-center pt-8"><Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 font-bold rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95">Confirmer ma réservation</Button></div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md bg-[#f0f4f9] border-primary/20">
                    <DialogHeader><DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle><DialogDescription className="text-slate-700 text-lg mt-4">{getConfirmationMessage(formData.firstName, true)}</DialogDescription></DialogHeader>
                    <DialogFooter className="mt-6"><Button onClick={() => handleCloseConfirmation(false)} className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">Fermer</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function NettoyageUrgenceClient() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-2xl text-primary animate-pulse">Chargement...</div>}>
            <NettoyageUrgenceContent />
        </Suspense>
    );
}
