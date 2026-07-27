"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICE_COLORS } from "@/constants/service-colors";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceHeroSection from "@/components/ServiceHeroSection";
import OtherServices from "@/components/OtherServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import serviceAirbnb from "@/assets/service-menage-airbnb.webp";
import { createWhatsAppLink, DESTINATION_PHONE_NUMBER } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

export default function MenageAirbnbClient() {
    const router = useRouter();

    // Form states
    const [formBiensOption, setFormBiensOption] = useState<"1-2" | "3+">("3+");
    const [formVille, setFormVille] = useState<"Casablanca" | "Rabat">("Casablanca");
    const [formNbBiens, setFormNbBiens] = useState<string>("3 biens");
    const [formTypesLogement, setFormTypesLogement] = useState<string>("");
    
    // Services of interest checkboxes
    const [interestReassort, setInterestReassort] = useState<boolean>(false);
    const [interestVideo, setInterestVideo] = useState<boolean>(false);
    const [interestMateriel, setInterestMateriel] = useState<boolean>(false);
    const [interestLinge, setInterestLinge] = useState<boolean>(false);

    // Contact info states
    const [formIndicatif, setFormIndicatif] = useState<string>("+212");
    const [formTel, setFormTel] = useState<string>("");
    const [formNom, setFormNom] = useState<string>("");
    const [formMomentRappel, setFormMomentRappel] = useState<string>("Dès que possible");

    // UX states
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [customerName, setCustomerName] = useState<string>("");

    const handleBiensOptionChange = (value: "1-2" | "3+") => {
        setFormBiensOption(value);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formBiensOption === "1-2") {
            toast.error("Pour 1 ou 2 biens, veuillez vous orienter vers notre service Ménage standard.");
            return;
        }

        if (!formTel.trim() || !formNom.trim()) {
            toast.error("Veuillez remplir tous les champs obligatoires (téléphone et nom complet)");
            return;
        }

        setIsSubmitting(true);
        try {
            const selectedServices = [
                interestReassort ? "Réassort consommables" : "",
                interestVideo ? "Vidéo avant/après" : "",
                interestMateriel ? "Matériel fourni" : "",
                (formVille !== "Rabat" && interestLinge) ? "Service linge" : ""
            ].filter(Boolean);

            const servicesText = selectedServices.join(", ") || "Aucun";

            const fullPhone = `${formIndicatif.trim()} ${formTel.trim()}`.trim();

            const bookingData = {
                firstName: "",
                lastName: formNom,
                phoneNumber: fullPhone,
                whatsappNumber: fullPhone,
                city: formVille,
                frequency: "oneshot",
                frequencyLabel: "Une fois",
                numberOfPeople: 1,
                serviceType: "Airbnb / Conciergerie",
                propertyType: "Airbnb / Conciergerie",
                // Additional properties for Django CRM/lead tracing
                nombre_biens: formNbBiens,
                types_logement: formTypesLogement || "Non spécifié",
                services_interet: servicesText,
                moment_rappel: formMomentRappel,
                source: "Site — Menage Airbnb",
                changeRepereNotes: `Demande de rappel pour conciergerie Airbnb.
Nombre de biens : ${formNbBiens}
Types de logement : ${formTypesLogement || 'Non spécifié'}
Services d'intérêt : ${servicesText}
Moment souhaité pour le rappel : ${formMomentRappel}`
            };

            setCustomerName(formNom);

            // Send lead data to backend
            const result = await sendBookingEmail("Ménage Airbnb", bookingData, "Rappel conseiller", false);

            if (result.success || result.emailSent) {
                // Generate WhatsApp prepopulated link and open it
                const msg = `Bonjour, je souhaite être rappelé pour le service Conciergerie Airbnb. Biens : ${formNbBiens}. Ville : ${formVille}. Services : ${servicesText}. Nom : ${formNom}.`;
                const waLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, msg);
                window.open(waLink, '_blank');

                setShowConfirmation(true);
            } else {
                toast.error("Une erreur est survenue lors de l'enregistrement de votre demande.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Une erreur est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseConfirmation = (open: boolean) => {
        setShowConfirmation(open);
        if (!open) {
            // Reset form
            setFormNbBiens("3 biens");
            setFormTypesLogement("");
            setInterestReassort(false);
            setInterestVideo(false);
            setInterestMateriel(false);
            setInterestLinge(false);
            setFormTel("");
            setFormNom("");
            setFormMomentRappel("Dès que possible");
            router.push(window.location.pathname + "/merci");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="bg-[hsl(var(--primary)/0.05)]" style={{ "--primary": SERVICE_COLORS.AIRBNB.hsl } as React.CSSProperties}>
                <ServiceHeroSection
                    title="Ménage Airbnb"
                    hideReservationButton={true}
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
                    primaryColor={SERVICE_COLORS.AIRBNB.hex}
                    faqs={[
                        {
                            question: "Gérez-vous le séchage et le repassage du linge de maison (draps, serviettes) ?",
                            answer: "Oui, nous savons que la qualité du linge est le premier critère pour obtenir un avis 5 étoiles de vos voyageurs. C'est pourquoi nous proposons, en option complémentaire, la prise en charge du séchage et du repassage minutieux de vos draps et serviettes pour garantir des lits dignes d'un service hôtelier à chaque nouvelle arrivée."
                        },
                        {
                            question: "Gérez-vous le réapprovisionnement des consommables de base (savon, papier toilette, café) ?",
                            answer: "Nous vous proposons l'achat et le réapprovisionnement des consommables via nos formules Réassort (Essentiel ou Confort) pour que vos voyageurs ne manquent de rien."
                        },
                        {
                            question: "Pouvez-vous intervenir le dimanche entre deux réservations (check-out / check-in) ?",
                            answer: "Absolument. Nous connaissons les contraintes de la location courte durée à Casablanca comme à Rabat et savons que les rotations n'attendent pas. Nos équipes spécialisées Airbnb sont pleinement opérationnelles 7 jours sur 7, du lundi au dimanche inclus, pour assurer des transitions parfaites et ponctuelles."
                        },
                        {
                            question: "Que se passe-t-il si votre équipe constate des dégradations laissées par les voyageurs ?",
                            answer: "Nous sommes vos yeux sur place. Dès qu'une de nos intervenantes constate une casse, une dégradation ou toute anomalie anormale dans votre logement, notre protocole est strict : nous prenons immédiatement des photos détaillées et nous vous partageons ces preuves en temps réel."
                        }
                    ]}
                />

                <main className="flex-1 bg-transparent py-12">
                    <div className="container max-w-5xl px-4 md:px-6">
                        
                        {/* Orientation: Combien de biens ? */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10 max-w-3xl mx-auto">
                            <h3 className="text-xl font-bold font-poppins text-slate-800 mb-6 text-center">
                                Combien de biens souhaitez-vous nous confier ?
                            </h3>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-emerald-600">
                                    <div className="text-slate-700 text-sm md:text-base">
                                        <strong className="text-slate-900">1 ou 2 biens</strong> — notre offre <strong className="text-emerald-700">Ménage standard</strong> est faite pour vous
                                    </div>
                                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0">
                                        <a href="/services/particulier/menage-standard">
                                            Voir le Ménage standard →
                                        </a>
                                    </Button>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#fbf5e8] border border-[#c9a84c]">
                                    <div className="text-slate-700 text-sm md:text-base">
                                        <strong className="text-slate-900">3 biens ou plus</strong> — vous bénéficiez de notre <strong className="text-primary">tarif Conciergerie</strong> ci-dessous
                                    </div>
                                    <Button onClick={() => document.getElementById('grid-conciergerie')?.scrollIntoView({ behavior: 'smooth' })} variant="outline" className="border-[#c9a84c] text-primary hover:bg-[#c9a84c]/10 shrink-0 font-semibold">
                                        ↓ Voir la grille
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Grille Tarif Conciergerie */}
                        <div id="grid-conciergerie" className="mb-10 max-w-3xl mx-auto scroll-mt-24">
                            <div className="mb-6 text-center sm:text-left">
                                <span className="inline-block bg-[#c9a84c] text-[#0d0d08] font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                                    Le plus avantageux
                                </span>
                                <h3 className="text-2xl font-bold font-poppins text-slate-800">
                                    Tarif conciergerie
                                </h3>
                                <p className="text-slate-500 text-sm">
                                    Réservé aux hôtes confiant 3 biens ou plus · prix fixe par intervention, tout compris
                                </p>
                            </div>
                            
                            <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm bg-white">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-primary text-white font-poppins text-sm">
                                            <th className="p-4 font-semibold">Type de logement</th>
                                            <th className="p-4 font-semibold text-right">Prix par intervention</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700 text-sm md:text-base">
                                        {[
                                            { type: "Studio / 1 chambre", price: 130 },
                                            { type: "2 chambres", price: 160 },
                                            { type: "3 chambres", price: 190 },
                                            { type: "4 chambres", price: 220 },
                                            { type: "5 chambres", price: 250 },
                                        ].map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 font-medium">{item.type}</td>
                                                <td className="p-4 text-right font-bold text-primary">{item.price} DH</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-[#0d0d08] text-white hover:bg-[#0d0d08]/95 transition-colors">
                                            <td className="p-4">
                                                <div className="font-semibold">Villa / Riad</div>
                                                <div className="text-xs text-[#e7d3a0]/90 font-medium mt-0.5">
                                                    Deux femmes de ménage systématiquement
                                                </div>
                                            </td>
                                            <td className="p-4 text-right font-black text-lg text-[#c9a84c]">
                                                300 DH
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="mt-4 bg-[#fbf5e8] border border-[#c9a84c] rounded-xl p-4 text-slate-700 text-sm leading-relaxed">
                                <strong className="text-primary font-bold">Supplément zone éloignée : +50 DH</strong> — Bouskoura, Dar Bouazza, Mansouria, Almaz, Sidi Rahal, Benslimane, Mohammédia, Ville Verte et zones assimilées.
                            </div>
                        </div>

                        {/* Options complémentaires */}
                        <div className="mb-10 max-w-3xl mx-auto">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold font-poppins text-slate-800">
                                    Options complémentaires
                                </h3>
                                <p className="text-slate-500 text-sm">
                                    À ajouter à votre convenance
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: "Réassort Essentiel", desc: "Eau, café, papier hygiénique, savon main, sacs poubelle", price: 49 },
                                    { name: "Réassort Confort", desc: "Essentiel + shampoing, après-shampoing, gel douche", price: 79 },
                                    { name: "Vidéo avant / après", desc: "Preuve filmée de l'état du logement", price: 10 },
                                    { name: "Mise à disposition du matériel", desc: "Produits, torchons et serpillère fournis", price: 29 },
                                ].map((opt, idx) => (
                                    <div key={idx} className="flex justify-between items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-primary/30 transition-all shadow-sm">
                                        <div className="space-y-1">
                                            <h4 className="font-semibold text-slate-900 text-sm md:text-base">{opt.name}</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                                        </div>
                                        <div className="font-extrabold text-lg text-[#c9a84c] shrink-0">
                                            {opt.price} DH
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Service Linge */}
                        <div className="mb-14 bg-primary text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center gap-6 max-w-3xl mx-auto">
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-3xl shrink-0">
                                🧺
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-1">
                                <h4 className="font-bold font-poppins text-lg flex flex-wrap justify-center md:justify-start items-center gap-2">
                                    Service linge
                                    <span className="bg-[#c9a84c] text-[#0d0d08] font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-0.5 rounded-full">
                                        Casablanca uniquement
                                    </span>
                                </h4>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    Lavage, séchage et repassage d'un set complet (8 pièces). Ramassage et livraison inclus. Pièce supplémentaire : <strong className="text-white">+5 DH</strong>.
                                </p>
                            </div>
                            <div className="text-3xl font-black font-poppins shrink-0 whitespace-nowrap text-[#e7d3a0]">
                                50 DH <span className="text-xs font-normal opacity-80">/ set</span>
                            </div>
                        </div>

                        {/* Formulaire de rappel */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-lg max-w-3xl mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold font-poppins text-primary">
                                    Être rappelé par un conseiller
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">
                                    Un conseiller clientèle vous rappelle rapidement pour organiser vos interventions
                                </p>
                            </div>
                            
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                {/* Combien de biens */}
                                <div className="space-y-3">
                                    <Label className="font-bold text-slate-800 text-sm md:text-base">
                                        Combien de biens souhaitez-vous nous confier ?
                                    </Label>
                                    <RadioGroup 
                                        value={formBiensOption} 
                                        onValueChange={handleBiensOptionChange}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        <label 
                                            htmlFor="biens-1-2"
                                            className={`flex items-center space-x-2 border-2 rounded-xl p-4 cursor-pointer transition-all ${formBiensOption === "1-2" ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <RadioGroupItem value="1-2" id="biens-1-2" className="text-primary border-primary" />
                                            <span className="font-bold text-slate-700 select-none text-sm md:text-base">
                                                1 ou 2 biens
                                            </span>
                                        </label>
                                        <label 
                                            htmlFor="biens-3"
                                            className={`flex items-center space-x-2 border-2 rounded-xl p-4 cursor-pointer transition-all ${formBiensOption === "3+" ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <RadioGroupItem value="3+" id="biens-3" className="text-primary border-primary" />
                                            <span className="font-bold text-slate-700 select-none text-sm md:text-base">
                                                3 biens ou plus
                                            </span>
                                        </label>
                                    </RadioGroup>
                                    
                                    {/* Orientation redirect message */}
                                    {formBiensOption === "1-2" && (
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#fbf5e8] border border-[#c9a84c] animate-in fade-in slide-in-from-top-2 duration-300">
                                            <span className="text-slate-700 text-xs md:text-sm">
                                                Pour 1 ou 2 biens, notre offre <strong>Ménage standard</strong> est plus adaptée.
                                            </span>
                                            <Button asChild size="sm" className="bg-primary text-white font-semibold">
                                                <a href="/services/particulier/menage-standard">
                                                    Aller au Ménage standard →
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Section conditionnelle du formulaire principal */}
                                <div className={`space-y-6 transition-all duration-300 ${formBiensOption === "1-2" ? 'opacity-35 pointer-events-none select-none' : 'opacity-100'}`}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Ville */}
                                        <div className="space-y-2">
                                            <Label htmlFor="form-ville" className="font-bold text-slate-700 text-sm">Ville</Label>
                                            <Select 
                                                value={formVille} 
                                                onValueChange={(val) => {
                                                    const v = val as 'Casablanca' | 'Rabat';
                                                    setFormVille(v);
                                                    if (v === "Rabat") setInterestLinge(false);
                                                }}
                                            >
                                                <SelectTrigger id="form-ville" className="h-11 rounded-xl border-slate-200">
                                                    <SelectValue placeholder="Sélectionner une ville" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Casablanca">Casablanca</SelectItem>
                                                    <SelectItem value="Rabat">Rabat</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        {/* Nombre de biens */}
                                        <div className="space-y-2">
                                            <Label htmlFor="form-nb-biens" className="font-bold text-slate-700 text-sm">Nombre de biens à confier</Label>
                                            <Select 
                                                value={formNbBiens} 
                                                onValueChange={setFormNbBiens}
                                            >
                                                <SelectTrigger id="form-nb-biens" className="h-11 rounded-xl border-slate-200">
                                                    <SelectValue placeholder="Sélectionner le nombre de biens" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="3 biens">3 biens</SelectItem>
                                                    <SelectItem value="4 biens">4 biens</SelectItem>
                                                    <SelectItem value="5 biens">5 biens</SelectItem>
                                                    <SelectItem value="6 biens">6 biens</SelectItem>
                                                    <SelectItem value="Plus de 6 biens">Plus de 6 biens</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    
                                    {/* Types de logement concernés (facultatif) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="form-types-logement" className="font-bold text-slate-700 text-sm">
                                            Types de logement concernés (facultatif)
                                        </Label>
                                        <Input 
                                            id="form-types-logement"
                                            placeholder="Ex : 2 studios et un 2 chambres à Gauthier..."
                                            value={formTypesLogement}
                                            onChange={(e) => setFormTypesLogement(e.target.value)}
                                            className="h-11 rounded-xl border-slate-200"
                                        />
                                    </div>
                                    
                                    {/* Services d'intérêt */}
                                    <div className="space-y-3">
                                        <Label className="font-bold text-slate-700 text-sm">
                                            Services qui vous intéressent (facultatif)
                                        </Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {/* Réassort */}
                                            <label 
                                                htmlFor="srv-reassort"
                                                className="flex items-center space-x-2 border border-slate-200 rounded-xl p-3 bg-white hover:bg-slate-50 cursor-pointer"
                                            >
                                                <Checkbox 
                                                    id="srv-reassort"
                                                    checked={interestReassort}
                                                    onCheckedChange={(checked) => setInterestReassort(!!checked)}
                                                    className="data-[state=checked]:bg-primary border-slate-300"
                                                />
                                                <span className="font-medium text-slate-700 text-xs md:text-sm select-none">
                                                    Réassort consommables
                                                </span>
                                            </label>
                                            
                                            {/* Vidéo */}
                                            <label 
                                                htmlFor="srv-video"
                                                className="flex items-center space-x-2 border border-slate-200 rounded-xl p-3 bg-white hover:bg-slate-50 cursor-pointer"
                                            >
                                                <Checkbox 
                                                    id="srv-video"
                                                    checked={interestVideo}
                                                    onCheckedChange={(checked) => setInterestVideo(!!checked)}
                                                    className="data-[state=checked]:bg-primary border-slate-300"
                                                />
                                                <span className="font-medium text-slate-700 text-xs md:text-sm select-none">
                                                    Vidéo avant/après
                                                </span>
                                            </label>
                                            
                                            {/* Matériel */}
                                            <label 
                                                htmlFor="srv-materiel"
                                                className="flex items-center space-x-2 border border-slate-200 rounded-xl p-3 bg-white hover:bg-slate-50 cursor-pointer"
                                            >
                                                <Checkbox 
                                                    id="srv-materiel"
                                                    checked={interestMateriel}
                                                    onCheckedChange={(checked) => setInterestMateriel(!!checked)}
                                                    className="data-[state=checked]:bg-primary border-slate-300"
                                                />
                                                <span className="font-medium text-slate-700 text-xs md:text-sm select-none">
                                                    Matériel fourni
                                                </span>
                                            </label>
                                            
                                            {/* Service Linge */}
                                            <label 
                                                htmlFor="srv-linge"
                                                className={`flex items-center space-x-2 border border-slate-200 rounded-xl p-3 bg-white transition-all ${formVille === "Rabat" ? "opacity-50 select-none bg-slate-50 cursor-not-allowed" : "hover:bg-slate-50 cursor-pointer"}`}
                                            >
                                                <Checkbox 
                                                    id="srv-linge"
                                                    checked={formVille === "Rabat" ? false : interestLinge}
                                                    onCheckedChange={(checked) => {
                                                        if (formVille !== "Rabat") setInterestLinge(!!checked);
                                                    }}
                                                    disabled={formVille === "Rabat"}
                                                    className="data-[state=checked]:bg-primary border-slate-300"
                                                />
                                                <span className="flex items-center justify-between w-full font-medium text-slate-700 text-xs md:text-sm select-none">
                                                    <span>Service linge</span>
                                                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${formVille === "Rabat" ? "bg-slate-200 text-slate-500" : "bg-primary/10 text-primary"}`}>
                                                        {formVille === "Rabat" ? "Bientôt disponible à Rabat" : "CASA"}
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    {/* Contact info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="form-tel" className="font-bold text-slate-700 text-sm">Téléphone / WhatsApp*</Label>
                                            <div className="flex gap-2">
                                                <Input 
                                                    id="form-indicatif"
                                                    value={formIndicatif}
                                                    onChange={(e) => setFormIndicatif(e.target.value)}
                                                    placeholder="+212"
                                                    className="w-24 h-11 rounded-xl border-slate-200 font-bold text-primary text-center shrink-0"
                                                />
                                                <Input 
                                                    id="form-tel"
                                                    placeholder="6 12 00 00 00"
                                                    required
                                                    value={formTel}
                                                    onChange={(e) => setFormTel(e.target.value)}
                                                    className="h-11 rounded-xl border-slate-200 flex-1"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="form-nom" className="font-bold text-slate-700 text-sm">Nom complet*</Label>
                                            <Input 
                                                id="form-nom"
                                                placeholder="Votre nom"
                                                required
                                                value={formNom}
                                                onChange={(e) => setFormNom(e.target.value)}
                                                className="h-11 rounded-xl border-slate-200"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Moment de rappel */}
                                    <div className="space-y-2">
                                        <Label htmlFor="form-moment-rappel" className="font-bold text-slate-700 text-sm">Meilleur moment pour être rappelé</Label>
                                        <Select 
                                            value={formMomentRappel} 
                                            onValueChange={setFormMomentRappel}
                                        >
                                            <SelectTrigger id="form-moment-rappel" className="h-11 rounded-xl border-slate-200">
                                                <SelectValue placeholder="Sélectionner un moment" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Dès que possible">Dès que possible</SelectItem>
                                                <SelectItem value="Matin (9h-12h)">Matin (9h-12h)</SelectItem>
                                                <SelectItem value="Après-midi (14h-18h)">Après-midi (14h-18h)</SelectItem>
                                                <SelectItem value="En soirée">En soirée</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="pt-4">
                                        <Button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full bg-primary hover:bg-primary/95 text-white font-bold font-poppins py-4 text-base rounded-xl transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Envoi en cours...
                                                </div>
                                            ) : (
                                                "Être rappelé par un conseiller →"
                                            )}
                                        </Button>
                                        <div className="text-center mt-4 text-slate-500 text-sm">
                                            Ou contactez-nous directement sur WhatsApp au <b className="text-primary">06 64 33 14 63</b>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                </main>
                <OtherServices type="particulier" currentServiceUrl="/services/menage-airbnb" />
            </div>

            <Footer />

            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md bg-white border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold">Confirmation</DialogTitle>
                        <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed">
                            Merci {customerName}, votre demande de rappel a bien été reçue. Un conseiller clientèle vous rappellera très vite pour organiser vos interventions.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button
                            onClick={() => handleCloseConfirmation(false)}
                            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 font-bold"
                        >
                            Fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
