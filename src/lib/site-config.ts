export interface SiteConfig {
  id?: string;
  phone_mobile_1: string;
  phone_mobile_1_intl: string;
  phone_mobile_2: string;
  phone_mobile_2_intl: string;
  phone_fixe: string;
  phone_fixe_intl: string;
  whatsapp_number: string;
  email_contact: string;
  email_notifications: string;
  bureau_casa_label: string;
  bureau_casa_address: string;
  bureau_casa_maps_url: string;
  bureau_rabat_label: string;
  bureau_rabat_address: string;
  bureau_rabat_maps_url: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  whatsapp_notification_numbers?: string[];
  updated_at?: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  phone_mobile_1: "06 64 22 67 90",
  phone_mobile_1_intl: "+212664226790",
  phone_mobile_2: "06 64 33 14 63",
  phone_mobile_2_intl: "+212664331463",
  phone_fixe: "05 22 20 02 39",
  phone_fixe_intl: "+212522200177",
  whatsapp_number: "+212664331463",
  email_contact: "contact@agencemenage.ma",
  email_notifications: "notification@agencemenage.ma",
  bureau_casa_label: "Bureau Casablanca",
  bureau_casa_address: "36 boulevard d’anfa, résidence Anafe A, etage 7",
  bureau_casa_maps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.4846067727145!2d-7.6324838!3d33.5932599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM1JzM1LjciTiA3wrAzNyc1Ni45Ilc!5e0!3m2!1sfr!2sma!4v1635848529285!5m2!1sfr!2sma",
  bureau_rabat_label: "Bureau Rabat",
  bureau_rabat_address: "Avenue Hassan II, centre commercial Reda, porte G, appt. 49",
  bureau_rabat_maps_url: "https://maps.google.com/maps?q=34.020882,-6.836218(Agence%20M%C3%A9nage%20Rabat)&z=15&output=embed",
  facebook_url: "https://www.facebook.com/profile.php?id=61586972460164",
  instagram_url: "https://www.instagram.com/agencemenage?igsh=MXBtNmxzNmNwcmdiYg==&utm_source=ig_contact_invite",
  tiktok_url: "",
  whatsapp_notification_numbers: [
    "+212664331463",
    "+212664267811",
    "+212664226790",
    "+212619900923"
  ]
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export async function getSiteConfigServer(): Promise<SiteConfig> {
  const endpoints = [
    `${API_URL}/api/public/site-config/`,
    `${API_URL}/api/site/public/config/`
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        return {
          ...DEFAULT_SITE_CONFIG,
          ...data,
        };
      }
    } catch {
      // Continuer vers l'URL suivante si échec
    }
  }

  return DEFAULT_SITE_CONFIG;
}
