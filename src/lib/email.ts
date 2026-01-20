import emailjs from '@emailjs/browser';

// These should be configured in your EmailJS dashboard
// and added to your .env file
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID || "service_placeholder";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID || "template_placeholder";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY || "public_key_placeholder";

export const sendBookingEmail = async (serviceName: string, data: any, price: string | number) => {
    if (SERVICE_ID === "service_placeholder" || TEMPLATE_ID === "template_placeholder" || PUBLIC_KEY === "public_key_placeholder") {
        console.warn("EmailJS is not fully configured. Please set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in your .env file.");
        return;
    }

    try {
        const templateParams = {
            service_name: serviceName,
            client_name: `${data.firstName} ${data.lastName}`,
            client_phone: data.phoneNumber,
            client_whatsapp: data.whatsappNumber || "Non spécifié",
            client_email: data.email || "Non spécifié",
            city: data.city,
            neighborhood: data.neighborhood,
            scheduling_date: data.schedulingDate,
            scheduling_time: data.fixedTime || data.schedulingTime,
            total_price: price,
            details: JSON.stringify(data, null, 2),
        };

        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log('Email sent successfully!', response.status, response.text);
        return response;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};
