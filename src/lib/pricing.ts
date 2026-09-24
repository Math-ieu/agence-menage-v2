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
 * - Sunday during the day: +25% surcharge (1.25x)
 * - Sunday after 6 PM (18h): +50% surcharge (1.5x)
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

    if (isSunday) {
        return {
            multiplier: 1.25,
            isEvening: false,
            isSunday: true,
            surchargePercent: 25,
            label: "Majoration dimanche (+25%)",
            description: "Intervention le dimanche"
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