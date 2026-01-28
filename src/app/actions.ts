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
            to: ['contact@agencemenage.ma'], // Replace with actual recipient email
            subject: `Nouveau message de contact: ${formData.name}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h1 style="color: #1e293b; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Nouveau message de contact</h1>
          <div style="margin-top: 20px; line-height: 1.6;">
            <p><strong>Nom :</strong> ${formData.name}</p>
            <p><strong>Email :</strong> ${formData.email}</p>
            <p><strong>Téléphone :</strong> ${formData.phoneNumber}</p>
            <p><strong>WhatsApp :</strong> ${formData.whatsappNumber}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #fbbf24;">
              <strong>Message :</strong><br/>
              ${formData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <footer style="margin-top: 30px; font-size: 12px; color: #64748b; text-align: center;">
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
