"use client";

import React, { useMemo, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FREQUENCES, visitsMap } from '@/app/frequences';
import { getSubscriptionDiscountRate } from '@/lib/pricing';

export interface JourPassage {
    jour: string; // 'lundi', 'mardi', etc.
    heure_debut: string; // '09:00'
    heure_fin: string; // '13:00'
}

export interface ProrataInfo {
    prorataActive: boolean;
    prorataAmount: number;
    regularAmount: number;
    passagesRestants: number;
    passagesTheoriques: number;
    discountPercent: number;
}

interface SubscriptionSchedulerProps {
    subFrequency: string;
    onFrequencyChange: (value: string, label: string) => void;
    joursPassage: JourPassage[];
    onJoursPassageChange: (jours: JourPassage[]) => void;
    startDate: string;
    onStartDateChange: (date: string) => void;
    durationHours?: number;
    baseMonthlyPrice: number;
    onProrataCalculated?: (info: ProrataInfo) => void;
    isEntreprise?: boolean;
    serviceName?: string;
}

const ALL_DAYS = [
    { key: 'lundi', shortLabel: 'Lun', fullLabel: 'Lundi', jsDay: 1 },
    { key: 'mardi', shortLabel: 'Mar', fullLabel: 'Mardi', jsDay: 2 },
    { key: 'mercredi', shortLabel: 'Mer', fullLabel: 'Mercredi', jsDay: 3 },
    { key: 'jeudi', shortLabel: 'Jeu', fullLabel: 'Jeudi', jsDay: 4 },
    { key: 'vendredi', shortLabel: 'Ven', fullLabel: 'Vendredi', jsDay: 5 },
    { key: 'samedi', shortLabel: 'Sam', fullLabel: 'Samedi', jsDay: 6 },
    { key: 'dimanche', shortLabel: 'Dim', fullLabel: 'Dimanche', jsDay: 0 },
];

