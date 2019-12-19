import OAuthConfig from './oauth-config';

export default () => {
  if (typeof window !== 'undefined') {
    const target = window.self === window.top ? window.opener : window.parent;

    const hash = window.location.hash;
    if (hash) {
      const token = window.location.hash.split('&')[0].split('=')[1];
      target.postMessage(token, OAuthConfig.host);
    }
  }
};
