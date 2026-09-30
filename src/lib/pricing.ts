export interface SurchargeDetails {
    multiplier: number;
    isEvening: boolean;
    isSunday: boolean;
    surchargePercent: number;
    label: string | null;
    description: string | null;
}

/**
 * Calculates the surcharge details based on the scheduling date and time.
 * 
 * Rules:
 * - After 6 PM (18h): +50% surcharge (1.5x)
 */
export const getSurchargeDetails = (
    dateStr: string,
    schedulingType: string,
    fixedTime: string,
    schedulingTime: string
): SurchargeDetails => {
    let isSunday = false;
    if (dateStr) {
        // Parse date parts directly to avoid UTC day shifts in local timezones
        const parts = dateStr.split("-").map(Number);
        if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
            const date = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
            isSunday = date.getDay() === 0;
        } else {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                isSunday = date.getDay() === 0;
            }
        }
    }

    let isEvening = false;
    if (schedulingType === "fixed" && fixedTime) {
        const [hours] = fixedTime.split(":").map(Number);
        if (!isNaN(hours) && hours >= 18) {
            isEvening = true;
        }
    }

    if (isEvening) {
        return {
            multiplier: 1.5,
            isEvening: true,
            isSunday,
            surchargePercent: 50,
            label: "Majoration soirée (+50%)",
            description: "Intervention à partir de 18h00"
        };
    }

    return {
        multiplier: 1,
        isEvening: false,
        isSunday: false,
        surchargePercent: 0,
        label: null,
        description: null
    };
};

export const calculateSurchargeMultiplier = (
    dateStr: string,
    schedulingType: string,
    fixedTime: string,
    schedulingTime: string
): number => {
    return getSurchargeDetails(dateStr, schedulingType, fixedTime, schedulingTime).multiplier;
};

/**
 * Returns the subscription discount rate for any service based on frequency, service and duration.
 *
 * Universal Grid:
 * - 1 fois par semaine : 10%
 * - 2 fois par semaine : 15%
 * - 3 fois par semaine : 15%
 * - 4 fois par semaine : 20%
 * - 5 fois par semaine : 20%
 * - 6 fois par semaine : 25%
 * - 7 fois par semaine : 25%
 * - 1 fois par mois : 10%
 * - 2 fois par mois : 10%
 *
 * Special rule for Ménage Bureaux:
 * - Only the 10% discount is subject to the restriction (< 4h => 0%).
 * - The 10% discount is applied starting from 4 hours of cleaning.
 * - Higher discounts (15%, 20%, 25%) are applied normally.
 */
export const getSubscriptionDiscountRate = (
    subFrequency: string,
    service?: string,
    duration?: number
): number => {
    if (!subFrequency) return 0;

    const val = subFrequency.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');

    let rate = 0;

    // Mensuel (1x/mois, 2x/mois, 3x/mois, 4x/mois) => 10%
    if (val.includes('mois') || val.includes('mensuel')) {
        rate = 0.10;
    } else if (val.includes('6fois') || val.includes('6/sem') || val.includes('7fois') || val.includes('7/sem')) {
        // 6 or 7 fois par semaine => 25%
        rate = 0.25;
    } else if (val.includes('4fois') || val.includes('4/sem') || val.includes('5fois') || val.includes('5/sem')) {
        // 4 or 5 fois par semaine => 20%
        rate = 0.20;
    } else if (val.includes('2fois') || val.includes('2/sem') || val.includes('3fois') || val.includes('3/sem')) {
        // 2 or 3 fois par semaine => 15%
        rate = 0.15;
    } else if (val.includes('1fois') || val.includes('1/sem') || val.includes('hebdo')) {
        // 1 fois par semaine => 10%
        rate = 0.10;
    }

    // Règle spécifique Ménage bureau : seule la réduction de 10% nécessite au moins 4h de ménage (non appliquée si < 4h)
    const isBureau = service && (
        service.toLowerCase().includes('bureau') ||
        service.toLowerCase().includes('bureaux')
    );

    if (isBureau && rate === 0.10 && duration !== undefined && duration < 4) {
        return 0;
    }

    return rate;
};

/**
 * Backward compatibility alias for entreprise services.
 */
export const getEntrepriseSubscriptionDiscountRate = (
    subFrequency: string,
    duration?: number
): number => {
    return getSubscriptionDiscountRate(subFrequency, 'menage-bureaux', duration);
};

/**
 * Calculates VAT (TVA 20%) and total TTC from an HT amount.
 */
export const calculateTvaAndTotals = (amountHT: number, tvaRate: number = 0.20) => {
    const totalHT = Math.round(amountHT);
    const tvaAmount = Math.round(totalHT * tvaRate);
    const totalTTC = totalHT + tvaAmount;
    return {
        totalHT,
        tvaAmount,
        totalTTC,
        tvaRate
    };
};