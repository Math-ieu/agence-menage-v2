const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface DemandePayload {
  service: string;
  segment: 'particulier' | 'entreprise';
  client_nom: string;
  client_phone: string;
  client_email?: string | null;
  client_whatsapp?: string | null;
  client_entity_name?: string | null;
  statut?: string;
  source?: string;
  is_devis?: boolean;
  prix?: string | null;
  frequency?: 'oneshot' | 'abonnement';
  formulaire_data?: any;
}

export async function createDemande(payload: DemandePayload) {
  try {
    const response = await fetch(`${API_URL}/api/public/demandes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error HTTP ${response.status}:`, errorText);
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error during createDemande:', error);
    throw error;
  }
}
