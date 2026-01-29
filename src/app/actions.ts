"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: {
  name: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  message: string;
}) {
  try {
    // Note: If you have a verified domain on Resend, change 'onboarding@resend.dev' to your domain email
    const { data, error } = await resend.emails.send({
      from: 'Agence Ménage <onboarding@resend.dev>',
      to: ['notification@agencemenage.ma'], // Replace with actual recipient email
      subject: `Nouveau message de contact: ${formData.name}`,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; color: #333;">
  <div style="text-align: center; border-bottom: 2px solid #edba54; padding-bottom: 10px; margin-bottom: 20px;">
    <h2 style="color: #edba54; margin: 0;">
      CONTACT
    </h2>
    <h3 style="color: #edba54; margin: 0;">
      MESSAGE DEPUIS LE SITE
    </h3>
  </div>
  <div style="margin-bottom: 20px;">
    <h3 style="color: #175e5c; border-left: 4px solid #175e5c; padding-left: 10px; margin-bottom: 10px;">Informations Client</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 5px 0; width: 40%;"><strong>Nom:</strong></td><td>${formData.name}</td></tr>
      <tr><td style="padding: 5px 0;"><strong>Téléphone:</strong></td><td>${formData.phoneNumber}</td></tr>
      <tr><td style="padding: 5px 0;"><strong>WhatsApp:</strong></td><td>${formData.whatsappNumber || "Non spécifié"}</td></tr>
      <tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td>${formData.email || "Non spécifié"}</td></tr>
    </table>
  </div>
  <div style="margin-bottom: 20px;">
    <h3 style="color: #175e5c; border-left: 4px solid #175e5c; padding-left: 10px; margin-bottom: 10px;">Message</h3>
    <p style="background: #f9f9f9; padding: 10px; border-radius: 5px; margin: 0;">${formData.message.replace(/\n/g, '<br>')}</p>
  </div>
  <footer style="margin-top: 30px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
    Envoyé via le formulaire de contact - Agence Ménage
  </footer>
</div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Action error:", err);
    return { success: false, error: err };
  }
}

export async function sendEmployeeEmail(formData: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  whatsappNumber: string;
  position: string;
  experience: string;
  languages: string[];
  nationality: string;
  neighborhood: string;
  city: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Agence Ménage Recrutement <onboarding@resend.dev>',
      to: ['notification@agencemenage.ma'],
      subject: `Nouvelle Candidature: ${formData.firstName} ${formData.lastName} - ${formData.position}`,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; color: #333;">
  <div style="text-align: center; border-bottom: 2px solid #edba54; padding-bottom: 10px; margin-bottom: 20px;">
    <h2 style="color: #edba54; margin: 0;">
      RECRUTEMENT
    </h2>
    <h3 style="color: #edba54; margin: 0;">
      ESPACE EMPLOYE
    </h3>
  </div>
  <div style="margin-bottom: 20px;">
    <h3 style="color: #175e5c; border-left: 4px solid #175e5c; padding-left: 10px; margin-bottom: 10px;">Informations Candidat</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 5px 0; width: 40%;"><strong>Nom:</strong></td><td>${formData.lastName}</td></tr>
      <tr><td style="padding: 5px 0;"><strong>Prénom:</strong></td><td>${formData.firstName}</td></tr>
      <tr><td style="padding: 5px 0;"><strong>Téléphone:</strong></td><td>${formData.phoneNumber}</td></tr>
      <tr><td style="padding: 5px 0;"><strong>WhatsApp:</strong></td><td>${formData.whatsappNumber || "Non spécifié"}</td></tr>
    </table>
  </div>
  <div style="margin-bottom: 20px;">
    <h3 style="color: #175e5c; border-left: 4px solid #175e5c; padding-left: 10px; margin-bottom: 10px;">Détails de la Candidature</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 5px 0; width: 40%;"><strong>Poste souhaité:</strong></td><td>${formData.position}</td></tr>
      <tr><td style="padding: 5px 0; width: 40%;"><strong>Expérience:</strong></td><td>${formData.experience}</td></tr>
      <tr><td style="padding: 5px 0; width: 40%;"><strong>Langues:</strong></td><td>${formData.languages.join(", ")}</td></tr>
      <tr><td style="padding: 5px 0; width: 40%;"><strong>Nationalité:</strong></td><td>${formData.nationality}</td></tr>
    </table>
  </div>
  <div style="margin-bottom: 20px;">
    <h3 style="color: #175e5c; border-left: 4px solid #175e5c; padding-left: 10px; margin-bottom: 10px;">Localisation</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 5px 0; width: 40%;"><strong>Ville:</strong></td><td>${formData.city}</td></tr>
      <tr><td style="padding: 5px 0; width: 40%;"><strong>Adresse:</strong></td><td>${formData.neighborhood}</td></tr>
    </table>
  </div>
  <footer style="margin-top: 30px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
    Envoyé via l'Espace Employé - Agence Ménage
  </footer>
</div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Action error:", err);
    return { success: false, error: err };
  }
}

export async function sendBookingEmailResend(serviceName: string, data: any, price: string | number, isEntreprise: boolean = false) {
  try {
    const optionalServices = [];
    if (data.additionalServices?.produitsEtOutils) {
      optionalServices.push("Produits et outils (+90 MAD)");
    }
    if (data.additionalServices?.torchonsEtSerpierres) {
      optionalServices.push("Torchons et serpillères (+40 MAD)");
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

    const individual_name = [data.firstName, data.lastName].filter(Boolean).join(" ");
    const client_name = data.contactPerson || individual_name || data.entityName || "Client";
    const frequency = data.frequency === "oneshot" ? "Une fois" : `Abonnement ( ${data.frequencyLabel || data.subFrequency || ""} )`;

    // Services that don't have a time selection field
    const servicesWithoutTime = [
      "placement & gestion de propreté",
      "nettoyage fin de chantier",
      "nettoyage fin de chantier (entreprise)"
    ];

    const showSchedulingTime = !servicesWithoutTime.includes(serviceName.toLowerCase());
    const scheduling_time = showSchedulingTime ? (data.schedulingType === 'fixed' || !data.schedulingType ? data.fixedTime : (data.schedulingTime === 'morning' ? 'Le matin' : data.schedulingTime === 'afternoon' ? "L'après midi" : data.schedulingTime)) : null;

    // Dynamic fields
    const isGardeMalade = serviceName.toLowerCase().includes("garde malade");
    const patientProfile = isGardeMalade && (data.patientAge || data.patientGender) ? `${data.patientAge || "-"} ans, ${data.patientGender || "-"}` : null;

    // Notes consolidation
    const notesList = [data.changeRepereNotes, data.additionalNotes, data.notes];
    if (!isGardeMalade) {
      notesList.unshift(data.careAddress);
    }
    const combinedNotes = notesList.filter(Boolean).filter(n => n !== data.healthIssues).join(". ");

    const { data: resData, error } = await resend.emails.send({
      from: 'Agence Ménage <onboarding@resend.dev>',
      to: ['notification@agencemenage.ma'],
      subject: `Nouvelle Réservation: ${serviceName} - ${client_name}`,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; color: #333;">
  <div style="text-align: center; border-bottom: 2px solid #edba54; padding-bottom: 10px; margin-bottom: 20px;">
    <h2 style="color: #edba54; margin: 0;">
      RESERVATION
    </h2>
    <h3 style="color: #edba54; margin: 0;">
      SERVICES POUR ${isEntreprise ? 'ENTREPRISE' : 'PARTICULIER'}
    </h3>
  </div>
  <div style="margin-bottom: 20px;">
    <h3 style="color: #175e5c; border-left: 4px solid #175e5c; padding-left: 10px; margin-bottom: 10px;">Informations Client</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 5px 0; width: 40%;"><strong>Nom:</strong></td><td>${client_name}</td></tr>
      <tr><td style="padding: 5px 0;"><strong>Téléphone:</strong></td><td>${data.phoneNumber}</td></tr>
      ${data.whatsappNumber ? `<tr><td style="padding: 5px 0;"><strong>WhatsApp:</strong></td><td>${data.whatsappNumber}</td></tr>` : ""}
      ${data.email ? `<tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td>${data.email}</td></tr>` : ""}
      ${isEntreprise && data.entityName ? `<tr><td style="padding: 5px 0;"><strong>Entreprise:</strong></td><td>${data.entityName}</td></tr>` : ""}
      ${isEntreprise && data.contactPerson && data.contactPerson !== client_name ? `<tr><td style="padding: 5px 0;"><strong>Contact person:</strong></td><td>${data.contactPerson}</td></tr>` : ""}
      ${!isEntreprise && individual_name && individual_name !== client_name ? `<tr><td style="padding: 5px 0;"><strong>Nom:</strong></td><td>${individual_name}</td></tr>` : ""}
    </table>
  </div>
  <div style="margin-bottom: 20px;">
    <h3 style="color: #175e5c; border-left: 4px solid #175e5c; padding-left: 10px; margin-bottom: 10px;">Détails de la Prestation</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 5px 0; width: 40%;"><strong>Service:</strong></td><td>${serviceName}</td></tr>
      ${data.serviceType ? `<tr><td style="padding: 5px 0;"><strong>Offre:</strong></td><td style="text-transform: capitalize;">${data.serviceType}</td></tr>` : ""}
      ${data.structureType ? `<tr><td style="padding: 5px 0;"><strong>Structure:</strong></td><td style="text-transform: capitalize;">${data.structureType}</td></tr>` : ""}
      ${data.propertyType ? `<tr><td style="padding: 5px 0;"><strong>Type de bien:</strong></td><td style="text-transform: capitalize;">${data.propertyType}</td></tr>` : ""}
      <tr><td style="padding: 5px 0;"><strong>Fréquence:</strong></td><td>${frequency}</td></tr>
      ${data.recommendedDuration && data.recommendedDuration > 0 ? `<tr><td style="padding: 5px 0; width: 40%;"><strong>Durée recommandée:</strong></td><td>${data.recommendedDuration}h</td></tr>` : ""}
      ${data.duration && data.duration !== "-" ? `<tr><td style="padding: 5px 0;"><strong>Durée optée:</strong></td><td>${data.duration}h</td></tr>` : ""}
      ${data.numberOfPeople ? `<tr><td style="padding: 5px 0;"><strong>Intervenants:</strong></td><td>${data.numberOfPeople}</td></tr>` : ""}
      ${data.rooms ? `<tr><td style="padding: 5px 0;"><strong>Pièces:</strong></td><td style="text-transform: capitalize;">${(() => {
          const roomLabels: Record<string, string> = {
            cuisine: "Cuisine",
            suiteAvecBain: "Suite avec bain",
            suiteSansBain: "Suite sans bain",
            salleDeBain: "Salle de bain",
            chambre: "Chambre",
            salonMarocain: "Salon Marocain",
            salonEuropeen: "Salon Européen",
            toilettesLavabo: "Toilettes/Lavabo",
            rooftop: "Rooftop / Terrasse",
            escalier: "Escalier"
          };
          return Object.entries(data.rooms)
            .filter(([_, v]) => (v as number) > 0)
            .map(([k, v]) => `${v} ${roomLabels[k] || k}`)
            .join(", ");
        })()}</td></tr>` : ""}
      ${optionalServices.length > 0 ? `<tr><td style="padding: 5px 0;"><strong>Services optionnels:</strong></td><td>${optionalServices.join(", ")}</td></tr>` : ""}
      ${formattedSurface ? `<tr><td style="padding: 5px 0;"><strong>Surface:</strong></td><td>${formattedSurface}</td></tr>` : ""}
      ${serviceName === "Ménage post-déménagement" ? `
        <tr><td style="padding: 5px 0;"><strong>État du logement:</strong></td><td>${data.accommodationState || "-"}</td></tr>
        <tr><td style="padding: 5px 0;"><strong>Niveau de salissure:</strong></td><td>${data.cleanlinessType || "-"}</td></tr>
      ` : natureLabel !== "-" ? `<tr><td style="padding: 5px 0;"><strong>Type/État:</strong></td><td>${natureLabel}</td></tr>` : ""}
      ${isGardeMalade ? `
        ${patientProfile ? `<tr><td style="padding: 5px 0;"><strong>Profil Patient:</strong></td><td>${patientProfile}</td></tr>` : ""}
        ${data.mobility ? `<tr><td style="padding: 5px 0;"><strong>Mobilité:</strong></td><td>${data.mobility}</td></tr>` : ""}
        ${data.healthIssues ? `<tr><td style="padding: 5px 0;"><strong>Pathologie:</strong></td><td>${data.healthIssues}</td></tr>` : ""}
        ${data.numberOfDays ? `<tr><td style="padding: 5px 0;"><strong>Nombre de jours:</strong></td><td>${data.numberOfDays}</td></tr>` : ""}
      ` : ""}
    </table>
  </div>
  <div style="margin-bottom: 20px;">
    <h3 style="color: #175e5c; border-left: 4px solid #175e5c; padding-left: 10px; margin-bottom: 10px;">Lieu et Horaire</h3>
    <table style="width: 100%; border-collapse: collapse;">
      ${data.schedulingDate ? `<tr><td style="padding: 5px 0; width: 40%;"><strong>Date:</strong></td><td>${data.schedulingDate}</td></tr>` : ""}
      ${scheduling_time ? `<tr><td style="padding: 5px 0; width: 40%;"><strong>Heure:</strong></td><td>${scheduling_time}</td></tr>` : ""}
      ${isGardeMalade && data.careLocation ? `<tr><td style="padding: 5px 0; width: 40%;"><strong>Lieu de garde:</strong></td><td>${data.careLocation}</td></tr>` : ""}
      ${isGardeMalade && data.careAddress ? `<tr><td style="padding: 5px 0; width: 40%;"><strong>Adresse de garde:</strong></td><td>${data.careAddress}</td></tr>` : ""}
      ${data.city ? `<tr><td style="padding: 5px 0; width: 40%;"><strong>Ville:</strong></td><td>${data.city}</td></tr>` : ""}
      ${data.neighborhood ? `<tr><td style="padding: 5px 0; width: 40%;"><strong>Adresse:</strong></td><td>${data.neighborhood}</td></tr>` : ""}
    </table>
  </div>
  ${combinedNotes ? `
  <div style="margin-bottom: 20px;">
    <h3 style="color: #175e5c; border-left: 4px solid #175e5c; padding-left: 10px; margin-bottom: 10px;">Notes et précisions</h3>
    <p style="background: #f9f9f9; padding: 10px; border-radius: 5px; margin: 0;">${combinedNotes.replace(/\n/g, '<br>')}</p>
  </div>
  ` : ""}
  <div style="text-align: right; border-top: 2px solid #edba54; padding-top: 10px; margin-top: 20px;">
    <h3 style="margin: 0;">Total Estimé: <span style="color: #edba54;">${typeof price === "number" ? `${price} MAD` : price}</span></h3>
  </div>
</div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data: resData };
  } catch (err) {
    console.error("Action error:", err);
    return { success: false, error: err };
  }
}

export async function sendAutomatedWhatsAppMessage(
  targetNumber: string,
  templateName: string,
  variables: string[]
) {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error("WhatsApp credentials missing in .env");
    return { success: false, error: "Configuration manquante" };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: targetNumber.replace(/\+/g, ""), // Remove + if present
          type: "template",
          template: {
            name: templateName,
            language: {
              code: "fr"
            },
            components: [
              {
                type: "body",
                parameters: variables.map(v => ({
                  type: "text",
                  text: v
                }))
              }
            ]
          }
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API Error:", result);
      return { success: false, error: result };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("WhatsApp Action Error:", error);
    return { success: false, error };
  }
}
