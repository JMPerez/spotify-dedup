const withSourceMaps = require('@zeit/next-source-maps');

const repoNameURIPrefix = process.env.NODE_ENV === 'production' ? '' : '';

const config = {
  assetPrefix: repoNameURIPrefix,
  env: {
    linkPrefix: repoNameURIPrefix,
  },
  exportPathMap: () => ({
    '/': { page: '/' },
    '/de/index.html': { page: '/de' },
    '/es/index.html': { page: '/es' },
    '/fr/index.html': { page: '/fr' },
    '/it/index.html': { page: '/it' },
    '/nl/index.html': { page: '/nl' },
    '/pt/index.html': { page: '/pt' },
    '/sv/index.html': { page: '/sv' },
    '/callback/index.html': { page: '/callback' },
  }),
  webpack(config, options) {
    return config;
  },
};

module.exports = withSourceMaps(config);
