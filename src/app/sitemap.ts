import { MetadataRoute } from 'next'
import { getBlogPosts } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.agencemenage.ma'

    const routes = [
        '',
        '/entreprise',
        '/a-propos',
        '/contact',
        '/espace-employe',
        '/blog',
        '/services/particulier/menage-standard',
        '/services/particulier/grand-menage',
        '/services/menage-airbnb',
        '/services/particulier/menage-fin-chantier',
        '/services/particulier/garde-malade',
        '/services/particulier/menage-post-sinistre',
        '/services/entreprise/menage-bureaux',
        '/services/entreprise/menage-fin-chantier',
        '/services/entreprise/placement',
        '/services/entreprise/menage-post-sinistre',
    ]

    const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
    }))

    try {
        const posts = await getBlogPosts()
        const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.published_at ? new Date(post.published_at) : new Date(post.created_at || Date.now()),
            changeFrequency: 'weekly',
            priority: 0.7,
        }))
        return [...staticEntries, ...blogEntries]
    } catch {
        return staticEntries
    }
}
