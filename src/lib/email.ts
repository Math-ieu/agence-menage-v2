import { sendBookingEmailResend } from "@/app/actions";

export const sendBookingEmail = async (serviceName: string, data: any, price: string | number, isEntreprise: boolean = false) => {
    try {
        return await sendBookingEmailResend(serviceName, data, price, isEntreprise);
    } catch (error) {
        console.error('Failed to send email via Resend:', error);
        throw error;
    }
};
