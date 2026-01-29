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
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import serviceGrandMenage from "@/assets/service-grand-menage.png";
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

const GrandMenageBureaux = () => {
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState({
        officeSurface: "50",
        frequency: "oneshot",
        subFrequency: "",
        duration: 6,
        numberOfPeople: 1,
        city: "",
        neighborhood: "",
        schedulingTime: "morning",
        schedulingDate: "",
        schedulingType: "flexible",
        fixedTime: "14:00",
        additionalServices: {
            produitsEtOutils: false
        },
        phoneNumber: "",
        phonePrefix: "+212",
        useWhatsappForPhone: true,
        whatsappPrefix: "+212",
        whatsappNumber: "",
        firstName: "",
        lastName: "",
        changeRepereNotes: ""
    });

    const perVisitPrice = Number(formData.officeSurface) * 10;
    let totalPrice = 0;
    let discountAmount = 0;
    const discountRate = 0.1;

    if (formData.frequency === "subscription") {
        const visitsMap: Record<string, number> = {
            "4foisSemaine": 4,
            "2foisMois": 0.5,
            "1foisSemaine": 1,
            "5foisSemaine": 5,
            "6foisSemaine": 6,
            "7foisSemaine": 7,
            "3foisSemaine": 3,
            "1semaine2": 0.5,
            "1foisMois": 0.25
        };
        const visitsPerWeek = visitsMap[formData.subFrequency] || 1;
        const subtotalMonthly = perVisitPrice * visitsPerWeek * 4;
        discountAmount = subtotalMonthly * discountRate;
        totalPrice = subtotalMonthly - discountAmount;
    } else {
        totalPrice = perVisitPrice;
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

        const message = formatBookingMessage("Grand Ménage Bureaux", bookingData, totalPrice, true);
        const whatsappLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, message);

        // Send email notification (async)
        sendBookingEmail("Grand Ménage Bureaux", bookingData, totalPrice, true).catch(console.error);

        // window.open(whatsappLink, '_blank');
        setShowConfirmation(true);
    };

    const calculateMinResources = (surface: string) => {
        const numericSurface = Number(surface);
        if (numericSurface <= 70) return { duration: 6, people: 1 };
        if (numericSurface <= 150) return { duration: 4, people: 2 };
        if (numericSurface < 300) return { duration: 8, people: 2 };
        return { duration: 8, people: 3 };
    };

    const incrementPeople = () => setFormData({ ...formData, numberOfPeople: formData.numberOfPeople + 1 });
    const decrementPeople = () => {
        const minResources = calculateMinResources(formData.officeSurface);
        if (formData.numberOfPeople > minResources.people) {
            setFormData({ ...formData, numberOfPeople: formData.numberOfPeople - 1 });
        }
    };

    const incrementDuration = () => setFormData({ ...formData, duration: formData.duration + 1 });
    const decrementDuration = () => {
        const minResources = calculateMinResources(formData.officeSurface);
        if (formData.duration > minResources.duration) {
            setFormData({ ...formData, duration: formData.duration - 1 });
        }
    };

    const handleSurfaceChange = (surface: string) => {
        const { duration: finalDuration, people: finalPeople } = calculateMinResources(surface);
        setFormData({
            ...formData,
            officeSurface: surface,
            duration: finalDuration,
            numberOfPeople: finalPeople
        });
    };

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
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Theme color: #52bc7e -> HSL: 145 45% 53% approx */}
            <div style={{ "--primary": "145 45% 53%" } as React.CSSProperties}>
                <ServiceHeroSection
                    title="Grand Ménage Bureaux"
                    description="Un nettoyage en profondeur pour vos locaux professionnels. Notre service spécialisé garantit un assainissement complet de vos bureaux, salles de réunion et espaces communs, réalisé par des experts avec des équipements adaptés."
                    image={serviceGrandMenage.src}
                    primaryColor="#52bc7e"
                />

                <main className="flex-1 bg-background py-12">
                    <div className="container max-w-5xl">
                        <div className="bg-primary/10 rounded-lg p-6 text-center mb-8">
                            <h2 className="text-2xl font-bold text-primary mb-2">
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
                                                <span className="font-medium text-right text-slate-700">Grand Ménage Bureaux</span>
                                            </div>

                                            {/* Detailed info - hidden on mobile when collapsed */}
                                            <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Fréquence:</span>
                                                    <span className="font-medium text-right text-slate-700">{getFrequencyLabel(formData.frequency, formData.subFrequency)}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Superficie:</span>
                                                    <span className="font-medium text-right text-slate-700">
                                                        {formData.officeSurface === "300" ? "300 m² et plus" : `${formData.officeSurface} m²`}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Personnes:</span>
                                                    <span className="font-medium text-right text-slate-700">{formData.numberOfPeople}</span>
                                                </div>
                                                {formData.additionalServices.produitsEtOutils && (
                                                    <div className="flex justify-between gap-4 text-xs">
                                                        <span className="text-muted-foreground">Produits & Outils:</span>
                                                        <span className="font-medium text-right text-slate-700 italic text-[10px]">Sur devis</span>
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
                                                <span className="text-2xl font-bold text-primary">{Math.round(totalPrice)} MAD</span>
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
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4">
                                            Indiquez la superficie de votre espace en m².
                                        </h3>
                                        <div className="px-8 py-10 border rounded-xl bg-white shadow-sm space-y-8">
                                            <div className="relative pt-6">
                                                <div className="absolute -top-4 left-0 transition-all duration-200" style={{ left: `${(Number(formData.officeSurface) / 300) * 100}%`, transform: 'translateX(-50%)' }}>
                                                    <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm border border-primary/20 whitespace-nowrap">
                                                        {formData.officeSurface === "300" ? "300m² et plus" : `${formData.officeSurface}m²`}
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[Number(formData.officeSurface)]}
                                                    onValueChange={(value) => handleSurfaceChange(value[0].toString())}
                                                    max={300}
                                                    min={0}
                                                    step={1}
                                                    className="cursor-pointer"
                                                />
                                                <div className="flex justify-between mt-4 text-xs font-medium text-slate-400">
                                                    <span>0m²</span>
                                                    <span>300m² et plus</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4">
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
                                                            <SelectTrigger className="w-full border-primary/20">
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

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4">
                                            Durée estimée
                                        </h3>
                                        <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="rounded-full disabled:opacity-30"
                                                onClick={decrementDuration}
                                                disabled={formData.duration <= calculateMinResources(formData.officeSurface).duration}
                                            >
                                                -
                                            </Button>
                                            <span className="text-xl font-semibold min-w-[60px] text-center">
                                                {formData.duration}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="rounded-full"
                                                onClick={incrementDuration}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4">
                                            Nombre de personne
                                        </h3>
                                        <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="rounded-full disabled:opacity-30"
                                                onClick={decrementPeople}
                                                disabled={formData.numberOfPeople <= calculateMinResources(formData.officeSurface).people}
                                            >
                                                -
                                            </Button>
                                            <span className="text-xl font-semibold min-w-[60px] text-center">
                                                {formData.numberOfPeople}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="rounded-full"
                                                onClick={incrementPeople}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4">
                                            Où aura lieu votre ménage ?
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded">
                                            <Input
                                                placeholder="Ville , Casablanca"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                            <Input
                                                placeholder="Quartier : j'inscris le nom"
                                                required
                                                value={formData.neighborhood}
                                                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                            />
                                        </div>
                                        <div className="mt-4 p-4 bg-muted/20 rounded">
                                            <Label className="font-semibold">Champs de repère</Label>
                                            <Textarea
                                                placeholder="Donnez-nous des repères pour faciliter le travail de ménage"
                                                required
                                                value={formData.changeRepereNotes}
                                                onChange={(e) => setFormData({ ...formData, changeRepereNotes: e.target.value })}
                                                className="mt-2"
                                            />
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
                                                        id="gm-bureau-fixed"
                                                        name="schedulingType"
                                                        checked={formData.schedulingType === "fixed"}
                                                        onChange={() => setFormData({ ...formData, schedulingType: "fixed" })}
                                                        className="w-4 h-4 text-[#c7dd54]"
                                                    />
                                                    <Label htmlFor="gm-bureau-fixed" className="font-bold text-[#c7dd54] text-sm cursor-pointer text-center">Je souhaite une heure fixe</Label>
                                                </div>
                                                <div className="flex justify-center">
                                                    <Input
                                                        type="time"
                                                        required
                                                        value={formData.fixedTime}
                                                        onChange={(e) => setFormData({ ...formData, fixedTime: e.target.value })}
                                                        disabled={formData.schedulingType !== "fixed"}
                                                        className="w-32 text-center text-xl font-bold h-12 border-[#c7dd54]/30"
                                                    />
                                                </div>
                                            </div>

                                            {/* Flexible */}
                                            <div className="text-center space-y-3">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="gm-bureau-flexible"
                                                        name="schedulingType"
                                                        checked={formData.schedulingType === "flexible"}
                                                        onChange={() => setFormData({ ...formData, schedulingType: "flexible" })}
                                                        className="w-4 h-4 text-[#c7dd54]"
                                                    />
                                                    <Label htmlFor="gm-bureau-flexible" className="font-bold text-[#c7dd54] text-sm cursor-pointer text-center">Je suis flexible</Label>
                                                </div>
                                                <RadioGroup
                                                    value={formData.schedulingTime}
                                                    onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })}
                                                    disabled={formData.schedulingType !== "flexible"}
                                                    className="space-y-2 text-left inline-block"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="morning" id="gm-bureau-morning" />
                                                        <Label htmlFor="gm-bureau-morning">Le matin</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="afternoon" id="gm-bureau-afternoon" />
                                                        <Label htmlFor="gm-bureau-afternoon">L'après midi</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            {/* Date */}
                                            <div className="text-center space-y-3">
                                                <div className="font-bold text-[#c7dd54] text-sm">Date</div>
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
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4">
                                            Services optionnels
                                        </h3>
                                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded">
                                            <div className="flex items-center gap-3">
                                                <span className="text-4xl">🧴</span>
                                                <span className="font-medium">Produits et outils + 90 MAD</span>
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

                                    <div className="bg-muted/30 rounded-lg p-6">
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 -m-6 mb-4">
                                            Mes informations
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Numéro de téléphone*</Label>
                                                <div className="space-y-3 mt-1">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={formData.phonePrefix}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                phonePrefix: e.target.value,
                                                                whatsappPrefix: prev.useWhatsappForPhone ? e.target.value : prev.whatsappPrefix
                                                            }))}
                                                            className="w-24 text-center font-bold text-primary"
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
                                                            className="flex-1"
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
                                            <div>
                                                <Label>Numéro whatsapp*</Label>
                                                <div className="flex gap-2 mt-1">
                                                    <Input
                                                        value={formData.whatsappPrefix}
                                                        onChange={(e) => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                                                        className="w-20 text-center font-bold text-primary"
                                                        placeholder="+212"
                                                        disabled={formData.useWhatsappForPhone}
                                                    />
                                                    <Input
                                                        placeholder="6 12 00 00 00"
                                                        value={formData.whatsappNumber}
                                                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                                        disabled={formData.useWhatsappForPhone}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Nom*</Label>
                                                <Input
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    required
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label>Prénom*</Label>
                                                <Input
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    required
                                                    className="mt-1"
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

            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent className="sm:max-w-md bg-primary/5 border-primary/20 text-center">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed">
                            {getConfirmationMessage(`${formData.firstName} ${formData.lastName}`, false)}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6 flex justify-center sm:justify-center">
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

export default GrandMenageBureaux;
