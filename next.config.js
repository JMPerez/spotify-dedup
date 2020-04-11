const repoNameURIPrefix =
  process.env.NODE_ENV === 'production' ? '/spotify-dedup' : '';

module.exports = {
  assetPrefix: repoNameURIPrefix,
  env: {
    linkPrefix: repoNameURIPrefix,
  },
  exportPathMap: () => ({
    '/': { page: '/' },
    '/de/index.html': { page: '/de' },
    '/es/index.html': { page: '/es' },
    '/fr/index.html': { page: '/fr' },
    '/pt/index.html': { page: '/pt' },
    '/sv/index.html': { page: '/sv' },
    '/callback/index.html': { page: '/callback' },
  }),
};
