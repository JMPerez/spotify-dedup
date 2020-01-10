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
    '/pt/index.html': { page: '/pt' },
    '/callback/index.html': { page: '/callback' },
  }),
};
