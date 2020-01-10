const repoNameURIPrefix =
  process.env.NODE_ENV === 'production' ? '/spotify-dedup' : '';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUNDLE_ANALYZE !== undefined,
});

module.exports = withBundleAnalyzer({
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
});
