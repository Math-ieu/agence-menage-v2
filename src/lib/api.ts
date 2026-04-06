const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface DemandePayload {
  service: string;
  segment: 'particulier' | 'entreprise';
  client_nom: string;
  client_phone: string;
  client_email?: string | null;
  client_whatsapp?: string | null;
  client_entity?: string | null;
  client_address?: string | null;
  client_ville?: string | null;
  client_quartier?: string | null;
  client_prenom?: string | null;
  date_intervention?: string | null;
  heure_intervention?: string | null;
  preference_horaire?: string | null;
  frequency_label?: string | null;
  statut?: string;
  source?: string;
  is_devis?: boolean;
  prix?: string | null;
  frequency?: 'oneshot' | 'abonnement';
  formulaire_data?: any;
}

export interface GalleryItem {
  id: number;
  image: string;
  alt: string;
  caption: string;
  order: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface RelatedService {
  name: string;
  url: string;
  ctaLabel: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  banner_color: string;
  category: number | null;
  category_name: string;
  author_name: string;
  published_at: string | null;
  created_at: string;
  tags: Tag[];
  gallery?: GalleryItem[];
  related_services?: RelatedService[];
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

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_URL}/api/public/blog/posts/`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_URL}/api/public/blog/posts/${slug}/`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return null;
  }
}
