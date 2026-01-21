"use client";
import React, { useState, useRef } from "react";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
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

// New assets
import gardeMaladeHero from "@/assets/service-garde-malade.png";
import handsCare from "@/assets/hands-care.png";
import caregiverVisit from "@/assets/caregiver-visit.png";

const GardeMalade = () => {
  const [showForm, setShowForm] = useState(false);
  const [wasValidated, setWasValidated] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    frequency: "oneshot",
    subFrequency: "",
    duration: 24,
    numberOfPeople: 1,
    careLocation: "domicile",
    careAddress: "",
    city: "",
    neighborhood: "",
    patientAge: "",
    patientGender: "",
    mobility: "",
    healthIssues: "",
    schedulingTime: "morning",
    schedulingDate: "",
    fixedTime: "14:00",
    numberOfDays: 1,
    additionalNotes: "",
    phoneNumber: "",
    phonePrefix: "+212",
    useWhatsappForPhone: true,
    whatsappPrefix: "+212",
    whatsappNumber: "",
    firstName: "",
    lastName: ""
  });

  const totalPrice = 0;
  const discountAmount = 0;

  const scrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

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

    const isDevis = totalPrice <= 0;
    const priceValue = isDevis ? "Sur devis" : totalPrice;
    const message = formatBookingMessage("Garde Malade", bookingData, priceValue, false);
    const whatsappLink = createWhatsAppLink(DESTINATION_PHONE_NUMBER, message);

    // Send email notification (async)
    sendBookingEmail("Garde Malade", bookingData, priceValue).catch(console.error);

    window.open(whatsappLink, '_blank');
    setShowConfirmation(true);
  };

  const incrementPeople = () => setFormData({ ...formData, numberOfPeople: formData.numberOfPeople + 1 });
  const decrementPeople = () => setFormData({ ...formData, numberOfPeople: Math.max(1, formData.numberOfPeople - 1) });

  const incrementDays = () => setFormData({ ...formData, numberOfDays: formData.numberOfDays + 1 });
  const decrementDays = () => setFormData({ ...formData, numberOfDays: Math.max(1, formData.numberOfDays - 1) });

  const frequencies = [
    { value: "4foisSemaine", label: "4 fois par semaine" },
    { value: "3foisSemaine", label: "3 fois par semaine" },
    { value: "1foisSemaine", label: "Une fois par semaine" },
    { value: "5foisSemaine", label: "5 fois par semaine" },
    { value: "6foisSemaine", label: "6 fois par semaine" },
    { value: "7foisSemaine", label: "7 fois par semaine" },
    { value: "2foisSemaine", label: "2 fois par semaine" },
    { value: "1semaine2", label: "Une semaine sur deux" },
    { value: "1foisMois", label: "1 fois par mois" }
  ];

  const getFrequencyLabel = (value: string, subValue: string) => {
    if (value === "oneshot") return "One shot - Tranche de 24h";
    const freq = frequencies.find(f => f.value === subValue);
    return freq ? `Abonnement - ${freq.label}` : "Abonnement";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f1]">
      <Header />

      <main className="flex-1 flex flex-col" style={{ "--primary": "28 59% 45%" } as React.CSSProperties}>
        {/* Landing Sections */}
        <section className="bg-[#f0e4d4] py-16">
          <div className="container px-6 relative">
            <button
              onClick={() => window.history.back()}
              className="absolute -top-4 md:-top-8 left-0 xl:-left-4 p-2 hover:bg-[#b46d2f]/10 rounded-full transition-colors text-[#b46d2f]"
              aria-label="Retour"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-8 text-left">
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#b46d2f] leading-[1.1]">
                    Auxiliaires de vie /<br />Garde malade
                  </h1>
                  <p className="text-xl md:text-2xl font-bold text-[#4a4a4a]">
                    à domicile à Casablanca – Service 24h/24
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[2rem] shadow-xl border border-[#e2d9c2] text-lg text-[#4a4a4a] leading-relaxed font-bold">
                  Le service d'auxiliaires de vie / garde malade à domicile à Casablanca, proposé par Agence Ménage, met à votre disposition des auxiliaires de vie à domicile expérimentées pour accompagner les patients dans leur quotidien, avec sérieux, discrétion et bienveillance.
                </div>

                <div className="flex justify-start">
                  <Button
                    onClick={scrollToForm}
                    className="bg-[#b46d2f] hover:bg-[#9a5d28] text-white px-8 py-4 text-base font-bold rounded-full shadow-lg shadow-[#b46d2f]/20 transition-all hover:scale-105 active:scale-95 h-auto text-center"
                  >
                    Contactez-nous
                  </Button>
                </div>
              </div>

              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white h-[400px] md:h-[500px]">
                <img src={gardeMaladeHero.src} alt="Garde Malade Hero" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center text-left py-12">
              <div className="space-y-6">
                <p className="text-xl text-[#4a4a4a] leading-relaxed font-bold">
                  Nos auxiliaires de vie assurent une présence 24h/24, 7j/7, selon les besoins en journée, la nuit, ou en continu. Elles interviennent auprès des personnes âgées, des personnes en situation de dépendance, qu'elles en soient venues suite à une hospitalisation ou nécessitant simplement une présence rassurante à domicile.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-80 h-80 rounded-full overflow-hidden border-[12px] border-white shadow-2xl ring-1 ring-[#e2d9c2]">
                  <img src={handsCare.src} alt="Mains soin" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center text-right py-12">
              <div className="flex justify-center md:order-first order-last">
                <div className="w-80 h-80 rounded-[3rem] rotate-6 overflow-hidden border-[12px] border-white shadow-2xl ring-1 ring-[#e2d9c2]">
                  <img src={caregiverVisit.src} alt="Visite soin" className="w-full h-full object-cover -rotate-6 scale-125" />
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-xl text-[#4a4a4a] leading-relaxed font-bold">
                  L'objectif est de garantir un cadre de vie confortable et sécurisant, tout en soutenant la famille au quotidien. Nos garde-malades / auxiliaires de vie veillent notamment à l'hygiène au confort, à l'aide à la mobilité et aux soins du corps, ainsi qu'à l'accompagnement dans les gestes de la vie courante. Elles contribuent également au bien-être moral de la personne aidée en créant un climat serein et une écoute active avec les proches.
                </p>
              </div>
            </div>

            <div className="bg-white/90 p-12 rounded-[3.5rem] shadow-2xl border-4 border-[#b46d2f]/10 max-w-3xl mx-auto relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#b46d2f]" />
              <p className="text-2xl font-black text-[#b46d2f] leading-snug italic mb-4">
                "Avec Agence Ménage, vous bénéficiez d'un service fiable et humain, dans un environnement familial afin de préserver la qualité de vie du patient et d'apporter de la sérénité à toute la famille."
              </p>
              <p className="text-[#8a6d2f] font-bold text-lg">Un assistant social et garde-malade vous rappelleront pour valider les points essentiels.</p>
            </div>

            <div className="pt-12 text-center">
              <Button
                onClick={scrollToForm}
                className="bg-[#b46d2f] hover:bg-[#9a5d28] text-white px-8 py-4 text-xl font-bold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 h-auto uppercase"
              >
                Contactez-nous
              </Button>
            </div>
          </div>
        </section>

        {/* Reservation Form Container - Opens at the end of the page */}
        {showForm && (
          <div
            ref={formRef}
            className="py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both"
          >
            <div className="container max-w-5xl px-6">
              <div className="bg-[#f0e4d4] rounded-lg p-6 text-center mb-8 border border-[#e2d9c2]">
                <h2 className="text-2xl font-bold text-[#b46d2f] mb-2 uppercase tracking-wide">
                  FORMULAIRE DE RESERVATION
                </h2>
              </div>

              <form onSubmit={handleSubmit} noValidate className={`flex flex-col lg:grid lg:grid-cols-3 gap-8 ${wasValidated ? 'was-validated' : ''}`}>
                <div className="lg:col-span-1 lg:order-last sticky-reservation-summary-container">
                  <div className="lg:sticky lg:top-24 space-y-6">
                    <div className="bg-[#b46d2f]/5 rounded-lg border border-[#b46d2f]/20 shadow-sm p-6 space-y-4">
                      <h3 className="text-xl font-bold text-[#b46d2f] border-b border-[#b46d2f]/10 pb-2 text-center">
                        Ma Réservation
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between gap-4 border-b border-[#b46d2f]/5 pb-2">
                          <span className="text-muted-foreground">Service:</span>
                          <span className="font-medium text-right text-slate-700">Garde Malade</span>
                        </div>

                        {/* Detailed info - hidden on mobile when collapsed */}
                        <div className={`space-y-3 ${!isSummaryExpanded ? 'max-lg:hidden' : ''}`}>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Fréquence:</span>
                            <span className="font-medium text-right text-slate-700 text-sm">
                              {getFrequencyLabel(formData.frequency, formData.subFrequency)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Jours:</span>
                            <span className="font-medium text-right text-slate-700">{formData.numberOfDays}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Personnes:</span>
                            <span className="font-medium text-right text-slate-700">{formData.numberOfPeople}</span>
                          </div>
                          <div className="flex justify-between gap-4 border-t border-[#b46d2f]/5 pt-2">
                            <span className="text-muted-foreground">Date début:</span>
                            <span className="font-medium text-right text-slate-700">{formData.schedulingDate || "Non définie"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#b46d2f]/20">
                        <div className="flex justify-between items-center bg-[#b46d2f]/5 p-3 rounded-lg border border-[#b46d2f]/10">
                          <span className="text-xs font-bold text-[#b46d2f] uppercase tracking-wider">
                            Estimation
                          </span>
                          <span className="text-lg font-black text-[#b46d2f]">
                            SUR DEVIS
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Toggle Button for Mobile */}
                    <button
                      type="button"
                      onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                      className="lg:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#b46d2f] text-white flex items-center justify-center shadow-lg border-2 border-white z-20 hover:bg-[#b46d2f]/90 transition-transform active:scale-90"
                    >
                      {isSummaryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-lg p-4 md:p-6 border shadow-sm space-y-10">
                    {/* Frequency Section */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold bg-[#b46d2f] text-white p-3 rounded-lg text-center mb-4 uppercase">
                        Choisissez la fréquence
                      </h3>
                      <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="flex flex-col items-center gap-6">
                          <div className="flex bg-slate-100 p-1 rounded-full w-full max-w-md mx-auto">
                            <button
                              type="button"
                              className={`flex-1 py-3 px-6 rounded-full font-bold transition-all ${formData.frequency === "oneshot"
                                ? "bg-[#b46d2f] text-white shadow-sm"
                                : "text-slate-500 hover:text-[#b46d2f]"
                                }`}
                              onClick={() => setFormData({ ...formData, frequency: "oneshot", subFrequency: "" })}
                            >
                              Une fois
                            </button>
                            <button
                              type="button"
                              className={`flex-1 py-3 px-6 rounded-full font-bold transition-all ${formData.frequency === "subscription"
                                ? "bg-[#b46d2f] text-white shadow-sm"
                                : "text-slate-500 hover:text-[#b46d2f]"
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
                                  <SelectValue placeholder="Sélectionnez une fréquence" />
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

                    {/* People Section */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold bg-[#b46d2f] text-white p-3 rounded-lg text-center mb-4 uppercase">
                        Nombre de personne
                      </h3>
                      <div className="flex items-center justify-center gap-8 p-6 bg-slate-50/50 rounded-xl border border-slate-100">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-slate-200 text-[#b46d2f] hover:bg-slate-300"
                          onClick={decrementPeople}
                        >
                          <span className="text-2xl">-</span>
                        </Button>
                        <span className="text-2xl font-bold text-[#b46d2f] min-w-[40px] text-center">
                          {formData.numberOfPeople}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-slate-200 text-[#b46d2f] hover:bg-slate-300"
                          onClick={incrementPeople}
                        >
                          <span className="text-2xl">+</span>
                        </Button>
                      </div>
                    </div>

                    {/* Planning Section */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold bg-[#b46d2f] text-white p-3 rounded-lg text-center mb-4 uppercase">
                        Planning de la demande
                      </h3>
                      <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-100 space-y-8">
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-600">Heure fixe</Label>
                            <Input
                              type="time"
                              required
                              value={formData.fixedTime}
                              onChange={(e) => setFormData({ ...formData, fixedTime: e.target.value })}
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-600">Je suis flexible</Label>
                            <RadioGroup
                              value={formData.schedulingTime}
                              onValueChange={(value) => setFormData({ ...formData, schedulingTime: value })}
                              className="flex flex-col gap-2 p-2 bg-white rounded-lg border border-slate-200"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="morning" id="garde-morning" className="border-[#b46d2f] text-[#b46d2f]" />
                                <Label htmlFor="garde-morning" className="text-xs font-medium">Matin (09h-12h)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="afternoon" id="garde-afternoon" className="border-[#b46d2f] text-[#b46d2f]" />
                                <Label htmlFor="garde-afternoon" className="text-xs font-medium">Après midi (13h-18h)</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-600">Date</Label>
                            <Input
                              type="date"
                              required
                              value={formData.schedulingDate}
                              onChange={(e) => setFormData({ ...formData, schedulingDate: e.target.value })}
                              className="h-10"
                            />
                          </div>
                        </div>

                        <div className="pt-6 border-t border-dashed border-slate-300 flex flex-col items-center gap-4">
                          <Label className="text-sm font-bold text-slate-600">Nombre de jours</Label>
                          <div className="flex items-center gap-6 bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-slate-100 text-[#b46d2f] hover:bg-slate-200"
                              onClick={decrementDays}
                            >-</Button>
                            <span className="font-bold text-slate-700 uppercase text-sm">
                              {formData.numberOfDays} JOUR(S)
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-slate-100 text-[#b46d2f] hover:bg-slate-200"
                              onClick={incrementDays}
                            >+</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Patient Profile Section */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold bg-[#b46d2f] text-white p-3 rounded-lg text-center mb-4 uppercase">
                        Profil de la personne aidée
                      </h3>
                      <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-100 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-600">Âge :</Label>
                            <div className="relative">
                              <Input
                                placeholder="Âge de la personne"
                                value={formData.patientAge}
                                onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                                className="pr-12"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">ANS</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-600">Sexe :</Label>
                            <RadioGroup
                              value={formData.patientGender}
                              onValueChange={(value) => setFormData({ ...formData, patientGender: value })}
                              className="flex gap-6 pt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="femme" id="patient-femme" className="border-[#b46d2f] text-[#b46d2f]" />
                                <Label htmlFor="patient-femme" className="text-sm font-medium">Femme</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="homme" id="patient-homme" className="border-[#b46d2f] text-[#b46d2f]" />
                                <Label htmlFor="patient-homme" className="text-sm font-medium">Homme</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <Label className="text-sm font-bold text-slate-600">Mobilité et Type :</Label>
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                              <RadioGroup
                                value={formData.mobility}
                                onValueChange={(value) => setFormData({ ...formData, mobility: value })}
                                className="grid grid-cols-1 gap-2"
                              >
                                {["Adulte", "Personne Agée", "Autonome", "Besoin d'aide", "Alité(e)"].map((mob) => (
                                  <div key={mob} className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value={mob}
                                      id={`mob-${mob}`}
                                      className="border-[#b46d2f] text-[#b46d2f]"
                                    />
                                    <Label htmlFor={`mob-${mob}`} className="text-xs font-medium text-slate-700">{mob}</Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          </div>
                          <div className="space-y-4 flex flex-col">
                            <Label className="text-sm font-bold text-slate-600">Pathologie :</Label>
                            <Textarea
                              required
                              value={formData.healthIssues}
                              onChange={(e) => setFormData({ ...formData, healthIssues: e.target.value })}
                              className="flex-1 min-h-[120px] text-sm resize-none"
                              placeholder="Détaillez ici la situation médicale..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold bg-[#b46d2f] text-white p-3 rounded-lg text-center mb-4 uppercase">
                        Autre précision
                      </h3>
                      <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                        <Textarea
                          required
                          value={formData.additionalNotes}
                          onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                          className="min-h-[80px] text-sm resize-none"
                          placeholder="Ex: besoin d'un auxiliaire de vie homme, barrière de langue, régime particulier..."
                        />
                      </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold bg-[#b46d2f] text-white p-3 rounded-lg text-center mb-4 uppercase">
                        Lieu de la garde
                      </h3>
                      <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                        <RadioGroup
                          value={formData.careLocation}
                          onValueChange={(value) => setFormData({ ...formData, careLocation: value })}
                          className="grid grid-cols-3 gap-4"
                        >
                          {["Domicile", "Clinique", "Hôpital"].map((location) => (
                            <div key={location} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer group ${formData.careLocation === location.toLowerCase() ? 'border-[#b46d2f] bg-white' : 'border-transparent bg-white/50 hover:bg-white'}`}>
                              <RadioGroupItem value={location.toLowerCase()} id={`garde-${location}`} className="mb-2 border-[#b46d2f] text-[#b46d2f]" />
                              <Label htmlFor={`garde-${location}`} className="font-bold text-xs text-slate-700 cursor-pointer">{location}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold bg-[#b46d2f] text-white p-3 rounded-lg text-center mb-4 uppercase">
                        Adresse du lieu de la garde
                      </h3>
                      <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-100 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-600">Ville</Label>
                            <Input
                              placeholder="ex: Casablanca"
                              required
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-600">Quartier</Label>
                            <Input
                              placeholder="ex: Maarif"
                              required
                              value={formData.neighborhood}
                              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                              className="h-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-slate-600">Champs de repère</Label>
                          <Textarea
                            placeholder="Donnez-nous des repères visuels proches (Mosquée, École, Pharmacie...)"
                            required
                            value={formData.careAddress}
                            onChange={(e) => setFormData({ ...formData, careAddress: e.target.value })}
                            className="min-h-[60px] text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Personal Info Section */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold bg-[#b46d2f] text-white p-3 rounded-lg text-center mb-4 uppercase">
                        Mes coordonnées
                      </h3>
                      <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-100 space-y-6">
                        <div className="bg-[#b46d2f]/5 p-4 rounded-lg text-center border border-[#b46d2f]/10">
                          <p className="text-[#b46d2f] text-xs font-bold italic">"L'assistant social et garde-malade vous rappelleront pour valider les points essentiels."</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-600">Téléphone*</Label>
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Input
                                  value={formData.phonePrefix}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    phonePrefix: e.target.value,
                                    whatsappPrefix: prev.useWhatsappForPhone ? e.target.value : prev.whatsappPrefix
                                  }))}
                                  className="w-20 font-bold text-[#b46d2f] text-xs text-center"
                                  placeholder="+212"
                                />
                                <Input
                                  placeholder="6 00 00 00 00"
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
                                  className="h-10 flex-1"
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
                                  className="data-[state=checked]:bg-[#b46d2f] border-[#b46d2f]"
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
                            <Label className="text-sm font-bold text-slate-600">WhatsApp*</Label>
                            <div className="flex gap-2">
                              <Input
                                value={formData.whatsappPrefix}
                                onChange={(e) => setFormData({ ...formData, whatsappPrefix: e.target.value })}
                                className="bg-slate-100 border rounded-lg w-20 text-center font-bold text-[#b46d2f] text-xs"
                                placeholder="+212"
                                disabled={formData.useWhatsappForPhone}
                              />
                              <Input
                                placeholder="6 00 00 00 00"
                                value={formData.whatsappNumber}
                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                className="h-10"
                                disabled={formData.useWhatsappForPhone}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-600">Nom*</Label>
                            <Input
                              placeholder="Votre nom"
                              value={formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              required
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-600">Prénom*</Label>
                            <Input
                              placeholder="Votre prénom"
                              value={formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              required
                              className="h-10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center pt-8">
                      <Button
                        type="submit"
                        className="bg-[#b46d2f] hover:bg-[#9a5d28] text-white px-8 py-4 text-base font-bold shadow-lg shadow-[#b46d2f]/20 h-auto rounded-full w-full md:w-auto md:min-w-[260px] transition-all hover:scale-105 active:scale-95"
                      >
                        Demander un devis
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md bg-[#fdf8f1] border-[#b46d2f]/20">
          <DialogHeader>
            <DialogTitle className="text-[#b46d2f] text-2xl font-bold">Confirmation</DialogTitle>
            <DialogDescription className="text-slate-700 text-lg mt-4 leading-relaxed">
              {getConfirmationMessage(`${formData.firstName} ${formData.lastName}`, totalPrice === 0)}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              onClick={() => setShowConfirmation(false)}
              className="bg-[#b46d2f] hover:bg-[#9a5d28] text-white rounded-full px-8"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GardeMalade;
