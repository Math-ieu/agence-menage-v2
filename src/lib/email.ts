import emailjs from '@emailjs/browser';

// These should be configured in your EmailJS dashboard
// and added to your .env file
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID || "service_placeholder";
const TEMPLATE_ID_PARTICULIER = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_PARTICULIER || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_placeholder";
const TEMPLATE_ID_ENTREPRISE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ENTREPRISE || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_placeholder";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY || "public_key_placeholder";

export const sendBookingEmail = async (serviceName: string, data: any, price: string | number, isEntreprise: boolean = false) => {
    const templateId = isEntreprise ? TEMPLATE_ID_ENTREPRISE : TEMPLATE_ID_PARTICULIER;

    if (SERVICE_ID === "service_placeholder" || templateId === "template_placeholder" || PUBLIC_KEY === "public_key_placeholder") {
        console.warn("EmailJS is not fully configured. Please set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_PARTICULIER, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ENTREPRISE, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in your .env file.");
        return;
    }

    try {
        const optionalServices = [];
        if (data.additionalServices?.produitsEtOutils) {
            optionalServices.push(serviceName === "Ménage Standard" ? "Produits et outils (+90 MAD)" :
                serviceName === "Nettoyage d'urgence" ? "Produits fournis (+50 MAD)" : "Produits et outils");
        }
        if (data.additionalServices?.torchonsEtSerpierres) {
            optionalServices.push(serviceName === "Ménage Standard" || serviceName === "Nettoyage d'urgence" ? "Torchons et serpillères (+20 MAD)" : "Torchons et serpillères");
        }
        if (data.additionalServices?.nettoyageTerrasse) {
            optionalServices.push("Nettoyage Terrasse (+500 MAD)");
        }
        if (data.additionalServices?.baiesVitrees) {
            optionalServices.push("Baies Vitrées (Sur devis)");
        }
        if (data.intensiveOption || data.cleanlinessType === "intensif") optionalServices.push("Option Intensif");

        const surfaceValue = data.officeSurface || data.surfaceArea || data.surface || "";
        const formattedSurface = surfaceValue ? `${surfaceValue} m²` : "";

        let natureLabel = "-";
        if (serviceName === "Nettoyage d'urgence") {
            const natureLabels: Record<string, string> = {
                'sinistre': 'Nettoyage après sinistre',
                'event': 'Nettoyage post/après évènement',
                'express': 'Remise en état express',
                'autre': 'Autre situation urgente (à préciser)'
            };
            natureLabel = natureLabels[data.interventionNature] || data.interventionNature || "-";
        }

        if (serviceName === "Ménage post-déménagement") {
            natureLabel = `État: ${data.accommodationState || "-"}, Salissure: ${data.cleanlinessType || "-"}`;
        }

        const templateParams = {
            is_entreprise: isEntreprise,
            service_name: serviceName,
            client_name: isEntreprise ? (data.contactPerson || data.entityName) : `${data.firstName} ${data.lastName}`,
            client_phone: data.phoneNumber,
            client_whatsapp: data.whatsappNumber || "Non spécifié",
            client_email: data.email || "Non spécifié",
            frequency: data.frequency === "oneshot" ? "Une fois" : `Abonnement ( ${data.frequencyLabel || data.subFrequency || ""} )`,
            surface: formattedSurface,
            recommended_duration: data.recommendedDuration && data.recommendedDuration > 0 ? `${data.recommendedDuration}h` : "-",
            duration: data.duration ? `${data.duration}h` : "-",
            people_count: data.numberOfPeople || "-",
            optional_services: optionalServices.length > 0 ? optionalServices.join(", ") : "-",
            city: data.city,
            neighborhood: data.neighborhood,
            property_type: data.propertyType || "-",
            intervention_nature: natureLabel,
            scheduling_date: data.schedulingDate,
            scheduling_time: data.fixedTime || data.schedulingTime || "14:00",
            total_price: typeof price === "number" ? `${price} MAD` : price,
            notes: data.changeRepereNotes || data.careAddress || data.additionalNotes || data.notes || "-",
            details: JSON.stringify(data, null, 2),
        };

        const response = await emailjs.send(SERVICE_ID, templateId, templateParams, PUBLIC_KEY);
        console.log('Email sent successfully!', response.status, response.text);
        return response;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};