export const SubscriptionScheduler: React.FC<SubscriptionSchedulerProps> = ({
    subFrequency,
    onFrequencyChange,
    joursPassage,
    onJoursPassageChange,
    startDate,
    onStartDateChange,
    durationHours = 4,
    baseMonthlyPrice,
    onProrataCalculated,
    isEntreprise = false,
    serviceName
}) => {
    const [showAllFrequencies, setShowAllFrequencies] = React.useState(false);

    // Get max days allowed based on frequency
    const maxDaysAllowed = useMemo(() => {
        if (!subFrequency) return 1;
        if (subFrequency === '1foisParSemaine' || subFrequency === '1foisParMois') return 1;
        if (subFrequency === '2foisParSemaine' || subFrequency === '2foisParMois') return 2;
        if (subFrequency === '3foisParSemaine' || subFrequency === '3foisParMois') return 3;
        if (subFrequency === '4foisParSemaine' || subFrequency === '4foisParMois') return 4;
        if (subFrequency === '5foisParSemaine') return 5;
        if (subFrequency === '6foisParSemaine') return 6;
        if (subFrequency === '7foisParSemaine') return 7;
        return 1;
    }, [subFrequency]);

    // Format default end time from start time and duration
    const calculateEndTime = (startTime: string, hours: number) => {
        if (!startTime) return '13:00';
        const [h, m] = startTime.split(':').map(Number);
        const endHour = Math.min(22, (h || 9) + (hours || 4));
        return `${String(endHour).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
    };

    // Toggle day selection
    const handleToggleDay = (dayKey: string) => {
        const existing = joursPassage.find(j => j.jour === dayKey);
        if (existing) {
            // Remove day
            const updated = joursPassage.filter(j => j.jour !== dayKey);
            onJoursPassageChange(updated);
        } else {
            // Add day if under max limit
            if (joursPassage.length >= maxDaysAllowed) {
                // If max reached and limit is 1, replace
                if (maxDaysAllowed === 1) {
                    onJoursPassageChange([{
                        jour: dayKey,
                        heure_debut: '09:00',
                        heure_fin: calculateEndTime('09:00', durationHours)
                    }]);
                    return;
                }
                return;
            }
            onJoursPassageChange([
                ...joursPassage,
                {
                    jour: dayKey,
                    heure_debut: '09:00',
                    heure_fin: calculateEndTime('09:00', durationHours)
                }
            ]);
        }
    };

    // Update time slot for a specific day
    const handleUpdateTime = (dayKey: string, field: 'heure_debut' | 'heure_fin', value: string) => {
        const updated = joursPassage.map(j => {
            if (j.jour === dayKey) {
                const next = { ...j, [field]: value };
                if (field === 'heure_debut') {
                    next.heure_fin = calculateEndTime(value, durationHours);
                }
                return next;
            }
            return j;
        });
        onJoursPassageChange(updated);
    };

    // Auto-adjust selected days if frequency changed to a lower count
    useEffect(() => {
        if (joursPassage.length > maxDaysAllowed) {
            onJoursPassageChange(joursPassage.slice(0, maxDaysAllowed));
        } else if (joursPassage.length === 0 && subFrequency) {
            // Pick default first day (e.g. Lundi)
            onJoursPassageChange([{
                jour: 'lundi',
                heure_debut: '09:00',
                heure_fin: calculateEndTime('09:00', durationHours)
            }]);
        }
    }, [maxDaysAllowed, subFrequency]);

    const currentDiscountPercent = useMemo(() => {
        const rate = getSubscriptionDiscountRate(
            subFrequency,
            serviceName || (isEntreprise ? 'menage-bureaux' : undefined),
            durationHours
        );
        return Math.round(rate * 100);
    }, [subFrequency, serviceName, isEntreprise, durationHours]);

    // Prorata calculation
    const prorataCalculation = useMemo(() => {
        if (!startDate || joursPassage.length === 0 || baseMonthlyPrice <= 0) {
            return {
                prorataActive: false,
                prorataAmount: baseMonthlyPrice,
                regularAmount: baseMonthlyPrice,
                passagesRestants: 0,
                passagesTheoriques: 0,
                discountPercent: currentDiscountPercent
            };
        }

        try {
            const startD = new Date(startDate.includes('T') ? startDate : `${startDate}T00:00:00`);
            if (isNaN(startD.getTime())) {
                return {
                    prorataActive: false,
                    prorataAmount: baseMonthlyPrice,
                    regularAmount: baseMonthlyPrice,
                    passagesRestants: 0,
                    passagesTheoriques: 0,
                    discountPercent: currentDiscountPercent
                };
            }

            // JS day numbers for selected days
            const selectedJsDays = new Set(
                joursPassage.map(j => {
                    const found = ALL_DAYS.find(d => d.key === j.jour);
                    return found ? found.jsDay : -1;
                }).filter(d => d !== -1)
            );

            if (selectedJsDays.size === 0) {
                return {
                    prorataActive: false,
                    prorataAmount: baseMonthlyPrice,
                    regularAmount: baseMonthlyPrice,
                    passagesRestants: 0,
                    passagesTheoriques: 0,
                    discountPercent: currentDiscountPercent
                };
            }

            // Étape 1 : Trouver la 1ère intervention réelle (premier jour sélectionné >= startDate)
            const startYear = startD.getFullYear();
            const startMonth = startD.getMonth();
            const startDay = startD.getDate();

            let firstIntervYear = startYear;
            let firstIntervMonth = startMonth;
            let firstIntervDay = startDay;

            for (let offset = 0; offset <= 31; offset++) {
                const candidate = new Date(startYear, startMonth, startDay + offset);
                if (selectedJsDays.has(candidate.getDay())) {
                    firstIntervYear = candidate.getFullYear();
                    firstIntervMonth = candidate.getMonth();
                    firstIntervDay = candidate.getDate();
                    break;
                }
            }

            // Étape 2 : Scanner le mois de la première intervention réelle
            const year = firstIntervYear;
            const month = firstIntervMonth;
            const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

            let totalTheoriques = 0;
            let totalRestants = 0;

            for (let day = 1; day <= lastDayOfMonth; day++) {
                const curDate = new Date(year, month, day);
                const jsDay = curDate.getDay();
                if (selectedJsDays.has(jsDay)) {
                    totalTheoriques++;
                    if (day >= firstIntervDay) {
                        totalRestants++;
                    }
                }
            }

            if (totalTheoriques === 0) {
                return {
                    prorataActive: false,
                    prorataAmount: baseMonthlyPrice,
                    regularAmount: baseMonthlyPrice,
                    passagesRestants: 0,
                    passagesTheoriques: 0,
                    discountPercent: currentDiscountPercent
                };
            }

            const isProrata = totalRestants < totalTheoriques;
            const ratio = totalRestants / totalTheoriques;
            const prorataAmount = isProrata ? Math.round(baseMonthlyPrice * ratio) : baseMonthlyPrice;

            return {
                prorataActive: isProrata,
                prorataAmount,
                regularAmount: baseMonthlyPrice,
                passagesRestants: totalRestants,
                passagesTheoriques: totalTheoriques,
                discountPercent: currentDiscountPercent
            };
        } catch (e) {
            console.error('Error calculating prorata:', e);
            return {
                prorataActive: false,
                prorataAmount: baseMonthlyPrice,
                regularAmount: baseMonthlyPrice,
                passagesRestants: 0,
                passagesTheoriques: 0,
                discountPercent: currentDiscountPercent
            };
        }
    }, [startDate, joursPassage, baseMonthlyPrice, currentDiscountPercent]);

    // Notify parent on prorata calculation change
    useEffect(() => {
        if (onProrataCalculated) {
            onProrataCalculated(prorataCalculation);
        }
    }, [prorataCalculation, onProrataCalculated]);

    // Minimum start date is today (local time)
    const minDateStr = useMemo(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, []);

    // Set default start date to today if not provided
    useEffect(() => {
        if (!startDate && minDateStr) {
            onStartDateChange(minDateStr);
        }
    }, [startDate, minDateStr, onStartDateChange]);

    const primaryFrequencies = [
        { value: "1foisParSemaine", label: "1 fois / semaine", desc: "4 passages / mois" },
        { value: "2foisParSemaine", label: "2 fois / semaine", desc: "8 passages / mois" },
        { value: "3foisParSemaine", label: "3 fois / semaine", desc: "12 passages / mois" },
        { value: "4foisParSemaine", label: "4 fois / semaine", desc: "16 passages / mois" },
        { value: "5foisParSemaine", label: "5 fois / semaine", desc: "20 passages / mois" },
    ];

    const extraFrequencies = [
        { value: "6foisParSemaine", label: "6 fois / semaine", desc: "24 passages / mois" },
        { value: "7foisParSemaine", label: "7 fois / semaine (Tous les jours)", desc: "28-31 passages / mois" },
        { value: "1foisParMois", label: "1 fois / mois", desc: "1 passage ponctuel récurrent" },
        { value: "2foisParMois", label: "2 fois / mois (Tous les 15j)", desc: "2 passages / mois" },
    ];

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* 1. Fréquence d'intervention */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-800 flex items-center justify-between w-full">
                        <span>1. Choisissez la fréquence de passage</span>
                        {currentDiscountPercent > 0 ? (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                -{currentDiscountPercent}% de remise
                            </span>
                        ) : (
                            ((serviceName && (serviceName.toLowerCase().includes('bureau') || serviceName.toLowerCase().includes('bureaux'))) || isEntreprise) && durationHours < 4 ? (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                    Réduction -10% dès 4h de ménage
                                </span>
                            ) : (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                    Tarif standard
                                </span>
                            )
                        )}
                    </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {primaryFrequencies.map((freq) => {
                        const isSelected = subFrequency === freq.value;
                        const discountRate = getSubscriptionDiscountRate(
                            freq.value,
                            serviceName || (isEntreprise ? 'menage-bureaux' : undefined),
                            durationHours
                        );
                        const discountPct = Math.round(discountRate * 100);
                        return (
                            <button
                                key={freq.value}
                                type="button"
                                onClick={() => onFrequencyChange(freq.value, freq.label)}
                                className={`relative p-3 rounded-xl text-center border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                                    isSelected
                                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm ring-2 ring-primary/20'
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-medium'
                                }`}
                            >
                                {discountPct > 0 && (
                                    <span className="absolute -top-2 -right-1 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                                        -{discountPct}%
                                    </span>
                                )}
                                <span className="text-xs sm:text-sm">{freq.label}</span>
                                <span className="text-[11px] text-slate-400 font-normal">{freq.desc}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Toggle extra frequencies */}
                <div className="text-center pt-1">
                    <button
                        type="button"
                        onClick={() => setShowAllFrequencies(!showAllFrequencies)}
                        className="text-xs font-semibold text-slate-500 hover:text-primary inline-flex items-center gap-1 transition-colors"
                    >
                        {showAllFrequencies ? (
                            <>Moins d'options de fréquence <ChevronUp size={14} /></>
                        ) : (
                            <>Autres fréquences (mensuel, 6j/7...) <ChevronDown size={14} /></>
                        )}
                    </button>
                </div>

                {showAllFrequencies && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 animate-in fade-in duration-200">
                        {extraFrequencies.map((freq) => {
                            const isSelected = subFrequency === freq.value;
                            const discountRate = getSubscriptionDiscountRate(
                                freq.value,
                                serviceName || (isEntreprise ? 'menage-bureaux' : undefined),
                                durationHours
                            );
                            const discountPct = Math.round(discountRate * 100);
                            return (
                                <button
                                    key={freq.value}
                                    type="button"
                                    onClick={() => onFrequencyChange(freq.value, freq.label)}
                                    className={`relative p-2.5 rounded-xl text-center border transition-all ${
                                        isSelected
                                            ? 'border-primary bg-primary/5 text-primary font-bold ring-2 ring-primary/20'
                                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    {discountPct > 0 && (
                                        <span className="absolute -top-2 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                                            -{discountPct}%
                                        </span>
                                    )}
                                    <div className="text-xs font-bold">{freq.label}</div>
                                    <div className="text-[10px] text-slate-400">{freq.desc}</div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 2. Sélection des jours de passage */}
            <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span>2. Jours de passage dans la semaine</span>
                    </label>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        {joursPassage.length}/{maxDaysAllowed} jour{maxDaysAllowed > 1 ? 's' : ''} sélectionné{joursPassage.length > 1 ? 's' : ''}
                    </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
                    {ALL_DAYS.map((day) => {
                        const isSelected = joursPassage.some(j => j.jour === day.key);
                        const isDisabled = !isSelected && joursPassage.length >= maxDaysAllowed;

                        return (
                            <button
                                key={day.key}
                                type="button"
                                onClick={() => handleToggleDay(day.key)}
                                disabled={isDisabled}
                                className={`py-3 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                                    isSelected
                                        ? 'bg-primary text-white font-bold shadow-sm ring-2 ring-primary/30 transform scale-[1.02]'
                                        : isDisabled
                                        ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed opacity-60'
                                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary font-semibold'
                                }`}
                            >
                                <span className="text-xs sm:text-sm uppercase tracking-wide">{day.shortLabel}</span>
                                <span className="text-[10px] opacity-80 hidden sm:inline">{day.fullLabel}</span>
                            </button>
                        );
                    })}
                </div>

                {joursPassage.length < maxDaysAllowed && (
                    <p className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>Veuillez sélectionner encore {maxDaysAllowed - joursPassage.length} jour{maxDaysAllowed - joursPassage.length > 1 ? 's' : ''} pour compléter votre formule.</span>
                    </p>
                )}

                {/* Créneaux horaires par jour sélectionné */}
                {joursPassage.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Clock size={14} className="text-primary" />
                                <span>Horaires de passage par jour ({durationHours}h / séance)</span>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {joursPassage.map((item) => {
                                const dayObj = ALL_DAYS.find(d => d.key === item.jour);
                                const isMatin = item.heure_debut === '09:00';
                                const isApresMidi = item.heure_debut === '14:00';

                                return (
                                    <div
                                        key={item.jour}
                                        className="p-3 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
                                    >
                                        {/* Day Name and icon */}
                                        <div className="flex items-center gap-2.5 min-w-[120px]">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                {dayObj?.shortLabel || item.jour.slice(0, 3)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm capitalize">
                                                    {dayObj?.fullLabel || item.jour}
                                                </div>
                                                <div className="text-[11px] text-slate-400 font-normal">
                                                    Séance de {durationHours} heures
                                                </div>
                                            </div>
                                        </div>

                                        {/* Options & Time Picker */}
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            {/* Quick preset buttons */}
                                            <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateTime(item.jour, 'heure_debut', '09:00')}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                                        isMatin
                                                            ? 'bg-primary text-white shadow-xs'
                                                            : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                                                    }`}
                                                >
                                                    Matin (09:00)
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateTime(item.jour, 'heure_debut', '14:00')}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                                        isApresMidi
                                                            ? 'bg-primary text-white shadow-xs'
                                                            : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                                                    }`}
                                                >
                                                    Après-midi (14:00)
                                                </button>
                                            </div>

                                            {/* Custom Time Selector & Interval display */}
                                            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
                                                <span className="text-xs text-slate-400 font-medium">De</span>
                                                <input
                                                    type="time"
                                                    value={item.heure_debut}
                                                    onChange={(e) => handleUpdateTime(item.jour, 'heure_debut', e.target.value)}
                                                    className="text-xs font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer w-14 text-center"
                                                />
                                                <span className="text-xs text-slate-400 font-medium">à</span>
                                                <span className="text-xs font-bold text-primary px-1.5 py-0.5 bg-primary/5 rounded">
                                                    {item.heure_fin}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Date de réservation */}
            <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span>3. Date de réservation</span>
                    </label>
                </div>

                <div className="max-w-md">
                    <input
                        type="date"
                        required
                        min={minDateStr}
                        value={startDate || minDateStr}
                        onChange={(e) => onStartDateChange(e.target.value)}
                        className="w-full h-12 px-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 font-bold text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                    <p className="text-[11px] text-slate-500 mt-1.5">
                        Votre abonnement démarre le jour de votre réservation et se renouvelle chaque mois.
                    </p>
                </div>
            </div>
        </div>
    );
};
