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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import serviceRegulier from "@/assets/service-menage-standard.png";
import cleaningProduct from "@/assets/cleaning-product.png";
import { createWhatsAppLink, formatBookingMessage, DESTINATION_PHONE_NUMBER, getConfirmationMessage } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
import { calculateSurchargeMultiplier } from "@/lib/pricing";
import "@/styles/sticky-summary.css";
import { FREQUENCES } from "@/app/frequences";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

const PRODUCTS_LIST = [
    "Nettoyant multi-usage",
    "Produit vitre, dégraissant",
    "Produit de vaisselle",
    "Produit bois et parqués",
    "Neutralisant d’odeur"
];

const INITIAL_FORM_DATA = {
    propertyType: "studio",
    frequency: "oneshot",
    subFrequency: "",
    duration: 4,
    recommendedDuration: 4,
    numberOfPeople: 1,
    city: "",
    neighborhood: "",
    rooms: {
        cuisine: 0,
        suiteAvecBain: 0,
        suiteSansBain: 0,
        salleDeBain: 0,
        chambre: 0,
        salonMarocain: 0,
        salonEuropeen: 0,
        toilettesLavabo: 0,
        rooftop: 0,
        escalier: 0
    } as Record<string, number>,
    schedulingTime: "morning",
    schedulingDate: "",
    schedulingType: "flexible",
    fixedTime: "14:00",
    additionalServices: {
        produitsEtOutils: false,
        torchonsEtSerpierres: false
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

export default function MenageStandardClient() {
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const baseRate = 60;

    // Pricing Logic
    let totalServicePrice = 0;
    let visitsPerWeek = 1;
    let discountRate = 0;
    let discountAmount = 0;

    const multiplier = calculateSurchargeMultiplier(
        formData.schedulingDate,
        formData.schedulingType,
        formData.fixedTime,
        formData.schedulingTime
    );

    if (formData.frequency === "subscription") {
        const visitsMap: Record<string, number> = {
            "1foisParSemaine": 1,
            "2foisParSemaine": 2,
            "3foisParSemaine": 3,
            "4foisParSemaine": 4,
            "5foisParSemaine": 5,
            "6foisParSemaine": 6,
            "7foisParSemaine": 7,
            "3foisParMois": 3 / 4,
            "2foisParMois": 0.5,
            "1foisParMois": 0.25,
            "4foisParMois": 1,
        };
        visitsPerWeek = visitsMap[formData.subFrequency] || 1;
        discountRate = 0.1;
        const monthlyHours = formData.duration * visitsPerWeek * 4;
        const subtotalMonthly = monthlyHours * baseRate * formData.numberOfPeople;
        discountAmount = subtotalMonthly * discountRate;
        totalServicePrice = (subtotalMonthly - discountAmount) * multiplier;
    } else {
        totalServicePrice = formData.duration * baseRate * formData.numberOfPeople * multiplier;
    }

    const calculateTotal = () => {
        let price = totalServicePrice;
        if (formData.additionalServices.produitsEtOutils) price += 90;
        if (formData.additionalServices.torchonsEtSerpierres) price += 40;
        return price;
    };

    const totalPrice = calculateTotal();

    const frequencies = FREQUENCES;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasValidated(true);

        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        const roomsSelected = Object.values(formData.rooms).some(count => count > 0);
        if (!roomsSelected) {
            toast.error("Veuillez décrire les pièces de votre logement avant de continuer");
            const roomsSection = document.getElementById('rooms-section');
            if (roomsSection) {
                roomsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        const frequencyLabel = formData.frequency === "oneshot"
            ? "Une fois"
            : (frequencies.find(f => f.value === formData.subFrequency)?.label || "");

        const bookingData = {
            ...formData,
            frequencyLabel,
            phoneNumber: `${formData.phonePrefix} ${formData.phoneNumber}`,
            whatsappNumber: formData.useWhatsappForPhone
                ? `${formData.phonePrefix} ${formData.phoneNumber}`
                : `${formData.whatsappPrefix} ${formData.whatsappNumber}`
        };

        // Send email notification (async)
        sendBookingEmail("Ménage Standard", bookingData, totalPrice, false).catch(console.error);

        setShowConfirmation(true);
    };

    const handleCloseConfirmation = (open: boolean) => {
        setShowConfirmation(open);
        if (!open) {
            setFormData(INITIAL_FORM_DATA);
            setWasValidated(false);
        }
    };

    const incrementPeople = () => setFormData({ ...formData, numberOfPeople: formData.numberOfPeople + 1 });
    const decrementPeople = () => setFormData({ ...formData, numberOfPeople: Math.max(1, formData.numberOfPeople - 1) });

    const incrementDuration = () => setFormData({ ...formData, duration: formData.duration + 1 });
    const decrementDuration = () => setFormData({ ...formData, duration: Math.max(4, formData.duration - 1) });

    const calculateEstimation = (rooms: typeof formData.rooms) => {
        const roomTimes: Record<string, number> = {
            cuisine: 45,
            suiteAvecBain: 75,
            suiteSansBain: 45,
            salleDeBain: 30,
            chambre: 40,
            salonMarocain: 35,
            salonEuropeen: 35,
            toilettesLavabo: 25,
            rooftop: 30,
            escalier: 25
        };

        let totalMinutes = 0;
        Object.entries(rooms).forEach(([key, count]) => {
            totalMinutes += (roomTimes[key] || 0) * (count as number);
        });

        const calculatedHours = Math.ceil(totalMinutes / 60);
        const recommendedDuration = Math.max(4, calculatedHours);

        setFormData(prev => ({
            ...prev,
            recommendedDuration,
            rooms
        }));
    };

    const updateRoomCount = (room: string, increment: boolean) => {
        const newCount = Math.max(0, formData.rooms[room] + (increment ? 1 : -1));
        const newRooms = {
            ...formData.rooms,
            [room]: newCount
        };
        calculateEstimation(newRooms);
    };

    const getFrequencyLabel = (value: string, subValue: string) => {
        if (value === "oneshot") return "Une fois";
        const freq = frequencies.find(f => f.value === subValue);
        return freq ? `Abonnement - ${freq.label}` : "Abonnement";
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div style={{ "--primary": "179 48% 30%" } as React.CSSProperties}>
                <ServiceHeroSection
                    title="Ménage standard"
                    description={`Le ménage standard a pour objectif d’assurer la propreté et l’entretien courant des espaces attribués.
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
                    image={serviceRegulier.src}
                    primaryColor="#1c6664"
                    faqs={[
                        {
                            question: "Fournissez-vous le matériel et les produits de nettoyage ?",
                            answer: "Pour des raisons d'hygiène strictes et pour respecter les spécificités de vos surfaces, nos intervenantes utilisent votre propre équipement de base (aspirateur, balai, seau). Toutefois, pour vous simplifier totalement le quotidien, nous proposons un Pack Entretien en option. Ce kit complet et prêt à l'emploi inclut 6 produits de nettoyage efficaces, des torchons adaptés et une serpillière neuve. Il vous suffit de cocher cette option lors de votre réservation pour que notre équipe s'occupe de tout lors de son passage chez vous à Casablanca."
                        },
                        {
                            question: "Dois-je obligatoirement être présent(e) à mon domicile pendant la prestation ?",
                            answer: "Non, votre présence n'est absolument pas requise. La majorité de nos clients à Casablanca nous confient l'accès (clés laissées au concierge, boîte à clés ou ouverture en début de séance) pour que nous puissions intervenir en leur absence. Nos femmes de ménage sont rigoureusement sélectionnées pour leur fiabilité et formées à travailler en toute autonomie et discrétion. Vous pouvez donc partir l'esprit tranquille et retrouver votre intérieur impeccable à votre retour."
                        },
                        {
                            question: "Aurai-je toujours la même femme de ménage à chaque intervention ?",
                            answer: "Notre objectif est de vous assurer une continuité de service pour créer une véritable relation de confiance. Nous faisons donc le maximum pour vous assigner la même femme de ménage à chaque passage. Toutefois, en cas d'indisponibilité de votre intervenante habituelle, nous vous garantissons la continuité de votre prestation en organisant immédiatement son remplacement par une autre professionnelle qualifiée de notre agence."
                        },
                        {
                            question: "Quel est le statut de votre personnel et comment est-il formé ?",
                            answer: "Le professionnalisme et la conformité légale sont au cœur de nos engagements. Toutes nos intervenantes exercent sous le statut légal d'auto-entrepreneuse et sont obligatoirement déclarées à la CNSS (avec couverture AMO). Avant d'intervenir à votre domicile, chaque recrue suit une formation technique rigoureuse au sein de nos locaux à Casablanca afin de maîtriser nos standards de nettoyage Premium."
                        },
                        {
                            question: "Êtes-vous assurés en cas d'accident pendant la prestation ?",
                            answer: "Oui, votre tranquillité d'esprit est primordiale. Agence Ménage dispose d'une assurance professionnelle qui couvre l'ensemble de nos équipes en cas d'accidents du travail ou d'accidents domestiques survenant chez vous. Veuillez noter que cette couverture ne s'applique pas à la casse d'objets. C'est pourquoi nos équipes sont spécifiquement formées à manipuler vos biens avec la plus grande délicatesse."
                        },
                        {
                            question: "Suis-je engagé(e) sur la durée avec un contrat strict ?",
                            answer: "Absolument pas. Vous bénéficiez d'une flexibilité totale, sans aucun engagement de durée. Notre règle est simple : vous ne payez que les prestations que vous consommez. Si vous partez en vacances ou souhaitez annuler un passage, il vous suffit d'avertir notre agence au minimum 48 heures à l'avance."
                        }
                    ]}
                />

                <main className="flex-1 bg-background py-12">
                    <div className="container max-w-5xl">
                        <div className="bg-[#e9f2f2] rounded-lg p-6 text-center mb-8 border border-[#d1e0e0]">
                            <h2 className="text-2xl font-bold text-[#1c6664] mb-2 uppercase tracking-wide">
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
                                                <span className="font-medium text-right text-slate-700">Ménage Standard</span>
                                            </div>

                                            <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Fréquence:</span>
                                                    <span className="font-medium text-right">{getFrequencyLabel(formData.frequency, formData.subFrequency)}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Durée choisie:</span>
                                                    <span className="font-medium text-right">{formData.duration} heures</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Temps recommandé:</span>
                                                    <span className="font-medium text-right font-bold text-primary">{formData.recommendedDuration} heures</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Personnes:</span>
                                                    <span className="font-medium text-right">{formData.numberOfPeople}</span>
                                                </div>
                                                {formData.additionalServices.produitsEtOutils && (
                                                    <div className="flex justify-between gap-4 text-xs">
                                                        <span className="text-muted-foreground">Produits:</span>
                                                        <span className="font-medium text-right">+90 MAD</span>
                                                    </div>
                                                )}
                                                {formData.additionalServices.torchonsEtSerpierres && (
                                                    <div className="flex justify-between gap-4 text-xs">
                                                        <span className="text-muted-foreground">Torchons:</span>
                                                        <span className="font-bold text-right text-slate-700">+40 MAD</span>
                                                    </div>
                                                )}
                                                {discountRate > 0 && (
                                                    <div className="flex justify-between gap-4 text-red-600 font-bold bg-red-50 p-2 rounded">
                                                        <span>Réduction (10%):</span>
                                                        <span>-{Math.round(discountAmount)} MAD</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between gap-4 border-t border-primary/10 pt-2">
                                                    <span className="text-muted-foreground">Date:</span>
                                                    <span className="font-medium text-right">{formData.schedulingDate || "Non définie"}</span>
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
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold">Total</span>
                                                <span className="text-2xl font-bold text-primary">{totalPrice} MAD</span>
                                            </div>
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

                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-card rounded-lg p-4 md:p-6 border shadow-sm space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold bg-[#1c6664] text-white p-3 rounded-lg mb-4 text-center">
                                            Type d'habitation
                                        </h3>
                                        <RadioGroup
                                            value={formData.propertyType}
                                            onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                                            className="flex flex-wrap gap-8 p-4"
                                        >
                                            {["Studio", "Appartement", "Duplex", "Villa", "Maison"].map((type) => (
                                                <div key={type} className="flex items-center space-x-3">
                                                    <RadioGroupItem value={type.toLowerCase()} id={type} className="border-[#1c6664] text-[#1c6664]" />
                                                    <Label htmlFor={type} className="font-medium text-slate-700">{type}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-[#1c6664] text-white p-3 rounded-lg mb-4 text-center">
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
                                                    <div className="w-full space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <div className="flex justify-center">
                                                            <span className="text-red-600 font-bold px-3 py-1 bg-red-50 rounded-full text-xs animate-pulse">
                                                                -10 % de réduction sur l'abonnement
                                                            </span>
                                                        </div>
                                                        <Select
                                                            value={formData.subFrequency}
                                                            onValueChange={(value) => setFormData({ ...formData, subFrequency: value })}
                                                        >
                                                            <SelectTrigger className="w-full">
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

                                    <div id="rooms-section">
                                        <h3 className="text-xl font-bold bg-[#1c6664] text-white p-3 rounded-lg text-center mb-2">
                                            Merci de nous décrire votre domicile ainsi que les différentes pièces qui le composent
                                        </h3>
                                        <p className="text-red-500 text-xs text-right mb-4 font-bold">
                                            cliquez sur + ou - pour décrire les pièces de votre logement
                                        </p>
                                        <div className="space-y-4 p-4 border rounded-xl bg-white">
                                            {[
                                                { key: "cuisine", label: "Cuisine", time: "45 min" },
                                                { key: "suiteAvecBain", label: "Suite parentale avec salle de bain", time: "75 min" },
                                                { key: "suiteSansBain", label: "Suite parentale sans salle de bain", time: "45 min" },
                                                { key: "salleDeBain", label: "Salle de bain", time: "30 min" },
                                                { key: "chambre", label: "Chambre/pièce/bureau /chambre enfant", time: "40 min" },
                                                { key: "salonMarocain", label: "Salon Marocain", time: "35 min" },
                                                { key: "salonEuropeen", label: "Salon européen", time: "35 min" },
                                                { key: "toilettesLavabo", label: "Toilette Lavabo", time: "25 min" },
                                                { key: "rooftop", label: "Rooftop", time: "30 min", type: "checkbox" },
                                                { key: "escalier", label: "Escalier", time: "25 min", type: "checkbox" }
                                            ].map((room) => (
                                                <div key={room.key} className="flex items-center justify-between border-b border-dashed pb-3 last:border-0 last:pb-0">
                                                    <div className="flex-1">
                                                        <div className="font-bold text-slate-800">{room.label}</div>
                                                        <div className="text-xs text-slate-400 italic">{room.time}</div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {room.type === "checkbox" ? (
                                                            <Checkbox
                                                                checked={formData.rooms[room.key] > 0}
                                                                onCheckedChange={(checked) => {
                                                                    updateRoomCount(room.key, !!checked);
                                                                }}
                                                                className="h-6 w-6 rounded border-slate-300 data-[state=checked]:bg-[#1c6664] data-[state=checked]:border-[#1c6664]"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center gap-3 bg-[#f0f7f7] rounded-full p-1">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6 rounded-full bg-slate-200 text-[#1c6664] hover:bg-slate-300"
                                                                    onClick={() => updateRoomCount(room.key, false)}
                                                                >
                                                                    -
                                                                </Button>
                                                                <span className="w-4 text-center font-bold text-[#1c6664] text-sm">
                                                                    {formData.rooms[room.key]}
                                                                </span>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6 rounded-full bg-slate-200 text-[#1c6664] hover:bg-slate-300"
                                                                    onClick={() => updateRoomCount(room.key, true)}
                                                                >
                                                                    +
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center space-y-2 mb-8 shadow-inner">
                                            <p className="text-red-500 text-xs text-center font-bold italic">
                                                D'après les options choisies, nous recommandons {formData.recommendedDuration} heures pour un ménage optimal.
                                            </p>
                                            <div className="bg-[#94a3a3] text-white text-3xl font-bold px-10 py-3 rounded-full shadow-lg">
                                                {formData.recommendedDuration}H : 00
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold bg-[#1c6664] text-white p-3 rounded-lg text-center mb-2">
                                            Précisez le temps qui vous convient le mieux.
                                        </h3>
                                        <p className="text-red-500 text-[10px] text-center mb-4">
                                            La durée minimale pour votre ménage est de 4 h
                                        </p>
                                        <div className="flex items-center justify-center gap-8 p-4">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-full bg-[#f0f7f7] text-[#1c6664] hover:bg-[#e0eded] shadow-sm border border-slate-100"
                                                onClick={decrementDuration}
                                                disabled={formData.duration <= 4}
                                            >
                                                <span className="text-2xl">-</span>
                                            </Button>
                                            <span className="text-2xl font-bold text-[#1c6664] min-w-[40px] text-center">
                                                {formData.duration}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-full bg-[#f0f7f7] text-[#1c6664] hover:bg-[#e0eded] shadow-sm border border-slate-100"
                                                onClick={incrementDuration}
                                            >
                                                <span className="text-2xl">+</span>
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-[#1c6664] text-white p-3 rounded-lg mb-4 text-center">
                                            Nombre de personne
                                        </h3>
                                        <div className="flex items-center justify-center gap-8 p-4">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-full bg-[#f0f7f7] text-[#1c6664] hover:bg-[#e0eded] shadow-sm border border-slate-100"
                                                onClick={decrementPeople}
                                            >
                                                <span className="text-2xl">-</span>
                                            </Button>
                                            <span className="text-2xl font-bold text-[#1c6664] min-w-[40px] text-center">
                                                {formData.numberOfPeople}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-full bg-[#f0f7f7] text-[#1c6664] hover:bg-[#e0eded] shadow-sm border border-slate-100"
                                                onClick={incrementPeople}
                                            >
                                                <span className="text-2xl">+</span>
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-[#1c6664] text-white p-3 rounded-lg mb-4 text-center">
                                            Planning pour votre demande
                                        </h3>
                                        <div className="grid md:grid-cols-3 gap-6 p-4 border rounded-xl bg-white shadow-sm">
                                            <div className="text-center space-y-3">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="fixed"
                                                        name="schedulingType"
                                                        checked={formData.schedulingType === "fixed"}
                                                        onChange={() => setFormData({ ...formData, schedulingType: "fixed" })}
                                                        className="w-4 h-4 text-[#1c6664]"
                                                    />
                                                    <Label htmlFor="fixed" className="font-bold text-[#1c6664] text-sm cursor-pointer text-center">Je souhaite une heure fixe</Label>
                                                </div>
                                                <div className="flex justify-center">
                                                    <Input
                                                        type="time"
                                                        required
                                                        value={formData.fixedTime}
                                                        onChange={(e) => setFormData({ ...formData, fixedTime: e.target.value })}
                                                        disabled={formData.schedulingType !== "fixed"}
                                                        className="w-32 text-center text-xl font-bold h-12 border-[#1c6664]/30"
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
                                                        className="w-4 h-4 text-[#1c6664]"
                                                    />
                                                    <Label htmlFor="flexible" className="font-bold text-[#1c6664] text-sm cursor-pointer text-center">Je suis flexible</Label>
                                                </div>
                                                <RadioGroup
                                                    value={formData.schedulingTime}
                                                    onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })}
                                                    disabled={formData.schedulingType !== "flexible"}
                                                    className="space-y-2 text-left inline-block"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="morning" id="morning" className="border-[#1c6664] text-[#1c6664]" />
                                                        <Label htmlFor="morning" className="text-sm font-medium">Le matin</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="afternoon" id="afternoon" className="border-[#1c6664] text-[#1c6664]" />
                                                        <Label htmlFor="afternoon" className="text-sm font-medium">L'après midi</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            <div className="text-center space-y-3">
                                                <div className="font-bold text-[#1c6664] text-sm">Date</div>
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
                                        <h3 className="text-xl font-bold bg-[#1c6664] text-white p-3 rounded-lg mb-4 text-center">
                                            Services optionnels
                                        </h3>
                                        <div className="p-6 border rounded-xl bg-slate-50/50 space-y-4">
                                            <div className="text-center font-bold text-[#1c6664] mb-4">
                                                Produit fournis par l'agence ménage :
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
                                                {[
                                                    ...PRODUCTS_LIST
                                                ].map((item) => (
                                                    <div key={item} className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1c6664]" />
                                                        <span className="text-sm font-medium text-slate-700">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={cleaningProduct.src}
                                                        alt="Produits"
                                                        className="w-12 h-12 object-contain"
                                                    />
                                                    <span className="font-bold text-[#1c6664]">Produit : + 90 MAD</span>
                                                </div>
                                                <Switch
                                                    checked={formData.additionalServices.produitsEtOutils}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            additionalServices: { ...formData.additionalServices, produitsEtOutils: checked }
                                                        })
                                                    }
                                                    className="data-[state=checked]:bg-[#1c6664]"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
                                                        🧹
                                                    </div>
                                                    <span className="font-bold text-[#1c6664]">Torchons et serpillères : + 40 MAD</span>
                                                </div>
                                                <Switch
                                                    checked={formData.additionalServices.torchonsEtSerpierres}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            additionalServices: { ...formData.additionalServices, torchonsEtSerpierres: checked }
                                                        })
                                                    }
                                                    className="data-[state=checked]:bg-[#1c6664]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-[#1c6664] text-white p-3 rounded-lg mb-4 text-center">
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
                                            <Label className="font-bold text-[#1c6664]">Champs de repère</Label>
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
                                        <h3 className="text-xl font-bold bg-[#1c6664] text-white p-3 text-center">
                                            Mes informations
                                        </h3>
                                        <div className="p-6 grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-[#1c6664] text-sm">Numéro de téléphone*</Label>
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
                                                            className="data-[state=checked]:bg-[#1c6664] border-[#1c6664]"
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
                                                <Label className="font-bold text-[#1c6664] text-sm">Numéro whatsapp</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={formData.whatsappPrefix}
                                                        onChange={(e) => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                                                        className="w-20 border-slate-300 font-bold text-[#1c6664] text-center"
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
                                                <Label className="font-bold text-[#1c6664] text-sm">Nom*</Label>
                                                <Input
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    required
                                                    className="mt-1 border-slate-300 h-11"
                                                    placeholder="Votre nom"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-[#1c6664] text-sm">Prénom*</Label>
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

            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md bg-[#fdf8f1] border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed">
                            {getConfirmationMessage(`${formData.firstName} ${formData.lastName}`, false)}
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
}
