import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['mj12', 'Dotbot'],
        disallow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
      },

    ],
    sitemap: 'https://spotify-dedup.com/sitemap.xml',
  }
}