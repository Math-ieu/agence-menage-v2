export const DESTINATION_PHONE_NUMBER = "+212664331463";
export const CUSTOMER_SERVICE_NUMBERS = ["0664331463", "0664226790"];

export const createWhatsAppLink = (phoneNumber: string, message: string): string => {
    const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
};

export const getConfirmationMessage = (clientName: string, isDevis: boolean): string => {
    if (isDevis) {
        return `Bonjour ${clientName}, Nous confirmons la bonne réception de votre réservation. Un conseiller clientèle vous contactera dans les plus brefs délais pour la validation de la demande et la transmission du devis correspondant. Cordialement`;
    }
    return `Bonjour ${clientName}, Merci pour votre réservation, elle a bien été reçue. Notre équipe vous contactera très bientôt pour confirmer les détails. Cordialement`;
};

export const formatBookingMessage = (serviceName: string, data: any, price: number | string, isEntreprise: boolean = false): string => {
    const sectionTitle = isEntreprise ? "SERVICES POUR ENTREPRISE" : "SERVICES POUR PARTICULIER";
    const priceLabel = typeof price === "string" && price.toUpperCase().includes("DEVIS") ? "Sur DEVIS" : `${price} MAD`;

    const details: string[] = [];

    // Client Info
    details.push(`*Nom & prénom :* ${data.firstName} ${data.lastName}`);
    details.push(`*Numéro de téléphone :* ${data.phoneNumber}`);
    if (data.whatsappNumber) details.push(`*Numéro whatsapp :* ${data.whatsappNumber}`);
    if (data.email) details.push(`*Email :* ${data.email}`);
    if (data.entityName) details.push(`*Entreprise :* ${data.entityName}`);
    if (data.contactPerson && data.contactPerson !== `${data.firstName} ${data.lastName}`) details.push(`*Contact :* ${data.contactPerson}`);
    details.push("");

    // Service Core
    details.push(`*Service :* ${serviceName}`);
    if (data.serviceType) details.push(`*Offre :* ${data.serviceType}`);
    if (data.structureType) details.push(`*Structure :* ${data.structureType}`);
    if (data.propertyType) details.push(`*Type de bien :* ${data.propertyType}`);
    details.push(`*Fréquence :* ${data.frequency === "oneshot" ? "Une fois" : `Abonnement ( ${data.frequencyLabel || data.subFrequency || ""} )`}`);

    // Prestation Details
    if (data.recommendedDuration && data.recommendedDuration > 0) details.push(`*Durée recommandée :* ${data.recommendedDuration}h`);
    if (data.duration && data.duration !== "-") details.push(`*Durée choisie :* ${data.duration}h`);
    if (data.numberOfPeople) details.push(`*Nbre de personne :* ${data.numberOfPeople}`);
    if (data.rooms) {
        const roomDetails = Object.entries(data.rooms)
            .filter(([_, count]) => (count as number) > 0)
            .map(([room, count]) => `${count} ${room}`)
            .join(", ");
        if (roomDetails) details.push(`*Pièces :* ${roomDetails}`);
    }

    // Options
    const options = [];
    if (data.additionalServices?.produitsEtOutils) options.push("Produits et outils (+90 MAD)");
    if (data.additionalServices?.torchonsEtSerpierres) options.push("Torchons et serpillères (+40 MAD)");
    if (data.additionalServices?.nettoyageTerrasse) options.push("Nettoyage Terrasse (+500 MAD)");
    if (data.additionalServices?.baiesVitrees) options.push("Baies Vitrées (Sur devis)");
    if (data.intensiveOption || data.cleanlinessType === "intensif") options.push("Option Intensif");
    if (options.length > 0) details.push(`*Services optionnels :* ${options.join(", ")}`);

    // Surface
    const surface = data.officeSurface || data.surfaceArea || data.surface;
    if (surface) details.push(`*Surface :* ${surface} m2`);

    // Service Specific Details
    if (serviceName === "Nettoyage d'urgence") {
        const natureLabels: Record<string, string> = {
            'sinistre': 'Nettoyage après sinistre',
            'event': 'Nettoyage post/après évènement',
            'express': 'Remise en état express',
            'autre': 'Autre situation urgente (à préciser)'
        };
        const nature = natureLabels[data.interventionNature] || data.interventionNature;
        if (nature) details.push(`*Nature :* ${nature}`);
    }

    if (serviceName === "Ménage post-déménagement") {
        if (data.accommodationState) details.push(`*État du logement :* ${data.accommodationState}`);
        if (data.cleanlinessType) details.push(`*Salissure :* ${data.cleanlinessType}`);
    }

    if (serviceName.toLowerCase().includes("garde malade")) {
        if (data.patientAge || data.patientGender) details.push(`*Patient :* ${data.patientGender || ""}${data.patientGender && data.patientAge ? ", " : ""}${data.patientAge ? data.patientAge + " ans" : ""}`);
        if (data.mobility) details.push(`*Mobilité :* ${data.mobility}`);
        if (data.healthIssues) details.push(`*Pathologie :* ${data.healthIssues}`);
        if (data.careLocation) details.push(`*Lieu de garde :* ${data.careLocation}`);
    }

    details.push("");

    // Planning
    if (data.schedulingDate) details.push(`*Date :* ${data.schedulingDate}`);
    const schedTime = data.schedulingType === 'fixed' || !data.schedulingType ? data.fixedTime : (data.schedulingTime === 'morning' ? 'Le matin' : data.schedulingTime === 'afternoon' ? "L'après midi" : data.schedulingTime);
    if (schedTime) details.push(`*Heure :* ${schedTime}`);
    if (data.city) details.push(`*Ville :* ${data.city}`);
    if (data.neighborhood) details.push(`*Quartier :* ${data.neighborhood}`);

    // Notes
    const notes = data.changeRepereNotes || data.careAddress || data.additionalNotes || data.notes;
    // For Garde Malade, healthIssues is already handled above, so we don't need to check it here if it's already in notes
    if (notes && notes !== data.healthIssues) {
        details.push("");
        details.push(`*Notes et précisions :*`);
        details.push(notes);
    }

    return `*RESERVATION*
*${sectionTitle}*

${details.join("\n")}
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
