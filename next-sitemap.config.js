/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://spotify-dedup.com',
  generateRobotsTxt: true,
  exclude: ['/callback', '/components'],
}