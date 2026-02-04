import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.agencemenage.ma'

    const routes = [
        '',
        '/entreprise',
        '/contact',
        '/espace-employe',
        '/services/particulier/menage-standard',
        '/services/particulier/grand-menage',
        '/services/particulier/menage-demenagement',
        '/services/particulier/menage-airbnb',
        '/services/particulier/menage-fin-chantier',
        '/services/particulier/garde-malade',
        '/services/entreprise/menage-bureaux',
        '/services/entreprise/menage-fin-chantier',
        '/services/entreprise/placement',
        '/services/particulier/nettoyage-urgence',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
    }))
}
