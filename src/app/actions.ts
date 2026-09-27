"use server";

import { Resend } from 'resend';
import { AGENCY_NOTIFICATION_NUMBERS } from '@/lib/whatsapp';
import { getSurchargeDetails } from '@/lib/pricing';

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
    const isBureaux = serviceName.toLowerCase().includes("bureaux");
    if (isBureaux) {
      if (data.additionalServices?.produitsEtOutils) {
        optionalServices.push("Ménage avec produits");
      } else {
        optionalServices.push("Ménage sans produits");
      }
    } else {
      if (data.additionalServices?.produitsEtOutils) {
        optionalServices.push("Produits de ménage : 90 MAD");
      }
    }
    if (data.additionalServices?.torchonsEtSerpierres && !isBureaux) {
      optionalServices.push("Torchons et serpillères : 40 MAD");
    }
    if (data.additionalServices?.nettoyageTerrasse) {
      optionalServices.push("Nettoyage Terrasse : 500 MAD");
    }
    if (data.additionalServices?.baiesVitrees) {
      optionalServices.push("Baies Vitrées : Sur devis");
    }
    if (data.intensiveOption || data.cleanlinessType === "intensif") optionalServices.push("Option Intensif");
    if (data.additionalServices?.reassortConso) {
      optionalServices.push("Réassort consommables : 25 MAD");
    }
    if (data.additionalServices?.setsDeLinge && data.additionalServices?.setsDeLingeCount > 0) {
      const setsCost = data.additionalServices.setsDeLingeCost ?? data.additionalServices.setsDeLingeCount * 90;
      optionalServices.push(`Sets de linge supplémentaires (${data.additionalServices.setsDeLingeCount}) : ${setsCost} MAD`);
    }
    if (data.additionalServices?.articlesHorsSet && data.additionalServices?.articlesHorsSetCount > 0) {
      const extraCost = data.additionalServices.articlesHorsSetCost ?? data.additionalServices.articlesHorsSetCount * 5;
      optionalServices.push(`Articles hors set (${data.additionalServices.articlesHorsSetCount}) : ${extraCost} MAD`);
    }

    // Format date with day name
    let formattedDateWithDay = data.schedulingDate || "-";
    if (data.schedulingDate) {
      try {
        const dateObj = new Date(data.schedulingDate);
        if (!isNaN(dateObj.getTime())) {
          const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
          const dayName = days[dateObj.getDay()];
          // Assuming schedulingDate is already in a readable format, otherwise format it
          // If it's YYYY-MM-DD, we can just prepend the day name
          formattedDateWithDay = `${dayName}. ${data.schedulingDate}`;
        }
      } catch (e) {
        console.error("Date formatting error:", e);
      }
    }

    const surfaceValue = data.officeSurface || data.surfaceArea || data.surface || "";
    const formattedSurface = surfaceValue ? `${surfaceValue} m²` : "";

    let natureLabel = "-";
    if (serviceName === "Nettoyage d'urgence" || serviceName.toLowerCase().includes("post-sinistre")) {
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
    const isSubscription = data.frequency === "subscription" || data.is_subscription === true;
    const frequency = !isSubscription ? "Une fois" : `Abonnement ( ${data.frequencyLabel || data.subFrequency || "Mensuel"} )`;

    if (isSubscription) {
      data.is_subscription = true;
      data.frequency = 'subscription';
      if (!data.frequence) data.frequence = data.subFrequency || '2foisParSemaine';
      if (!data.jours_passage && data.joursPassage) data.jours_passage = data.joursPassage;
      if (!data.date_debut && data.schedulingDate) data.date_debut = data.schedulingDate;
      if (!data.date_premiere_intervention && data.schedulingDate) data.date_premiere_intervention = data.schedulingDate;
    }

    const scheduling_time = data.schedulingType === 'fixed' || (!data.schedulingType && data.fixedTime) ? data.fixedTime : (data.schedulingTime === 'morning' ? 'Le matin' : data.schedulingTime === 'afternoon' ? "L'après midi" : data.schedulingTime);

    // Surcharge determination
    const surchargeInfo = getSurchargeDetails(
      data.schedulingDate,
      data.schedulingType,
      data.fixedTime,
      data.schedulingTime
    );
    const surchargeLabel = data.surchargeLabel || surchargeInfo.label;
    let surchargeAmount = data.surchargeAmount;
    let basePrice = data.baseServicePrice || data.basePrice;

    if (surchargeInfo.multiplier > 1 && (!surchargeAmount || !basePrice) && typeof price === 'number') {
      const estimatedBase = Math.round(price / surchargeInfo.multiplier);
      basePrice = basePrice || estimatedBase;
      surchargeAmount = surchargeAmount || (price - estimatedBase);
    }

    // Dynamic fields
    const isGardeMalade = serviceName.toLowerCase().includes("garde malade");
    const patientProfile = isGardeMalade && (data.patientAge || data.patientGender) ? `${data.patientAge || "-"} ans, ${data.patientGender || "-"}` : null;

    // Notes consolidation
    const notesList = [data.changeRepereNotes, data.additionalNotes, data.notes];
    if (!isGardeMalade) {
      notesList.unshift(data.careAddress);
    }
    const combinedNotes = notesList.filter(Boolean).filter(n => n !== data.healthIssues).join(". ");

    // For Ménage Standard, format the rooms description into type_habitation for the back-office
    if (serviceName.toLowerCase() === "ménage standard") {
      const roomLabels: Record<string, string> = {
        cuisine: "Cuisine",
        suiteAvecBain: "Suite avec bain",
        suiteSansBain: "Suite sans bain",
        salleDeBain: "Salle de bain",
        chambre: "Chambre",
        salonMarocain: "Salon Marocain",
        salonEuropeen: "Salon Européen",
        toilettesLavabo: "Toilettes/Lavabo",
        rooftop: "Rooftop/Terrasse",
        escalier: "Escalier"
      };
      
      const roomsSummary = data.rooms 
        ? Object.entries(data.rooms)
            .filter(([_, v]) => (v as number) > 0)
            .map(([k, v]) => `${v} ${roomLabels[k] || k}`)
            .join(", ")
        : "";
      
      if (roomsSummary) {
        const propertyTypeLabel = data.propertyType 
          ? data.propertyType.charAt(0).toUpperCase() + data.propertyType.slice(1)
          : "";
        data.type_habitation = propertyTypeLabel 
          ? `${propertyTypeLabel} (${roomsSummary})` 
          : roomsSummary;
      }
    }

    // General mapping for other services if not already set (for back-office list view)
    if (!data.type_habitation && !data.structure_type) {
      const pType = data.propertyType || data.structureType || data.careLocation;
      const surface = data.officeSurface || (data.surfaceArea ? `${data.surfaceArea} m²` : (data.surface ? `${data.surface} m²` : ""));
      
      if (pType || surface) {
        const label = typeof pType === 'string' && pType ? pType.charAt(0).toUpperCase() + pType.slice(1) : "";
        const formatted = label && surface ? `${label} (${surface})` : (label || surface);
        
        if (isEntreprise) {
          data.structure_type = formatted;
        } else {
          data.type_habitation = formatted;
        }
      }
    }

    if (isGardeMalade) {
      if (data.patientAge && !data.age_personne) data.age_personne = data.patientAge;
      if (data.patientGender && !data.sexe_personne) data.sexe_personne = data.patientGender;
      if (data.mobility && !data.mobilite) data.mobilite = data.mobility;
      if (data.healthIssues && !data.situation_medicale) data.situation_medicale = data.healthIssues;
      if (data.careLocation && !data.lieu_garde) data.lieu_garde = data.careLocation;
      if (data.careAddress && !data.adresse_garde) data.adresse_garde = data.careAddress;
    }

    // --- ENREGISTREMENT API BACK-OFFICE ---
    let apiSuccess = false;
    try {
      const { createDemande } = await import('@/lib/api');
      
      let parsedPrix: string | null = null;
      let isDevis = false;

      if (typeof price === 'number') {
        parsedPrix = price.toString();
        isDevis = false;
      } else if (typeof price === 'string') {
        const cleanPrice = price.trim();
        const lowerPrice = cleanPrice.toLowerCase();
        if (lowerPrice.includes('devis') || lowerPrice.includes('rappel') || lowerPrice.includes('gratuit') || !cleanPrice) {
          parsedPrix = null;
          isDevis = true;
        } else {
          const numericStr = cleanPrice.replace(/[^0-9.,]/g, '').replace(',', '.').trim();
          if (numericStr && !isNaN(Number(numericStr))) {
            parsedPrix = Number(numericStr).toString();
            isDevis = false;
          } else {
            parsedPrix = null;
            isDevis = true;
          }
        }
      }

      const firstHour = Array.isArray(data.jours_passage) && data.jours_passage.length > 0 && data.jours_passage[0]?.heure_debut
        ? data.jours_passage[0].heure_debut
        : '';
      
      const rawDate = data.schedulingDate || data.date_debut || null;
      const cleanDate = rawDate && typeof rawDate === 'string' && rawDate.trim() !== '' ? rawDate.trim() : null;

      const cleanerCount = data.numberOfPeople || data.nb_intervenants || data.nb_intervenantes || data.nb_personnel || 1;
      const enrichedFormData = {
        ...data,
        numberOfPeople: cleanerCount,
        nb_intervenants: cleanerCount,
        nb_intervenantes: cleanerCount,
        nb_personnel: cleanerCount,
      };

      const apiPayload = {
        service: serviceName,
        segment: isEntreprise ? 'entreprise' as const : 'particulier' as const,
        client_nom: isEntreprise ? (data.contactPerson || data.entityName || '') : (data.lastName || client_name || ''),
        client_prenom: isEntreprise ? '' : (data.firstName || ''),
        client_phone: data.phoneNumber || '',
        client_email: data.email || '',
        client_whatsapp: data.whatsappNumber || '',
        client_entity: data.entityName || '',
        client_ville: data.city || '',
        client_quartier: data.neighborhood || '',
        client_address: data.careAddress || data.neighborhood || '',
        date_intervention: cleanDate,
        heure_intervention: firstHour || scheduling_time || '',
        preference_horaire: data.schedulingTime === 'morning' ? 'matin' : (data.schedulingTime === 'afternoon' ? 'apres_midi' : (data.schedulingTime || '')),
        frequency_label: data.frequencyLabel || data.subFrequency || (isSubscription ? 'Abonnement' : 'Une fois'),
        statut: 'en_attente',
        source: 'site',
        is_devis: isDevis,
        prix: parsedPrix,
        frequency: isSubscription ? 'abonnement' as const : 'oneshot' as const,
        nb_intervenants: cleanerCount,
        promo_code: data.promoCodeId || null,
        formulaire_data: enrichedFormData
      };
      
      await createDemande(apiPayload);
      apiSuccess = true;
      console.log('Demande successfully saved via Django API');
    } catch (apiError) {
      console.error("Erreur lors de l'enregistrement de la demande dans l'API:", apiError);
    }
    // --------------------------------------

    let emailSent = false;
    let resData = null;

    try {
      const emailSubject = `Nouvelle Réservation: ${isSubscription ? '[ABONNEMENT] ' : ''}${serviceName} - ${client_name}`;
      const emailResult = await resend.emails.send({
        from: 'Agence Ménage <onboarding@resend.dev>',
        to: ['notification@agencemenage.ma'],
        subject: emailSubject,
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; color: #333;">
  <div style="text-align: center; border-bottom: 2px solid #edba54; padding-bottom: 12px; margin-bottom: 20px;">
    <div style="margin-bottom: 8px;">
      <span style="display: inline-block; background-color: ${isSubscription ? '#166534' : '#175e5c'}; color: #ffffff; padding: 4px 14px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">
        ${isSubscription ? '⭐ Formule Abonnement Récurrent' : 'Prestation Ponctuelle'}
      </span>
    </div>
    <h2 style="color: #edba54; margin: 4px 0 0 0; text-transform: uppercase; font-size: 20px;">
      ${isSubscription ? 'NOUVELLE DEMANDE D\'ABONNEMENT' : 'RESERVATION'}
    </h2>
    <h3 style="color: #64748b; margin: 4px 0 0 0; font-size: 13px; font-weight: normal;">
      SERVICES POUR ${isEntreprise ? 'ENTREPRISE' : 'PARTICULIER'}
    </h3>
  </div>

  ${isSubscription ? `
  <div style="margin-bottom: 20px; background-color: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 16px;">
    <h3 style="color: #166534; margin: 0 0 12px 0; font-size: 15px; border-bottom: 1px solid #bbf7d0; padding-bottom: 8px;">
      📅 Configuration de l'Abonnement
    </h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <tr>
        <td style="padding: 5px 0; color: #166534; width: 42%;"><strong>Fréquence choisie :</strong></td>
        <td style="padding: 5px 0; color: #0f172a; font-weight: bold;">${data.frequencyLabel || data.subFrequency || frequency}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; color: #166534;"><strong>Date 1ère intervention :</strong></td>
        <td style="padding: 5px 0; color: #0f172a; font-weight: bold;">${formattedDateWithDay}</td>
      </tr>
      ${Array.isArray(data.jours_passage) && data.jours_passage.length > 0 ? `
      <tr>
        <td style="padding: 5px 0; color: #166534; vertical-align: top;"><strong>Planning hebdomadaire :</strong></td>
        <td style="padding: 5px 0; color: #0f172a;">
          <table style="width: 100%; border-collapse: collapse; background: #ffffff; border: 1px solid #dcfce7; border-radius: 6px; margin-top: 4px;">
            ${data.jours_passage.map((j: any) => `
              <tr style="border-bottom: 1px solid #f0fdf4;">
                <td style="padding: 6px 10px; font-weight: bold; color: #15803d; text-transform: capitalize; width: 35%;">${j.jour}</td>
                <td style="padding: 6px 10px; color: #334155;">De <strong>${j.heure_debut || '-'}</strong> à <strong>${j.heure_fin || '-'}</strong></td>
              </tr>
            `).join('')}
          </table>
        </td>
      </tr>
      ` : ""}
      ${isEntreprise ? `
        ${data.discountAmount > 0 ? `
        <tr>
          <td style="padding: 5px 0; color: #166534;"><strong>Remise abonnement :</strong></td>
          <td style="padding: 5px 0; color: #15803d; font-weight: bold;">
            -${data.discountAmount} MAD HT (-${data.discountRate}%)
          </td>
        </tr>
        ` : ""}
        ${data.prorata_actif ? `
        <tr style="border-top: 1px dashed #86efac;">
          <td style="padding: 8px 0 3px 0; color: #92400e;"><strong>Prorata 1er mois :</strong></td>
          <td style="padding: 8px 0 3px 0; color: #92400e; font-weight: bold;">
            ${data.totalHT || data.montant_prorata} MAD HT (${data.totalTTC || Math.round((data.montant_prorata || 0) * 1.20)} MAD TTC)
            <span style="font-weight: normal; font-size: 12px; display: block; color: #78350f;">
              (${data.nb_passages_mois_1} passage(s) restant(s) sur ${data.nb_passages_theoriques} ce mois)
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 3px 0; color: #166534;"><strong>Tarif mensuel dès le 2ᵉ mois :</strong></td>
          <td style="padding: 3px 0; color: #15803d; font-weight: bold;">
            ${data.tarif_mensuel_standard_ht || data.tarif_mensuel_standard} MAD HT / mois (${data.tarif_mensuel_standard_ttc || Math.round((data.tarif_mensuel_standard || 0) * 1.20)} MAD TTC / mois)
          </td>
        </tr>
        ` : `
        <tr style="border-top: 1px dashed #86efac;">
          <td style="padding: 8px 0 3px 0; color: #166534;"><strong>Tarif mensuel standard :</strong></td>
          <td style="padding: 8px 0 3px 0; color: #15803d; font-weight: bold;">
            ${data.totalHT || data.tarif_mensuel_standard || price} MAD HT / mois (${data.totalTTC || (typeof price === 'number' ? `${price} MAD` : price)} MAD TTC / mois)
          </td>
        </tr>
        `}
      ` : `
        ${data.prorata_actif ? `
        <tr style="border-top: 1px dashed #86efac;">
          <td style="padding: 8px 0 3px 0; color: #92400e;"><strong>Prorata 1er mois :</strong></td>
          <td style="padding: 8px 0 3px 0; color: #92400e; font-weight: bold;">
            ${data.montant_prorata || price} MAD <span style="font-weight: normal; font-size: 12px;">(${data.nb_passages_mois_1} passage(s) restant(s) sur ${data.nb_passages_theoriques} ce mois)</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 3px 0; color: #166534;"><strong>Tarif mensuel dès le 2ᵉ mois :</strong></td>
          <td style="padding: 3px 0; color: #15803d; font-weight: bold;">
            ${data.tarif_mensuel_standard ? `${data.tarif_mensuel_standard} MAD / mois` : '-'}
          </td>
        </tr>
        ` : `
        <tr style="border-top: 1px dashed #86efac;">
          <td style="padding: 8px 0 3px 0; color: #166534;"><strong>Tarif mensuel standard :</strong></td>
          <td style="padding: 8px 0 3px 0; color: #15803d; font-weight: bold;">
            ${typeof price === 'number' ? `${price} MAD / mois` : price}
          </td>
        </tr>
        `}
      `}
    </table>
  </div>
  ` : ""}

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
      ${serviceName.toLowerCase() === "ménage airbnb" ? `
        <tr><td style="padding: 5px 0; width: 40%;"><strong>Nombre de biens:</strong></td><td>${data.nombre_biens || "-"}</td></tr>
        <tr><td style="padding: 5px 0; width: 40%;"><strong>Logements concernés:</strong></td><td>${data.types_logement || "-"}</td></tr>
        <tr><td style="padding: 5px 0; width: 40%;"><strong>Services d'intérêt:</strong></td><td>${data.services_interet || "-"}</td></tr>
        <tr><td style="padding: 5px 0; width: 40%;"><strong>Moment de rappel:</strong></td><td>${data.moment_rappel || "-"}</td></tr>
      ` : ""}
      ${data.serviceType ? `<tr><td style="padding: 5px 0;"><strong>Offre:</strong></td><td style="text-transform: capitalize;">${data.serviceType}</td></tr>` : ""}
      ${data.structureType ? `<tr><td style="padding: 5px 0;"><strong>Structure:</strong></td><td style="text-transform: capitalize;">${data.structureType}</td></tr>` : ""}
      ${data.propertyType && serviceName.toLowerCase() !== "ménage airbnb" ? `<tr><td style="padding: 5px 0;"><strong>Type de bien:</strong></td><td style="text-transform: capitalize;">${data.propertyType}</td></tr>` : ""}
      ${data.sizeTier ? `<tr><td style="padding: 5px 0;"><strong>Type:</strong></td><td>${(() => {
        const sizeLabels: Record<string, string> = {
          studio: "Studio",
          "1chambre": "1 chambre",
          "2chambres": "2 chambres",
          "3chambres": "3 chambres",
          "4chambres": "4 chambres",
          villa: "Villa"
        };
        return sizeLabels[data.sizeTier] || data.sizeTier;
      })()}</td></tr>` : ""}
      ${!["nettoyage fin de chantier", "nettoyage fin de chantier (entreprise)", "ménage post-sinistre", "nettoyage d'urgence", "ménage airbnb"].includes(serviceName.toLowerCase()) ? `<tr><td style="padding: 5px 0;"><strong>Fréquence:</strong></td><td>${frequency}</td></tr>` : ""}
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
      ${surchargeLabel ? `<tr><td style="padding: 5px 0; color: #b45309;"><strong>Majoration horaire:</strong></td><td style="padding: 5px 0; color: #b45309; font-weight: bold;">${surchargeLabel}${surchargeAmount ? ` (+${surchargeAmount} MAD)` : ''}</td></tr>` : ""}
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
      ${data.additionalInfo ? `<tr><td style="padding: 5px 0;"><strong>Infos supp.:</strong></td><td>${data.additionalInfo}</td></tr>` : ""}
    </table>
  </div>
  <div style="margin-bottom: 20px;">
    <h3 style="color: #175e5c; border-left: 4px solid #175e5c; padding-left: 10px; margin-bottom: 10px;">Lieu et Horaire</h3>
    <table style="width: 100%; border-collapse: collapse;">
      ${!isSubscription && formattedDateWithDay !== "-" ? `<tr><td style="padding: 5px 0; width: 40%;"><strong>Date :</strong></td><td>${formattedDateWithDay}</td></tr>` : ""}
      ${!isSubscription && scheduling_time ? `<tr><td style="padding: 5px 0; width: 40%;"><strong>Heure :</strong></td><td>${scheduling_time}</td></tr>` : ""}
      ${isSubscription && formattedDateWithDay !== "-" ? `<tr><td style="padding: 5px 0; width: 40%;"><strong>Démarrage :</strong></td><td>${formattedDateWithDay}</td></tr>` : ""}
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
  <div style="border-top: 2px solid #edba54; padding-top: 12px; margin-top: 20px;">
    ${isEntreprise && (data.totalHT !== undefined || typeof price === 'number') ? `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 8px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          ${data.discountAmount > 0 ? `
          <tr>
            <td style="padding: 4px 0; color: #166534; font-weight: bold;">Remise abonnement (${data.discountRate}%) :</td>
            <td style="padding: 4px 0; text-align: right; color: #166534; font-weight: bold;">-${data.discountAmount} MAD HT</td>
          </tr>
          ` : ""}
          <tr>
            <td style="padding: 4px 0; color: #475569;">Total HT :</td>
            <td style="padding: 4px 0; text-align: right; color: #1e293b; font-weight: bold;">${data.totalHT ?? (typeof price === 'number' ? Math.round(price / 1.2) : price)} MAD</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #475569;">TVA (20%) :</td>
            <td style="padding: 4px 0; text-align: right; color: #1e293b; font-weight: bold;">${data.tvaAmount ?? (typeof price === 'number' ? (price - Math.round(price / 1.2)) : "20%")} MAD</td>
          </tr>
          <tr style="border-top: 1.5px solid #cbd5e1;">
            <td style="padding: 8px 0 4px 0; color: #0f172a; font-size: 15px; font-weight: bold;">
              ${isSubscription ? (data.prorata_actif ? "Total 1er mois TTC :" : "Total Mensuel TTC :") : "Total TTC :"}
            </td>
            <td style="padding: 8px 0 4px 0; text-align: right; color: #edba54; font-size: 20px; font-weight: bold;">
              ${data.totalTTC ?? (typeof price === 'number' ? `${price} MAD` : price)} ${typeof (data.totalTTC ?? price) === 'number' ? 'MAD' : ''}
            </td>
          </tr>
        </table>
        ${isSubscription && data.prorata_actif && (data.tarif_mensuel_standard_ttc || data.tarif_mensuel_standard) ? `
          <div style="font-size: 12px; color: #64748b; margin-top: 6px; text-align: right;">
            Dès le 2ᵉ mois : <strong style="color: #0f172a;">${data.tarif_mensuel_standard_ttc || Math.round(data.tarif_mensuel_standard * 1.20)} MAD TTC / mois</strong> (${data.tarif_mensuel_standard_ht || data.tarif_mensuel_standard} MAD HT)
          </div>
        ` : ""}
      </div>
    ` : isSubscription ? `
      <div style="text-align: right;">
        <div style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px;">
          ${data.prorata_actif ? "Montant 1er mois (Calcul Prorata)" : "Tarif Mensuel Abonnement"}
        </div>
        <h3 style="margin: 0; font-size: 22px; color: #175e5c;">
          <span style="color: #edba54;">${typeof price === "number" ? `${price} MAD` : price}</span>
        </h3>
        ${data.prorata_actif && data.tarif_mensuel_standard ? `
          <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
            Tarif mensuel régulier dès le 2ᵉ mois : <strong style="color: #0f172a;">${data.tarif_mensuel_standard} MAD / mois</strong>
          </div>
        ` : ""}
      </div>
    ` : `
      <div style="text-align: right;">
        ${surchargeLabel && surchargeAmount && basePrice ? `
          <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">
            Tarif base (${data.duration ? `${data.duration}h` : ''}${data.numberOfPeople ? ` × ${data.numberOfPeople} pers.` : ''}) : <strong style="color: #334155;">${basePrice} MAD</strong>
          </div>
          <div style="font-size: 13px; color: #b45309; margin-bottom: 6px;">
            ${surchargeLabel} : <strong style="color: #b45309;">+${surchargeAmount} MAD</strong>
          </div>
        ` : ""}
        <h3 style="margin: 0;">${typeof price === "string" && price.toLowerCase().includes("rappel") ? "Type de demande:" : "Total Estimé:"} <span style="color: #edba54;">${typeof price === "number" ? `${price} MAD` : price}</span></h3>
      </div>
    `}
  </div>
</div>
        `,
      });

      if (emailResult.error) {
        console.error("Resend error:", emailResult.error);
      } else {
        emailSent = true;
        resData = emailResult.data;
      }
    } catch (emailErr) {
      console.error("Email sending exception:", emailErr);
    }

    if (process.env.D360_API_KEY) {
      try {
        const formattedDate = formattedDateWithDay;
        const formattedHour = scheduling_time || "-";
        
        let clientPriceWa = typeof price === "number" ? `${price} MAD` : String(price);
        let agencyPriceWa = clientPriceWa;

        if (isEntreprise && (data.totalHT !== undefined || data.totalTTC !== undefined)) {
          const ht = data.totalHT ?? (typeof price === 'number' ? Math.round(price / 1.2) : price);
          const ttc = data.totalTTC ?? (typeof price === 'number' ? price : `${price} TTC`);
          if (isSubscription) {
            if (data.prorata_actif) {
              clientPriceWa = `${ttc} MAD TTC (1er mois prorata) [${ht} MAD HT + TVA 20%]`;
              agencyPriceWa = `${ttc} MAD TTC (1er mois prorata) [${ht} MAD HT + TVA 20%]`;
            } else {
              clientPriceWa = `${ttc} MAD TTC/mois (${ht} MAD HT + TVA 20%)`;
              agencyPriceWa = `${ttc} MAD TTC/mois (${ht} MAD HT + TVA 20%)`;
            }
          } else {
            clientPriceWa = `${ttc} MAD TTC (${ht} MAD HT + TVA 20%)`;
            agencyPriceWa = `${ttc} MAD TTC (${ht} MAD HT + TVA 20%)`;
          }
        }

        const waPromises = [];

        // 1. To Client
        if (data.phoneNumber) {
          const waDuration = data.duration && data.duration !== "-" 
            ? `${data.duration} ${Number(data.duration) > 1 ? 'heures' : 'heure'}` 
            : "-";
          const waPeople = data.numberOfPeople ? String(data.numberOfPeople) : "-";
          const waOptionalServices = optionalServices.length > 0 ? optionalServices.join(", ") : "Aucun";

          waPromises.push(
            sendAutomatedWhatsAppMessage(
              data.phoneNumber,
              "confirmation_reservation",
              [
                client_name,
                serviceName,
                frequency,
                waDuration,
                waPeople,
                formattedDate,
                formattedHour,
                waOptionalServices,
                clientPriceWa
              ]
            ).catch(err => console.error("Client WA Error:", err))
          );
        }

        // 2. To Agency
        AGENCY_NOTIFICATION_NUMBERS.forEach(number => {
          waPromises.push(
            sendAutomatedWhatsAppMessage(
              number,
              "notification_interne",
              [
                client_name,
                data.phoneNumber || "-",
                serviceName,
                `${formattedDate} à ${formattedHour}`,
                data.city || data.neighborhood || "Non précisé",
                agencyPriceWa
              ]
            ).catch(err => console.error(`Agency WA Error (${number}):`, err))
          );
        });

        await Promise.all(waPromises);
      } catch (waErr) {
        console.error("WhatsApp notification error:", waErr);
      }
    }

    // Return success if AT LEAST the API creation worked OR the email was sent
    // But return boolean success based on API success mainly for back-office tracking
    return { 
      success: apiSuccess, 
      apiSuccess, 
      emailSent,
      data: resData,
      error: apiSuccess ? null : "Failed to record demand in back-office" 
    };
  } catch (err) {
    console.error("Action error:", err);
    return { success: false, error: String(err) };
  }
}

export async function sendAutomatedWhatsAppMessage(
  targetNumber: string,
  templateName: string,
  variables: string[]
) {
  const API_KEY = process.env.D360_API_KEY;

  if (!API_KEY) {
    console.error("D360_API_KEY missing in .env");
    return { success: false, error: "Configuration manquante" };
  }

  try {
    const formattedNumber = targetNumber.replace(/\+/g, "").replace(/\s/g, "");

    const response = await fetch(
      `https://waba-v2.360dialog.io/messages`,
      {
        method: "POST",
        headers: {
          "D360-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: formattedNumber,
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
                  text: String(v)
                }))
              }
            ]
          }
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("WhatsApp 360dialog API Error:", result);
      return { success: false, error: result };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("WhatsApp Action Error:", error);
    return { success: false, error };
  }
}
