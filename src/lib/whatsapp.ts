export const DESTINATION_PHONE_NUMBER = "+212664331463";
export const CUSTOMER_SERVICE_NUMBERS = ["0664331463", "0664226790"];

export const createWhatsAppLink = (phoneNumber: string, message: string): string => {
    const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
};

export const getConfirmationMessage = (clientName: string, isDevis: boolean): string => {
    const numbers = CUSTOMER_SERVICE_NUMBERS.join(" / ");
    if (isDevis) {
        return `Bonjour ${clientName}, Nous confirmons la bonne réception de votre réservation. Un conseiller clientèle vous contactera dans les plus brefs délais pour la validation de la demande et la transmission du devis correspondant. Pour toute question, contactez-nous au ${numbers}. Cordialement`;
    }
    return `Bonjour ${clientName}, Merci pour votre réservation Elle a bien été reçue. Notre équipe vous contactera très bientôt pour confirmer les détails. Vous pouvez nous joindre au ${numbers}. Cordialement.`;
};

export const formatBookingMessage = (serviceName: string, data: any, price: number | string, isEntreprise: boolean = false): string => {
    const sectionTitle = isEntreprise ? "SERVICES POUR ENTREPRISE" : "SERVICES POUR PARTICULIER";
    const priceLabel = typeof price === "string" && price.toUpperCase().includes("DEVIS") ? "Sur DEVIS" : `${price} DH`;

    let serviceSpecificDetails = "";

    if (serviceName === "Ménage Bureaux") {
        serviceSpecificDetails = `*Surface en m2 :* ${data.officeSurface || "-"} m2
*Durée :* ${data.duration || "-"} heures`;
    } else if (serviceName === "Garde Malade") {
        serviceSpecificDetails = `*Patient :* ${data.patientGender || "-"}, ${data.patientAge || "-"} ans
*Mobilité :* ${data.mobility || "-"}
*Lieu :* ${data.careLocation || "-"}
*Durée :* ${data.duration || "-"} heures`;
    } else {
        serviceSpecificDetails = `*Durée :* ${data.duration || "-"} heures
*Nbre de personne :* ${data.numberOfPeople || "-"}`;
    }

    return `*RESERVATION*
*${sectionTitle}*

*Ma Réservation*
--------------------------------
*Nom & prénom :* ${data.firstName} ${data.lastName}
*Numéro de téléphone :* ${data.phoneNumber}
*Numéro whatsapp :* ${data.whatsappNumber || "-"}

*Service :* ${serviceName}
*Fréquence :* ${data.frequency || "-"}
${serviceSpecificDetails}
*Service optionel :* -

*Date :* ${data.schedulingDate || "Non définie"}
*Heure :* ${data.fixedTime || data.schedulingTime || "14:00"}
--------------------------------
*Total :* *${priceLabel}*`;
};

export const formatCandidateMessage = (data: any): string => {
    return `*Nouvelle Candidature - Espace Employé*

*Nom:* ${data.lastName}
*Prénom:* ${data.firstName}
*Téléphone:* ${data.phoneNumber}
*WhatsApp:* ${data.whatsappNumber || "Non spécifié"}

*Poste:* ${data.position}
*Expérience:* ${data.experience}
*Langues:* ${data.languages.join(", ")}
*Nationalité:* ${data.nationality}

*Ville:* ${data.city}
*Quartier:* ${data.neighborhood}

--------------------------------
Envoyé depuis l'Espace Employé.`;
};

export const formatContactMessage = (data: any): string => {
    return `*Nouveau Message - Contact*

*Nom:* ${data.name}
*Email:* ${data.email}
*Téléphone:* ${data.phoneNumber}
*WhatsApp:* ${data.whatsappNumber || "Non spécifié"}

*Message:*
${data.message}

--------------------------------
Envoyé depuis la page Contact.`;
};
