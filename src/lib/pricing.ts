/**
 * Calculates the surcharge multiplier based on the scheduling date and time.
 * 
 * Rules:
 * - After 6 PM (18h): +50% surcharge (1.5x)
 * - Sunday during the day: +25% surcharge (1.25x)
 * - Sunday after 6 PM (18h): +50% surcharge (1.5x)
 */
export const calculateSurchargeMultiplier = (
    dateStr: string,
    schedulingType: string,
    fixedTime: string,
    schedulingTime: string
): number => {
    if (!dateStr) return 1;

    const date = new Date(dateStr);
    // getDay() returns 0 for Sunday
    const isSunday = date.getDay() === 0;

    let isEvening = false;
    if (schedulingType === "fixed" && fixedTime) {
        const [hours] = fixedTime.split(":").map(Number);
        if (hours >= 18) {
            isEvening = true;
        }
    }
    // Flexible mode (morning/afternoon) is assumed to be during the day.

    if (isEvening) {
        return 1.5;
    }

    if (isSunday) {
        return 1.25;
    }

    return 1;
};