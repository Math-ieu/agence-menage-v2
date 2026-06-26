"use client";

import { useState, useEffect, useRef } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import serviceBureaux from "@/assets/service-menage-bureaux.webp";
import { getConfirmationMessage } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
import { calculateSurchargeMultiplier } from "@/lib/pricing";
import PromoCodeInput from "@/components/PromoCodeInput";
import "@/styles/sticky-summary.css";
import { FREQUENCES } from "@/app/frequences";
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
    officeSurface: "0-70",
    frequency: "oneshot",
    subFrequency: "",
    duration: 2,
    numberOfPeople: 1,
    city: DEFAULT_CITY,
    neighborhood: "",
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
    entityName: "",
    contactPerson: "",
    email: "",
    changeRepereNotes: ""
};

export default function MenageBureauxClient() {
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [promoCode, setPromoCode] = useState<any>(null);
    const router = useRouter();

    // Champs texte non-contrôlés (lus au submit) pour éviter de re-rendre tout
    // le formulaire à chaque frappe (optimisation INP).
    const entityNameRef = useRef<HTMLInputElement>(null);
    const contactPersonRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phonePrefixRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const whatsappPrefixRef = useRef<HTMLInputElement>(null);
    const whatsappNumberRef = useRef<HTMLInputElement>(null);
    const neighborhoodRef = useRef<HTMLInputElement>(null);
    const changeRepereNotesRef = useRef<HTMLTextAreaElement>(null);

    const getMinDuration = (frequency: string) => {
        return frequency === "oneshot" ? 4 : 2;
    };

    const calculateResources = (range: string) => {
        switch (range) {
            case "0-70": return { duration: 2, people: 1 };
            case "71-150": return { duration: 4, people: 1 };
            case "151-300": return { duration: 8, people: 1 };
            case "300+": return { duration: 8, people: 2 };
            default: return { duration: 2, people: 1 };
        }
    };

    const handleSurfaceChange = (range: string) => {
        const { duration, people } = calculateResources(range);
        const minDur = getMinDuration(formData.frequency);
        setFormData({
            ...formData,
            officeSurface: range,
            duration: Math.max(duration, minDur),
            numberOfPeople: people
        });
    };

    const handleIncrementDuration = () => {
        setFormData(prev => ({ ...prev, duration: prev.duration + 1 }));
    };

    const handleDecrementDuration = () => {
        const minDur = getMinDuration(formData.frequency);
        if (formData.duration > minDur) {
            setFormData(prev => ({ ...prev, duration: prev.duration - 1 }));
        }
    };

    const handleIncrementPeople = () => {
        setFormData(prev => ({ ...prev, numberOfPeople: prev.numberOfPeople + 1 }));
    };

    const handleDecrementPeople = () => {
        const minResources = calculateResources(formData.officeSurface);
        if (formData.numberOfPeople > minResources.people) {
            setFormData(prev => ({ ...prev, numberOfPeople: prev.numberOfPeople - 1 }));
        }
    };

    useEffect(() => {
        const minDur = getMinDuration(formData.frequency);
        if (formData.duration < minDur) {
            setFormData(prev => ({ ...prev, duration: minDur }));
        }
    }, [formData.frequency]);

    const multiplier = calculateSurchargeMultiplier(
        formData.schedulingDate,
        formData.schedulingType,
        formData.fixedTime,
        formData.schedulingTime
    );

    const hourlyRate = formData.additionalServices.produitsEtOutils ? 70 : 60;
    const perVisitBasePrice = formData.duration * formData.numberOfPeople * hourlyRate * multiplier;
    const perVisitTotal = perVisitBasePrice;

    let totalPrice = 0;
    let discountAmount = 0;
    const discountRate = 0.1;

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
        const visitsPerWeek = visitsMap[formData.subFrequency] || 1;
        const subtotalMonthly = perVisitTotal * visitsPerWeek * 4;
        discountAmount = subtotalMonthly * discountRate;
        totalPrice = subtotalMonthly - discountAmount;
    } else {
        totalPrice = perVisitTotal;
    }

    if (promoCode) {
        if (promoCode.reduction_type === 'pourcentage') {
            totalPrice = totalPrice * (1 - promoCode.reduction / 100);
        } else if (promoCode.reduction_type === 'montant_fixe') {
            totalPrice = Math.max(0, totalPrice - promoCode.reduction);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasValidated(true);

        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        const entityName = entityNameRef.current?.value.trim() ?? "";
        const contactPerson = contactPersonRef.current?.value.trim() ?? "";
        const email = emailRef.current?.value.trim() ?? "";
        const phonePrefix = phonePrefixRef.current?.value.trim() || "+212";
        const phoneNumber = phoneNumberRef.current?.value.trim() ?? "";
        const whatsappPrefix = whatsappPrefixRef.current?.value.trim() || "+212";
        const whatsappNumber = whatsappNumberRef.current?.value.trim() ?? "";
        const neighborhood = neighborhoodRef.current?.value.trim() ?? "";
        const changeRepereNotes = changeRepereNotesRef.current?.value.trim() ?? "";

        if (!entityName || !contactPerson || !phoneNumber || !formData.city || !neighborhood || !formData.schedulingDate) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        const bookingData = {
            ...formData,
            entityName,
            contactPerson,
            email,
            neighborhood,
            changeRepereNotes,
            phonePrefix,
            whatsappPrefix,
            phoneNumber: `${phonePrefix} ${phoneNumber}`,
            whatsappNumber: formData.useWhatsappForPhone
                ? `${phonePrefix} ${phoneNumber}`
                : `${whatsappPrefix} ${whatsappNumber}`,
            promoCodeId: promoCode ? promoCode.id : undefined,
            promoCodeInput: promoCode ? promoCode.code : undefined
        };

        setCustomerName(contactPerson);

        setIsSubmitting(true);
        try {
            const result = await sendBookingEmail("Ménage Bureaux", bookingData, totalPrice, true);

            if (result.success) {
                setShowConfirmation(true);
            } else {
                if (result.emailSent) {
                    setShowConfirmation(true);
                } else {
                    setShowConfirmation(true);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue lors de l'envoi de votre demande.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseConfirmation = (open: boolean) => {
        setShowConfirmation(open);
        if (!open) {
            setFormData(INITIAL_FORM_DATA);
            setWasValidated(false);
            router.push(window.location.pathname + "/merci");
        }
    };

    const frequencies = FREQUENCES;

    const getFrequencyLabel = (value: string, subValue: string) => {
        if (value === "oneshot") return "Une fois";
        const freq = frequencies.find(f => f.value === subValue);
        return freq ? `Abonnement - ${freq.label}` : "Abonnement";
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="bg-[hsl(var(--primary)/0.05)]" style={{ "--primary": SERVICE_COLORS.BUREAUX.hsl } as React.CSSProperties}>
                <ServiceHeroSection
                    title="Ménage Bureaux"
                    description="Nettoyage des espaces de travail afin de garantir un environnement propre, sain et agréable pour les employés et les visiteurs. La prestation comprend : Le dépoussiérage des bureaux, plans de travail et surfaces accessibles, Le nettoyage des sols (balayage, serpière…), Le vidage des poubelles, Le nettoyage des vitres accessibles, L’entretien des espaces communs (salles de réunion, couloirs, cuisine, escaliers), nettoyage des bureaux, chaises, sols, toilettes… ainsi que les balcons, escaliers lorsqu’ils sont accessibles."
                    image={serviceBureaux.src}
                    primaryColor={SERVICE_COLORS.BUREAUX.hex}
                    faqs={[
                        {
                            question: "Vos agents peuvent-ils intervenir en dehors de nos heures d'ouverture ?",
                            answer: "Oui, absolument. L'entretien de vos locaux ne doit jamais perturber la productivité de vos collaborateurs. C'est pourquoi nos équipes de nettoyage de bureaux à Casablanca et Rabat sont opérationnelles 24h/24 et 7j/7. Nous pouvons intervenir très tôt le matin avant l'arrivée de vos équipes, tard le soir après la fermeture, ou même durant le week-end, selon votre cahier des charges."
                        },
                        {
                            question: "Fournissez-vous les consommables sanitaires (papier toilette, savon) ?",
                            answer: "La gestion des stocks sanitaires peut vite devenir une contrainte chronophage pour votre entreprise. Nous proposons donc la fourniture et le réapprovisionnement régulier de vos consommables (papier hygiénique, essuie-mains, savon, désodorisant) sous forme d'option supplémentaire à la demande. Vous déléguez complètement cette gestion et maîtrisez votre budget."
                        },
                        {
                            question: "Comment garantissez-vous la sécurité de nos locaux et la confidentialité ?",
                            answer: "La sécurité de votre entreprise est notre priorité absolue. Tout notre personnel Premium est rigoureusement sélectionné, déclaré, et sensibilisé au respect strict de la confidentialité de vos documents et de vos espaces de travail. De plus, nous établissons avec vous un protocole hautement sécurisé pour la gestion de vos clés, de vos badges d'accès et l'activation de vos alarmes."
                        },
                        {
                            question: "Sommes-nous engagés sur un contrat de longue durée rigide ?",
                            answer: "Non, nous croyons que la fidélité de nos clients B2B doit se gagner par l'excellence de notre travail quotidien, et non par un contrat verrouillé. Notre offre d'entretien est 100% flexible et sans engagement de durée. Nos abonnements fonctionnent au mois le mois : vous êtes totalement libre d'ajuster la fréquence de nos passages ou de suspendre notre collaboration à tout moment."
                        }
                    ]}
                />

                <main className="flex-1 bg-transparent py-12">
                    <div className="container max-w-5xl">
                        <div className="bg-primary/5 rounded-lg p-6 text-center mb-8 border border-primary/20">
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
                                                <span className="font-medium text-right">Ménage Bureaux</span>
                                            </div>

                                            {/* Detailed info - hidden on mobile when collapsed */}
                                            <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Fréquence:</span>
                                                    <span className="font-medium text-right text-sm">
                                                        {getFrequencyLabel(formData.frequency, formData.subFrequency)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Superficie:</span>
                                                    <span className="font-medium text-right">
                                                        {formData.officeSurface === "300+" ? "300m² et plus" : `${formData.officeSurface} m²`}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Personnes:</span>
                                                    <span className="font-medium text-right">{formData.numberOfPeople}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Durée:</span>
                                                    <span className="font-medium text-right">{formData.duration}h</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Formule:</span>
                                                    <span className="font-medium text-right text-sm">
                                                        {formData.additionalServices.produitsEtOutils ? "Avec produit" : "Sans produit"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Tarif horaire:</span>
                                                    <span className="font-medium text-right text-sm">
                                                        {formData.additionalServices.produitsEtOutils ? "70 DH/h" : "60 DH/h"}
                                                    </span>
                                                </div>
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
                                            {formData.frequency === "subscription" && discountAmount > 0 && (
                                                <div className="flex justify-between gap-4 text-red-600 font-bold bg-red-50 p-2 rounded mb-4 text-xs">
                                                    <span>Réduction (10%):</span>
                                                    <span>-{Math.round(discountAmount)} MAD</span>
                                                </div>
                                            )}
                                            {promoCode && (
                                                <div className="flex justify-between text-emerald-600 font-medium mb-2 text-sm">
                                                    <span>Réduction ({promoCode.code}) :</span>
                                                    <span>-{promoCode.reduction_type === 'pourcentage' ? `${promoCode.reduction}%` : `${promoCode.reduction} MAD`}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold">
                                                    {formData.frequency === "subscription" ? "Total Mensuel HT" : "Total HT"}
                                                </span>
                                                <span className="text-2xl font-bold text-primary">
                                                    {totalPrice > 0 ? `${Math.round(totalPrice)} MAD` : "0 MAD"}
                                                </span>
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
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                            Superficie de votre bien en M²
                                        </h3>
                                        <div className="p-6 bg-muted/30 rounded-xl border border-muted">
                                            <p className="text-center text-red-500 text-xs font-bold mb-4 italic">
                                                Indiquez le nombre total de m² de l'espace à prendre en compte (ex. 70 m²).
                                            </p>
                                            <div className="grid grid-cols-2 gap-6">
                                                {[
                                                    { range: "0-70", label: "0m² - 70 m²" },
                                                    { range: "71-150", label: "71m² - 150 m²" },
                                                    { range: "151-300", label: "151m² - 300 m²" },
                                                    { range: "300+", label: "300m² et plus" }
                                                ].map((item) => (
                                                    <div
                                                        key={item.range}
                                                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer group ${formData.officeSurface === item.range ? 'border-primary bg-white shadow-md' : 'border-transparent bg-white/50 hover:bg-white'}`}
                                                        onClick={() => handleSurfaceChange(item.range)}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border-2 mb-2 flex items-center justify-center ${formData.officeSurface === item.range ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                            {formData.officeSurface === item.range && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        </div>
                                                        <span className={`font-bold text-sm ${formData.officeSurface === item.range ? 'text-primary' : 'text-muted-foreground'}`}>
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                            Service
                                        </h3>
                                        <div className="p-6 bg-muted/30 rounded-xl border border-muted">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {[
                                                    {
                                                        value: false,
                                                        title: "Ménage sans produit",
                                                        desc: "Vous fournissez vous-même les produits de nettoyage. Notre équipe se déplace uniquement pour réaliser la prestation."
                                                    },
                                                    {
                                                        value: true,
                                                        title: "Ménage avec produit",
                                                        desc: "Notre équipe apporte les produits de ménage, torchons et serpillères nécessaires à la prestation."
                                                    }
                                                ].map((item) => (
                                                    <div
                                                        key={item.title}
                                                        className={`flex flex-col items-start p-6 rounded-xl border-2 transition-all cursor-pointer group bg-white ${formData.additionalServices.produitsEtOutils === item.value ? 'border-primary shadow-md' : 'border-transparent hover:shadow-sm'}`}
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            additionalServices: {
                                                                ...formData.additionalServices,
                                                                produitsEtOutils: item.value
                                                            }
                                                        })}
                                                    >
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.additionalServices.produitsEtOutils === item.value ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                                {formData.additionalServices.produitsEtOutils === item.value && <div className="w-2 h-2 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={`font-bold text-base ${formData.additionalServices.produitsEtOutils === item.value ? 'text-primary' : 'text-slate-800'}`}>
                                                                {item.title}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4">
                                            Choisissez la fréquence
                                        </h3>
                                        <div className="p-4 bg-muted/30 rounded space-y-4">
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
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                            Durée estimée
                                        </h3>
                                        <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-xl border border-muted gap-4">
                                            <div className="flex items-center gap-6">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-12 w-12 rounded-full bg-white border border-slate-200 text-primary hover:bg-slate-50 shadow-sm"
                                                    onClick={handleDecrementDuration}
                                                    disabled={formData.duration <= getMinDuration(formData.frequency)}
                                                >
                                                    <span className="text-2xl font-bold pb-1">-</span>
                                                </Button>
                                                <div className="bg-white px-8 py-4 rounded-full border border-muted shadow-sm flex flex-col items-center min-w-[140px]">
                                                    <span className="text-3xl font-black text-primary">{formData.duration}</span>
                                                    <span className="text-sm font-bold text-muted-foreground uppercase">Heures</span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-12 w-12 rounded-full bg-white border border-slate-200 text-primary hover:bg-slate-50 shadow-sm"
                                                    onClick={handleIncrementDuration}
                                                >
                                                    <span className="text-2xl font-bold pb-1">+</span>
                                                </Button>
                                            </div>
                                            {formData.frequency === "oneshot" && (
                                                <p className="text-xs text-slate-500 italic text-center font-medium">
                                                    Pour une prestation ponctuelle, la durée minimale est de 4 heures.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                            Nombre de personne
                                        </h3>
                                        <div className="flex items-center justify-center p-6 bg-muted/30 rounded-xl border border-muted">
                                            <div className="flex items-center gap-6">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-12 w-12 rounded-full bg-white border border-slate-200 text-primary hover:bg-slate-50 shadow-sm"
                                                    onClick={handleDecrementPeople}
                                                    disabled={formData.numberOfPeople <= calculateResources(formData.officeSurface).people}
                                                >
                                                    <span className="text-2xl font-bold pb-1">-</span>
                                                </Button>
                                                <div className="bg-white px-8 py-4 rounded-full border border-muted shadow-sm flex flex-col items-center min-w-[140px]">
                                                    <span className="text-3xl font-black text-primary">{formData.numberOfPeople}</span>
                                                    <span className="text-sm font-bold text-muted-foreground uppercase">Personne(s)</span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-12 w-12 rounded-full bg-white border border-slate-200 text-primary hover:bg-slate-50 shadow-sm"
                                                    onClick={handleIncrementPeople}
                                                >
                                                    <span className="text-2xl font-bold pb-1">+</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-4 uppercase">
                                            Où aura lieu votre ménage ?
                                        </h3>
                                        <div className="p-6 bg-muted/30 rounded-xl border border-muted space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-slate-400">Ville</Label>
                                                <Select
                                                    value={formData.city}
                                                    onValueChange={(value) => {
                                                        setFormData({ ...formData, city: value });
                                                        if (neighborhoodRef.current) neighborhoodRef.current.value = "";
                                                    }}
                                                >
                                                    <SelectTrigger className="border-slate-300">
                                                        <SelectValue placeholder="Sélectionner une ville" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {CITIES.map((c) => (
                                                            <SelectItem key={c} value={c}>
                                                                {c}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-muted-foreground uppercase">Quartier</Label>
                                                    <Input
                                                        placeholder="Votre quartier"
                                                        ref={neighborhoodRef}
                                                        className="bg-white h-10 border-slate-300"
                                                    />
                                                </div>
                                            </div>
                                        <div className="flex items-start gap-3 p-3 mt-4 mb-4 bg-orange-50 border border-orange-100 rounded-xl shadow-sm">
                                            <div className="mt-0.5 text-orange-500 flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="12" y1="8" x2="12" y2="12" />
                                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                                </svg>
                                            </div>
                                            <p className="text-xs font-medium text-orange-800 leading-relaxed">
                                                Si vous êtes dans les zones <span className="font-bold">Bouskoura, Dar Bouazza, Mansouria, Almaz, Sidi Rahal, Benslimane, Mohammédia, Ville Verte...</span> un supplément de <span className="font-bold whitespace-nowrap px-1 bg-orange-200/50 rounded-md text-orange-700">50 MAD</span> vous sera facturé pour faciliter le déplacement.
                                            </p>
                                        </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Champs de repère</Label>
                                                <Textarea
                                                    placeholder="Donnez-nous des repères visuels proches (Mosquée, École, Pharmacie...)"
                                                    required
                                                    ref={changeRepereNotesRef}
                                                    className="bg-white min-h-[80px] text-sm resize-none"
                                                />
                                            </div>
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
                                                        id="bureau-fixed"
                                                        name="schedulingType"
                                                        checked={formData.schedulingType === "fixed"}
                                                        onChange={() => setFormData({ ...formData, schedulingType: "fixed" })}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <Label htmlFor="bureau-fixed" className="font-bold text-primary text-sm cursor-pointer text-center">Je souhaite une heure fixe</Label>
                                                </div>
                                                <div className="flex justify-center">
                                                    <input
                                                        type="time"
                                                        required
                                                        value={formData.fixedTime}
                                                        onChange={(e) => setFormData({ ...formData, fixedTime: e.target.value })}
                                                        disabled={formData.schedulingType !== "fixed"}
                                                        className="w-32 text-center text-xl font-bold h-12 border-primary border h-10 rounded-md"
                                                    />
                                                </div>
                                            </div>

                                            {/* Flexible */}
                                            <div className="text-center space-y-3">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="bureau-flexible"
                                                        name="schedulingType"
                                                        checked={formData.schedulingType === "flexible"}
                                                        onChange={() => setFormData({ ...formData, schedulingType: "flexible" })}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <Label htmlFor="bureau-flexible" className="font-bold text-primary text-sm cursor-pointer text-center">Je suis flexible</Label>
                                                </div>
                                                <RadioGroup
                                                    value={formData.schedulingTime}
                                                    onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })}
                                                    disabled={formData.schedulingType !== "flexible"}
                                                    className="space-y-2 text-left inline-block"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="morning" id="bureau-morning" />
                                                        <Label htmlFor="bureau-morning">Le matin</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="afternoon" id="bureau-afternoon" />
                                                        <Label htmlFor="bureau-afternoon">L'après midi</Label>
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



                                    <div className="bg-muted/30 rounded-xl p-6 border border-muted">
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-6 uppercase">
                                            Les informations
                                        </h3>
                                        <p className="text-xs font-bold text-center text-slate-500 mb-6 uppercase tracking-wider">
                                            Un chargé de clientèle prendra contact avec vous dans les plus brefs délais.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Nom de l'entreprise*</Label>
                                                <Input
                                                    placeholder="Nom de votre société"
                                                    ref={entityNameRef}
                                                    required
                                                    className="bg-white h-12"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Personne à contacter*</Label>
                                                <Input
                                                    placeholder="Votre nom complet"
                                                    ref={contactPersonRef}
                                                    required
                                                    className="bg-white h-12"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Numéro de téléphone*</Label>
                                                <div className="space-y-3">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            ref={phonePrefixRef}
                                                            defaultValue="+212"
                                                            className="w-24 border-slate-300 font-bold text-primary text-center"
                                                            placeholder="+212"
                                                        />
                                                        <Input
                                                            placeholder="6 12 00 00 00"
                                                            ref={phoneNumberRef}
                                                            required
                                                            className="bg-white h-12 flex-1"
                                                        />
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="useWhatsapp"
                                                            checked={formData.useWhatsappForPhone}
                                                            onCheckedChange={(checked) => {
                                                                setFormData(prev => ({ ...prev, useWhatsappForPhone: !!checked }));
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
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Numéro whatsapp*</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        ref={whatsappPrefixRef}
                                                        defaultValue="+212"
                                                        className="bg-slate-100 border rounded-lg w-20 text-center font-bold text-primary"
                                                        placeholder="+212"
                                                        disabled={formData.useWhatsappForPhone}
                                                    />
                                                    <Input
                                                        placeholder="6 12 00 00 00"
                                                        ref={whatsappNumberRef}
                                                        className="bg-white h-12"
                                                        disabled={formData.useWhatsappForPhone}
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Email*</Label>
                                                <Input
                                                    type="email"
                                                    placeholder="votre@email.com"
                                                    ref={emailRef}
                                                    required
                                                    className="bg-white h-12"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <PromoCodeInput
                                        segment="entreprise"
                                        service="ménage bureaux"
                                        onApplyPromo={setPromoCode}
                                        getPhoneNumber={() => `${phonePrefixRef.current?.value.trim() || '+212'} ${phoneNumberRef.current?.value.trim() || ''}`.trim()}
                                    />

                                    <div className="flex justify-center pt-8">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-bold shadow-lg shadow-primary/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Envoi en cours...
                                                </div>
                                            ) : (
                                                "Confirmer ma réservation"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </main>
                <OtherServices type="entreprise" currentServiceUrl="/services/entreprise/menage-bureaux" />
            </div>

            <Footer />

            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md bg-white border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed whitespace-pre-line">
                            {getConfirmationMessage(customerName, false)}
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
