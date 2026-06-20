"use client";
import { useState, Suspense, useRef } from "react";
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
import serviceChantier from "@/assets/service-fin-chantier-particulier.webp";
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
import { CASABLANCA_NEIGHBORHOODS, DEFAULT_CITY, CITIES, SURCHARGE_CITIES, NEIGHBORHOODS_BY_CITY } from "@/constants/locations";

const INITIAL_FORM_DATA = {
    propertyType: "studio",
    surfaceArea: 50,
    city: DEFAULT_CITY,
    neighborhood: "",
    schedulingTime: "morning",
    schedulingType: "flexible",
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

const MenageFinChantierContent = () => {
    const [wasValidated, setWasValidated] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const router = useRouter();

    // Champs texte non-contrôlés (lus au submit) pour éviter de re-rendre tout
    // le formulaire à chaque frappe (optimisation INP).
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const phonePrefixRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const whatsappPrefixRef = useRef<HTMLInputElement>(null);
    const whatsappNumberRef = useRef<HTMLInputElement>(null);
    const neighborhoodRef = useRef<HTMLInputElement>(null);
    const changeRepereNotesRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasValidated(true);

        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
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

        if (!firstName || !lastName || !phoneNumber || !formData.city || !neighborhood) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setIsSubmitting(true);
        try {
            const bookingData = {
                ...formData,
                firstName,
                lastName,
                neighborhood,
                changeRepereNotes,
                phonePrefix,
                whatsappPrefix,
                phoneNumber: `${phonePrefix} ${phoneNumber}`,
                whatsappNumber: formData.useWhatsappForPhone
                    ? `${phonePrefix} ${phoneNumber}`
                    : `${whatsappPrefix} ${whatsappNumber}`
            };

            setCustomerName(`${firstName} ${lastName}`);

            const message = formatBookingMessage("Nettoyage Fin de chantier", bookingData, "Sur devis", false);
            const whatsappLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, message);

            // Send email notification (await to ensure back-office recording)
            const result = await sendBookingEmail("Nettoyage Fin de chantier", bookingData, "Sur devis", false);

            if (result.success) {
                setShowConfirmation(true);
            } else {
                if (result.emailSent) {
                    toast.warning("Demande envoyée par email, mais l'enregistrement automatique a échoué. Nous vous contacterons rapidement.");
                    setShowConfirmation(true);
                } else {
                    toast.error("Une erreur est survenue lors de la réservation. Veuillez nous contacter via WhatsApp.");
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
            setWasValidated(false);
            setFormData(INITIAL_FORM_DATA);
            router.push(window.location.pathname + "/merci");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="bg-[hsl(var(--primary)/0.05)]" style={{ "--primary": SERVICE_COLORS.CHANTIER_P.hsl, "--secondary": `${SERVICE_COLORS.CHANTIER_P.hsl.split(' ').slice(0, 2).join(' ')} 90%` } as React.CSSProperties}>
                <ServiceHeroSection
                    title="Nettoyage Fin de chantier"
                    description={`Le ménage de fin de chantier consiste à effectuer un nettoyage approfondi du logement ou des locaux après des travaux, afin de les rendre propres, sains et prêts à être utilisés.

La prestation comprend : L’évacuation des poussières et résidus de chantier, Le nettoyage des sols (balayage, aspiration et lavage),Le dépoussiérage et le nettoyage des surfaces, murs et plinthes accessibles, Le nettoyage des vitres accessibles et encadrements, La désinfection des sanitaires, Le nettoyage de la cuisine, L’entretien des escaliers, balcons, terrasses et autres espaces accessibles.`}
                    image={serviceChantier.src}
                    primaryColor={SERVICE_COLORS.CHANTIER_P.hex}
                    faqs={[
                        {
                            question: "Intervenez-vous avec du matériel industriel spécifique ?",
                            answer: "Oui, un nettoyage post-travaux exige un équipement lourd et professionnel. Nos équipes interviennent sur votre site avec l'intégralité du matériel industriel nécessaire (aspirateurs de chantier à eau et poussière, monobrosses, raclettes professionnelles) pour garantir une remise en état parfaite de vos espaces fraîchement construits ou rénovés à Casablanca et Rabat."
                        },
                        {
                            question: "Êtes-vous capables d'éliminer les traces tenaces (ciment, colle, peinture) ?",
                            answer: "Absolument. Nos agents maîtrisent les techniques de nettoyage de fin de chantier. En combinant l'action de nos machines et de produits spécifiques rigoureusement adaptés à la nature de chaque tâche (voile de ciment, gouttes de peinture, résidus de scotch ou de colle), nous éliminons les salissures les plus tenaces tout en préservant l'intégrité de vos matériaux neufs et de vos sols fragiles."
                        },
                        {
                            question: "Prenez-vous en charge l'évacuation des gravats et déchets de chantier ?",
                            answer: "L'évacuation des gros encombrants et des gravats lourds n'est pas incluse dans notre prestation de nettoyage de base. Cependant, pour vous offrir une solution clé en main et vous faire gagner du temps avant la livraison de votre chantier, nous proposons le déblaiement en tant qu'option payante supplémentaire. Il suffit de nous le préciser lors de votre demande de devis."
                        },
                        {
                            question: "Faut-il que l'eau et l'électricité soient raccordées pour votre intervention ?",
                            answer: "Oui, c'est une condition indispensable à la réussite de notre mission. Pour pouvoir faire fonctionner nos équipements industriels et procéder au lessivage complet de vos surfaces, le chantier doit obligatoirement être raccordé à l'eau courante et à l'électricité le jour de l'intervention de nos équipes."
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
                                                <span className="font-medium text-right text-slate-700 text-xs">Nettoyage Fin de chantier</span>
                                            </div>

                                            {/* Detailed info - hidden on mobile when collapsed */}
                                            <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Surface:</span>
                                                    <span className="font-medium text-right text-slate-700">{formData.surfaceArea} m²</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
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
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 rounded-lg mb-4 text-center">
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
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 rounded-lg mb-4 text-center">
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

                                    {/* Planning */}
                                    <div>
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 rounded-lg mb-4 text-center">
                                            Planning pour votre demande
                                        </h3>
                                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                {/* Column 1: Fixed Time */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-2.5">
                                                        <input
                                                            type="radio"
                                                            id="fixed"
                                                            name="schedulingType"
                                                            checked={formData.schedulingType === "fixed"}
                                                            onChange={() => setFormData({ ...formData, schedulingType: "fixed" })}
                                                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                                                        />
                                                        <label htmlFor="fixed" className="font-bold text-slate-700 text-sm cursor-pointer">
                                                            Je souhaite une heure fixe
                                                        </label>
                                                    </div>
                                                    <Input
                                                        type="time"
                                                        required
                                                        value={formData.fixedTime}
                                                        onChange={(e) => setFormData({ ...formData, fixedTime: e.target.value })}
                                                        disabled={formData.schedulingType !== "fixed"}
                                                        className="w-full max-w-[160px] text-center text-lg font-bold h-11 border-slate-300 rounded-xl"
                                                    />
                                                </div>

                                                {/* Column 2: Flexible */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-2.5">
                                                        <input
                                                            type="radio"
                                                            id="flexible"
                                                            name="schedulingType"
                                                            checked={formData.schedulingType === "flexible"}
                                                            onChange={() => setFormData({ ...formData, schedulingType: "flexible" })}
                                                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                                                        />
                                                        <label htmlFor="flexible" className="font-bold text-slate-700 text-sm cursor-pointer">
                                                            Je suis flexible
                                                        </label>
                                                    </div>
                                                    <RadioGroup
                                                        value={formData.schedulingTime}
                                                        onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })}
                                                        disabled={formData.schedulingType !== "flexible"}
                                                        className="space-y-2 pl-6"
                                                    >
                                                        <div className="flex items-center space-x-2.5">
                                                            <RadioGroupItem value="morning" id="morning" className="border-primary text-primary" />
                                                            <label htmlFor="morning" className="text-sm font-medium text-slate-700 cursor-pointer">
                                                                Le matin
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center space-x-2.5">
                                                            <RadioGroupItem value="afternoon" id="afternoon" className="border-primary text-primary" />
                                                            <label htmlFor="afternoon" className="text-sm font-medium text-slate-700 cursor-pointer">
                                                                L'après midi
                                                            </label>
                                                        </div>
                                                    </RadioGroup>
                                                </div>

                                                {/* Column 3: Date */}
                                                <div className="space-y-3">
                                                    <div className="font-bold text-slate-700 text-sm">Date</div>
                                                    <Input
                                                        type="date"
                                                        required
                                                        value={formData.schedulingDate}
                                                        onChange={(e) => setFormData({ ...formData, schedulingDate: e.target.value })}
                                                        className="w-full border-slate-300 rounded-xl h-11 text-slate-700 font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 rounded-lg mb-4 text-center">
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
                                            <Label className="font-bold text-slate-700">Champs de repère</Label>
                                            <Textarea
                                                placeholder="Donnez-nous des repères pour faciliter le travail de ménage (points de référence pour la tournée du nettoyeur) après les points de repère"
                                                required
                                                ref={changeRepereNotesRef}
                                                className="mt-2 border-slate-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <h3 className="text-xl font-bold bg-primary/10 text-primary p-3 text-center">
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
                                                            ref={phonePrefixRef}
                                                            defaultValue="+212"
                                                            className="w-24 border-slate-300 font-bold text-slate-600 text-center"
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
                                                        ref={whatsappPrefixRef}
                                                        defaultValue="+212"
                                                        className="bg-slate-100 border rounded-lg w-24 text-center font-bold text-primary"
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
                                                <Label className="font-bold text-slate-700 text-sm">Nom*</Label>
                                                <Input
                                                    ref={lastNameRef}
                                                    required
                                                    className="mt-1 border-slate-300 h-11"
                                                    placeholder="Votre nom"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-slate-700 text-sm">Prénom*</Label>
                                                <Input
                                                    ref={firstNameRef}
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
                                            disabled={isSubmitting}
                                            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-bold shadow-lg shadow-primary/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Envoi en cours...
                                                </div>
                                            ) : (
                                                "Demander un devis"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
                <OtherServices type="particulier" currentServiceUrl="/services/particulier/menage-fin-chantier" />
            </div>

            <Footer />

            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md bg-white border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed">
                            {getConfirmationMessage(customerName, true)}
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

export default function MenageFinChantierClient() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-2xl text-primary animate-pulse">Chargement...</div>}>
            <MenageFinChantierContent />
        </Suspense>
    );
}
