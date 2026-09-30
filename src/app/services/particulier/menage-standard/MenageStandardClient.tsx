"use client";

import { useState, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import PromoCodeInput from "@/components/PromoCodeInput";
import serviceRegulier from "@/assets/service-menage-standard.webp";
import cleaningProduct from "@/assets/cleaning-product.webp";
import { createWhatsAppLink, formatBookingMessage, DESTINATION_PHONE_NUMBER, getConfirmationMessage } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
import { calculateSurchargeMultiplier, getSurchargeDetails, getSubscriptionDiscountRate } from "@/lib/pricing";
import "@/styles/sticky-summary.css";
import { FREQUENCES, visitsMap } from "@/app/frequences";
import { SubscriptionScheduler, JourPassage, ProrataInfo } from "@/components/booking/SubscriptionScheduler";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { CASABLANCA_NEIGHBORHOODS, DEFAULT_CITY, CITIES, SURCHARGE_CITIES, NEIGHBORHOODS_BY_CITY } from "@/constants/locations";

const PRODUCTS_LIST = [
    "Nettoyant multi-usage",
    "Produit vitre, dégraissant",
    "Produit de vaisselle",
    "Produit bois et parqués",
    "Neutralisant d’odeur"
];

// Contrôle d'activation/désactivation de la section descriptive des pièces (Cuisine, Chambres, etc.)
// Mettre à `true` pour réactiver l'affichage et la validation sur le site
const SHOW_ROOMS_SECTION = false;

const INITIAL_FORM_DATA = {
    propertyType: "studio",
    frequency: "oneshot",
    subFrequency: "2foisParSemaine",
    duration: 4,
    recommendedDuration: 4,
    numberOfPeople: 1,
    city: DEFAULT_CITY,
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
    joursPassage: [
        { jour: 'lundi', heure_debut: '09:00', heure_fin: '13:00' },
        { jour: 'jeudi', heure_debut: '09:00', heure_fin: '13:00' }
    ] as JourPassage[],
    additionalServices: {
        produitsEtOutils: false,
        torchonsEtSerpierres: false
    },
    useWhatsappForPhone: true
};

export default function MenageStandardClient() {
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [prorataInfo, setProrataInfo] = useState<ProrataInfo | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [promoCode, setPromoCode] = useState<any>(null);
    const router = useRouter();

    // Champs texte non-contrôlés (non affichés dans le récap) : lus au submit
    // via refs pour éviter de re-rendre tout le formulaire à chaque frappe (INP).
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const phonePrefixRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const whatsappPrefixRef = useRef<HTMLInputElement>(null);
    const whatsappNumberRef = useRef<HTMLInputElement>(null);
    const neighborhoodRef = useRef<HTMLInputElement>(null);
    const changeRepereNotesRef = useRef<HTMLTextAreaElement>(null);

    const baseRate = 60;

    // Pricing Logic
    let totalServicePrice = 0;
    let visitsPerWeek = 1;
    let discountRate = 0;
    let discountAmount = 0;

    const surchargeInfo = getSurchargeDetails(
        formData.schedulingDate,
        formData.schedulingType,
        formData.fixedTime,
        formData.schedulingTime
    );
    const multiplier = surchargeInfo.multiplier;

    let baseServicePrice = 0;
    let surchargeAmount = 0;

    if (formData.frequency === "subscription") {
        visitsPerWeek = visitsMap[formData.subFrequency] || 2;
        discountRate = getSubscriptionDiscountRate(formData.subFrequency, "menage-standard", formData.duration);
        const monthlyHours = formData.duration * visitsPerWeek * 4;
        const subtotalMonthly = monthlyHours * baseRate * formData.numberOfPeople;
        discountAmount = subtotalMonthly * discountRate;
        baseServicePrice = subtotalMonthly - discountAmount;
        surchargeAmount = baseServicePrice * (multiplier - 1);
        totalServicePrice = baseServicePrice * multiplier;
    } else {
        baseServicePrice = formData.duration * baseRate * formData.numberOfPeople;
        surchargeAmount = baseServicePrice * (multiplier - 1);
        totalServicePrice = baseServicePrice * multiplier;
    }

    const calculateTotal = () => {
        let price = (formData.frequency === "subscription" && prorataInfo?.prorataActive)
            ? prorataInfo.prorataAmount
            : totalServicePrice;

        if (formData.additionalServices.produitsEtOutils) price += 90;
        if (SURCHARGE_CITIES.includes(formData.city)) price += 50;
        if (formData.additionalServices.torchonsEtSerpierres) price += 40;

        if (promoCode) {
            if (promoCode.reduction_type === 'pourcentage') {
                price = price * (1 - promoCode.reduction / 100);
            } else if (promoCode.reduction_type === 'montant_fixe') {
                price = Math.max(0, price - promoCode.reduction);
            }
        }
        return Math.round(price);
    };

    const calculateRegularTotal = () => {
        let price = totalServicePrice;
        if (formData.additionalServices.produitsEtOutils) price += 90;
        if (SURCHARGE_CITIES.includes(formData.city)) price += 50;
        if (formData.additionalServices.torchonsEtSerpierres) price += 40;
        return Math.round(price);
    };

    const totalPrice = calculateTotal();
    const regularTotalPrice = calculateRegularTotal();

    const frequencies = FREQUENCES;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasValidated(true);

        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        if (SHOW_ROOMS_SECTION) {
            const roomsSelected = Object.values(formData.rooms).some(count => count > 0);
            if (!roomsSelected) {
                toast.error("Veuillez décrire les pièces de votre logement avant de continuer");
                const roomsSection = document.getElementById('rooms-section');
                if (roomsSection) {
                    roomsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
        }

        if (formData.frequency === "subscription" && (!formData.schedulingDate || formData.joursPassage.length === 0)) {
            toast.error("Veuillez renseigner vos jours de passage et votre date de démarrage.");
            return;
        }

        const firstName = firstNameRef.current?.value.trim() ?? "";
        const lastName = lastNameRef.current?.value.trim() ?? "";
        const phonePrefix = phonePrefixRef.current?.value.trim() || "+212";
        const phoneNumber = phoneNumberRef.current?.value.trim() ?? "";
        const whatsappPrefix = whatsappPrefixRef.current?.value.trim() || "+212";
        const whatsappNumber = whatsappNumberRef.current?.value.trim() ?? "";
        const neighborhood = neighborhoodRef.current?.value.trim() ?? "";
        const changeRepereNotes = changeRepereNotesRef.current?.value.trim() ?? "";

        if (!firstName || !lastName || !phoneNumber) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setIsSubmitting(true);
        try {
            const frequencyLabel = formData.frequency === "oneshot"
                ? "Une fois"
                : (frequencies.find(f => f.value === formData.subFrequency)?.label || "Abonnement");

            const isSub = formData.frequency === "subscription";

            const bookingData = {
                ...formData,
                firstName,
                lastName,
                neighborhood,
                changeRepereNotes,
                phonePrefix,
                whatsappPrefix,
                frequencyLabel,
                is_subscription: isSub,
                frequence: isSub ? (formData.subFrequency || '2foisParSemaine') : 'oneshot',
                jours_passage: isSub ? formData.joursPassage : [],
                date_debut: formData.schedulingDate || '',
                date_premiere_intervention: formData.schedulingDate || '',
                prorata_actif: isSub ? (prorataInfo?.prorataActive || false) : false,
                montant_prorata: isSub ? (prorataInfo?.prorataAmount || totalPrice) : null,
                tarif_mensuel_standard: isSub ? (prorataInfo?.regularAmount || regularTotalPrice) : null,
                nb_passages_mois_1: isSub ? (prorataInfo?.passagesRestants || 0) : 1,
                nb_passages_theoriques: isSub ? (prorataInfo?.passagesTheoriques || 0) : 1,
                phoneNumber: `${phonePrefix} ${phoneNumber}`,
                whatsappNumber: formData.useWhatsappForPhone
                    ? `${phonePrefix} ${phoneNumber}`
                    : `${whatsappPrefix} ${whatsappNumber}`,
                promoCodeId: promoCode ? promoCode.id : undefined,
                promoCodeInput: promoCode ? promoCode.code : undefined,
                surchargeLabel: surchargeInfo.label,
                surchargePercent: surchargeInfo.surchargePercent,
                surchargeAmount: Math.round(surchargeAmount),
                baseServicePrice: Math.round(baseServicePrice),
                discountRate: Math.round(discountRate * 100),
                discountAmount: Math.round(discountAmount)
            };

            setCustomerName(`${firstName} ${lastName}`);

            // Send email notification (await to ensure back-office recording)
            const result = await sendBookingEmail("Ménage Standard", bookingData, totalPrice, false);

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
            toast.error("Une erreur est survenue lors de la réservation.");
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

            <div className="bg-[hsl(var(--primary)/0.05)]" style={{ "--primary": SERVICE_COLORS.STANDARD.hsl } as React.CSSProperties}>
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
                    primaryColor={SERVICE_COLORS.STANDARD.hex}
                    faqs={[
                        {
                            question: "Fournissez-vous le matériel et les produits de nettoyage ?",
                            answer: "Pour des raisons d'hygiène strictes et pour respecter les spécificités de vos surfaces, nos intervenantes utilisent votre propre équipement de base (aspirateur, balai, seau). Toutefois, pour vous simplifier totalement le quotidien, nous proposons un Pack Entretien en option. Ce kit complet et prêt à l'emploi inclut 6 produits de nettoyage efficaces, des torchons adaptés et une serpillière neuve. Il vous suffit de cocher cette option lors de votre réservation pour que notre équipe s'occupe de tout lors de son passage chez vous à Casablanca ou Rabat."
                        },
                        {
                            question: "Dois-je obligatoirement être présent(e) à mon domicile pendant la prestation ?",
                            answer: "Non, votre présence n'est absolument pas requise. La majorité de nos clients à Casablanca et Rabat nous confient l'accès (clés laissées au concierge, boîte à clés ou ouverture en début de séance) pour que nous puissions intervenir en leur absence. Nos femmes de ménage sont rigoureusement sélectionnées pour leur fiabilité et formées à travailler en toute autonomie et discrétion. Vous pouvez donc partir l'esprit tranquille et retrouver votre intérieur impeccable à votre retour."
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
                                                <span className="font-medium text-right text-slate-700">Ménage Standard</span>
                                            </div>

                                            <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Fréquence:</span>
                                                    <span className="font-medium text-right">{getFrequencyLabel(formData.frequency, formData.subFrequency)}</span>
                                                </div>
                                                {formData.frequency === "subscription" && formData.joursPassage.length > 0 && (
                                                    <>
                                                        <div className="flex justify-between gap-4 text-xs">
                                                            <span className="text-muted-foreground">Jours de passage:</span>
                                                            <span className="font-bold text-right text-primary capitalize">
                                                                {formData.joursPassage.map(j => j.jour).join(', ')}
                                                            </span>
                                                        </div>
                                                        {prorataInfo && prorataInfo.passagesTheoriques > 0 && (
                                                            <div className="flex justify-between gap-4 text-xs">
                                                                <span className="text-muted-foreground">Interventions :</span>
                                                                <span className="font-bold text-right text-slate-700">
                                                                    {prorataInfo.passagesTheoriques} interventions / mois
                                                                </span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Durée choisie:</span>
                                                    <span className="font-medium text-right">{formData.duration} heures / séance</span>
                                                </div>
                                                {SHOW_ROOMS_SECTION && (
                                                    <div className="flex justify-between gap-4">
                                                        <span className="text-muted-foreground">Temps recommandé:</span>
                                                        <span className="font-medium text-right font-bold text-primary">{formData.recommendedDuration} heures</span>
                                                    </div>
                                                )}
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
                                                    <div className="flex justify-between gap-4 text-red-600 font-bold bg-red-50 p-2 rounded text-xs">
                                                        <span>Réduction abonnement ({Math.round(discountRate * 100)}%):</span>
                                                        <span>-{Math.round(discountAmount)} MAD</span>
                                                    </div>
                                                )}
                                                {surchargeInfo.multiplier > 1 && surchargeAmount > 0 && (
                                                    <div className="flex justify-between gap-4 text-amber-800 font-bold bg-amber-50 p-2 rounded text-xs border border-amber-200">
                                                        <span>{surchargeInfo.label}:</span>
                                                        <span>+{Math.round(surchargeAmount)} MAD</span>
                                                    </div>
                                                )}
                                                {formData.frequency === "oneshot" && (
                                                    <>
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
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t space-y-3">
                                            {formData.frequency === "subscription" && prorataInfo && (prorataInfo.passagesTheoriques > 0 || prorataInfo.passagesRestants > 0) && (
                                                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 space-y-1.5">
                                                    <div className="flex justify-between items-baseline text-xs text-amber-900 font-bold">
                                                        <span>
                                                            {prorataInfo.prorataActive ? "Prorata 1er mois" : "1er mois"} ({prorataInfo.passagesRestants || prorataInfo.passagesTheoriques} intervention{(prorataInfo.passagesRestants || prorataInfo.passagesTheoriques) > 1 ? 's' : ''}) :
                                                        </span>
                                                        <span className="font-extrabold">
                                                            {Math.round(prorataInfo.prorataActive ? prorataInfo.prorataAmount : regularTotalPrice)} MAD
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-baseline text-[11px] text-amber-800 font-medium pt-1 border-t border-amber-200/60">
                                                        <span>À partir du 2ᵉ mois ({prorataInfo.passagesTheoriques} intervention{prorataInfo.passagesTheoriques > 1 ? 's' : ''}) :</span>
                                                        <span className="font-bold text-amber-900 text-right">{Math.round(regularTotalPrice)} MAD/mois</span>
                                                    </div>
                                                </div>
                                            )}
                                            {promoCode && (
                                                <div className="flex justify-between text-emerald-600 font-medium text-sm">
                                                    <span>Réduction ({promoCode.code}) :</span>
                                                    <span>-{promoCode.reduction_type === 'pourcentage' ? `${promoCode.reduction}%` : `${promoCode.reduction} MAD`}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                                <span className="text-lg font-bold">
                                                    {formData.frequency === "subscription" ? (prorataInfo?.prorataActive ? "Total 1er mois" : "Total Mensuel") : "Total"}
                                                </span>
                                                <span className="text-2xl font-bold text-primary">
                                                    {totalPrice} MAD{formData.frequency === "subscription" && !prorataInfo?.prorataActive ? " / mois" : ""}
                                                </span>
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
                                            Formule : Ponctuelle ou Abonnement ?
                                        </h3>
                                        <div className="p-2 space-y-4">
                                            {formData.frequency === "oneshot" && (
                                                <div className="max-w-xl mx-auto px-2 py-1 text-red-500 font-semibold text-xs sm:text-sm md:text-base space-y-1">
                                                    <p className="font-bold text-red-500 text-sm sm:text-base mb-1.5">
                                                        Pourquoi choisir un abonnement ?
                                                    </p>
                                                    <p className="flex items-start gap-2">
                                                        <span className="select-none font-bold">•</span>
                                                        <span>Votre ménage est planifié à l&apos;avance.</span>
                                                    </p>
                                                    <p className="flex items-start gap-2">
                                                        <span className="select-none font-bold">•</span>
                                                        <span>Vous avez la même femme de ménage planifiée pour toutes les interventions.</span>
                                                    </p>
                                                    <p className="flex items-start gap-2">
                                                        <span className="select-none font-bold">•</span>
                                                        <span>Vous bénéficiez d&apos;un tarif réduit grâce à l&apos;abonnement.</span>
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex bg-slate-100 p-1.5 rounded-full w-full max-w-md mx-auto shadow-inner">
                                                <button
                                                    type="button"
                                                    className={`flex-1 py-3 px-6 rounded-full font-bold transition-all ${formData.frequency === "oneshot"
                                                        ? "bg-primary text-white shadow-md"
                                                        : "text-slate-600 hover:text-primary"
                                                        }`}
                                                    onClick={() => setFormData({ ...formData, frequency: "oneshot" })}
                                                >
                                                    Une fois
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`flex-1 py-3 px-6 rounded-full font-bold transition-all flex items-center justify-center gap-1.5 ${formData.frequency === "subscription"
                                                        ? "bg-primary text-white shadow-md"
                                                        : "text-slate-600 hover:text-primary"
                                                        }`}
                                                    onClick={() => setFormData({
                                                        ...formData,
                                                        frequency: "subscription",
                                                        subFrequency: formData.subFrequency || "2foisParSemaine"
                                                    })}
                                                >
                                                    <span>Abonnement</span>
                                                    <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                        jusqu&apos;à -25%
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subscription Scheduler Component if subscription is active */}
                                    {formData.frequency === "subscription" && (
                                        <div className="p-1">
                                            <SubscriptionScheduler
                                                subFrequency={formData.subFrequency || "2foisParSemaine"}
                                                onFrequencyChange={(val, label) => setFormData(prev => ({ ...prev, subFrequency: val }))}
                                                joursPassage={formData.joursPassage}
                                                onJoursPassageChange={(jours) => setFormData(prev => ({ ...prev, joursPassage: jours }))}
                                                startDate={formData.schedulingDate}
                                                onStartDateChange={(date) => setFormData(prev => ({ ...prev, schedulingDate: date }))}
                                                durationHours={formData.duration}
                                                baseMonthlyPrice={totalServicePrice}
                                                onProrataCalculated={(info) => setProrataInfo(info)}
                                                serviceName="menage-standard"
                                            />
                                        </div>
                                    )}

                                    {SHOW_ROOMS_SECTION && (
                                        <div id="rooms-section">
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-2">
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
                                                                    className="h-6 w-6 rounded border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                                />
                                                            ) : (
                                                                <div className="flex items-center gap-3 bg-primary/5 rounded-full p-1">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 rounded-full bg-slate-200 text-primary hover:bg-slate-300"
                                                                        onClick={() => updateRoomCount(room.key, false)}
                                                                    >
                                                                        -
                                                                    </Button>
                                                                    <span className="w-4 text-center font-bold text-primary text-sm">
                                                                        {formData.rooms[room.key]}
                                                                    </span>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 rounded-full bg-slate-200 text-primary hover:bg-slate-300"
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
                                    )}

                                    <div>
                                        {SHOW_ROOMS_SECTION && (
                                            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center space-y-2 mb-8 shadow-inner">
                                                <div className="text-red-500 text-xs text-center space-y-1">
                                                    <p>
                                                        La durée minimale est de 4 heures. Veuillez définir la durée adaptée à votre logement.
                                                    </p>
                                                    <p className="font-bold">
                                                        NB : Cette durée pourra être confirmée ou ajustée après constat sur place par la femme de ménage.
                                                    </p>
                                                </div>
                                                <div className="bg-primary/40 text-white text-3xl font-bold px-10 py-3 rounded-full shadow-lg">
                                                    {formData.recommendedDuration}H : 00
                                                </div>
                                            </div>
                                        )}

                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg text-center mb-2">
                                            Précisez le temps qui vous convient le mieux.
                                        </h3>
                                        <div className="text-red-500 text-xs text-center space-y-1 mb-4">
                                            <p>
                                                La durée minimale est de 4 heures. Veuillez définir la durée adaptée à votre logement.
                                            </p>
                                            <p className="font-bold">
                                                NB : Cette durée pourra être confirmée ou ajustée après constat sur place par la femme de ménage.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-center gap-8 p-4">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-full bg-primary/5 text-primary hover:bg-primary/10 shadow-sm border border-slate-100"
                                                onClick={decrementDuration}
                                                disabled={formData.duration <= 4}
                                            >
                                                <span className="text-2xl">-</span>
                                            </Button>
                                            <span className="text-2xl font-bold text-primary min-w-[40px] text-center">
                                                {formData.duration}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-full bg-primary/5 text-primary hover:bg-primary/10 shadow-sm border border-slate-100"
                                                onClick={incrementDuration}
                                                disabled={formData.duration >= 10}
                                            >
                                                <span className="text-2xl">+</span>
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                            Nombre de personne
                                        </h3>
                                        <div className="flex items-center justify-center gap-8 p-4">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-full bg-primary/5 text-primary hover:bg-primary/10 shadow-sm border border-slate-100"
                                                onClick={decrementPeople}
                                                disabled={formData.numberOfPeople <= 1}
                                            >
                                                <span className="text-2xl">-</span>
                                            </Button>
                                            <span className="text-2xl font-bold text-primary min-w-[40px] text-center">
                                                {formData.numberOfPeople}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-full bg-primary/5 text-primary hover:bg-primary/10 shadow-sm border border-slate-100"
                                                onClick={incrementPeople}
                                            >
                                                <span className="text-2xl">+</span>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Planning Section only for One-shot (as Subscription has its own scheduler above) */}
                                    {formData.frequency === "oneshot" && (
                                        <div>
                                            <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
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
                                                            className="w-4 h-4 text-primary"
                                                        />
                                                        <Label htmlFor="fixed" className="font-bold text-primary text-sm cursor-pointer text-center">Je souhaite une heure fixe</Label>
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <Input
                                                            type="time"
                                                            required
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
                                            {surchargeInfo.isEvening && (
                                                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2 text-left">
                                                    <span className="text-base leading-none">🌙</span>
                                                    <div>
                                                        <strong className="font-bold">Majoration soirée (+50%) :</strong> applicable pour toute intervention à partir de 18h00 (+{Math.round(surchargeAmount)} MAD).
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                            Services optionnels
                                        </h3>
                                        <div className="p-6 border rounded-xl bg-slate-50/50 space-y-4">
                                            <div className="text-center font-bold text-primary mb-4">
                                                Produit fournis par l'agence ménage :
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
                                                {[
                                                    ...PRODUCTS_LIST
                                                ].map((item) => (
                                                    <div key={item} className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
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
                                                        width={48}
                                                        height={48}
                                                        loading="lazy"
                                                    />
                                                    <span className="font-bold text-primary">Produit : + 90 MAD</span>
                                                </div>
                                                <Switch
                                                    checked={formData.additionalServices.produitsEtOutils}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            additionalServices: { ...formData.additionalServices, produitsEtOutils: checked }
                                                        })
                                                    }
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
                                                        🧹
                                                    </div>
                                                    <span className="font-bold text-primary">Torchons et serpillères : + 40 MAD</span>
                                                </div>
                                                <Switch
                                                    checked={formData.additionalServices.torchonsEtSerpierres}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            additionalServices: { ...formData.additionalServices, torchonsEtSerpierres: checked }
                                                        })
                                                    }
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary text-white p-3 rounded-lg mb-4 text-center">
                                            Où aura lieu votre ménage ?
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-xl bg-white mb-4">
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
                                                <Label className="text-xs font-bold text-slate-400">Quartier</Label>
                                                <Input
                                                    placeholder="Votre quartier"
                                                    ref={neighborhoodRef}
                                                    className="border-slate-300 h-11"
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
                                        <div className="p-4 border rounded-xl bg-white">
                                            <Label className="font-bold text-primary">Champs de repère</Label>
                                            <Textarea
                                                placeholder="Donnez-nous des repères pour faciliter le travail de ménage (points de référence pour la tournée du nettoyeur) après les points de repère"
                                                required
                                                ref={changeRepereNotesRef}
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
                                                            ref={phonePrefixRef}
                                                            defaultValue="+212"
                                                            className="w-24 border-slate-300 font-bold text-primary text-center"
                                                            placeholder="+212"
                                                        />
                                                        <Input
                                                            placeholder="6 12 00 00 00"
                                                            ref={phoneNumberRef}
                                                            required
                                                            className="border-slate-300 h-11 flex-1"
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
                                                <Label className="font-bold text-primary text-sm">Numéro whatsapp</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        ref={whatsappPrefixRef}
                                                        defaultValue="+212"
                                                        className="w-20 border-slate-300 font-bold text-primary text-center"
                                                        placeholder="+212"
                                                        disabled={formData.useWhatsappForPhone}
                                                    />
                                                    <Input
                                                        placeholder="6 12 00 00 00"
                                                        ref={whatsappNumberRef}
                                                        className="border-slate-300 h-11"
                                                        disabled={formData.useWhatsappForPhone}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-primary text-sm">Nom*</Label>
                                                <Input
                                                    ref={lastNameRef}
                                                    required
                                                    className="mt-1 border-slate-300 h-11"
                                                    placeholder="Votre nom"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-primary text-sm">Prénom*</Label>
                                                <Input
                                                    ref={firstNameRef}
                                                    required
                                                    className="mt-1 border-slate-300 h-11"
                                                    placeholder="Votre prénom"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <PromoCodeInput
                                        segment="particulier"
                                        service="ménage standard"
                                        onApplyPromo={setPromoCode}
                                        getPhoneNumber={() => `${phonePrefixRef.current?.value.trim() || '+212'} ${phoneNumberRef.current?.value.trim() || ''}`.trim()}
                                    />

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
                                                "Réserver maintenant"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
                <OtherServices type="particulier" currentServiceUrl="/services/particulier/menage-standard" />
            </div>

            <Footer />

            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md bg-white border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed">
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
