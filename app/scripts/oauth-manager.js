import OAuthConfig from './oauth-config';

function toQueryString(obj) {
  const parts = [];
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      parts.push(`${encodeURIComponent(i)}=${encodeURIComponent(obj[i])}`);
    }
  }
  return parts.join('&');
}

function obtainToken(options = {}) {
  const promise = new Promise((resolve, reject) => {
    let authWindow = null;
    let pollAuthWindowClosed = null;

    function receiveMessage(event) {
      clearInterval(pollAuthWindowClosed);
      if (event.origin !== OAuthConfig.host) {
        reject();
        return;
      }
      if (authWindow !== null) {
        authWindow.close();
        authWindow = null;
      }

      window.removeEventListener('message', receiveMessage, false);

      // todo: manage case when the user rejects the oauth
      // or the oauth fails to obtain a token
      resolve(event.data);
    }

    window.addEventListener('message', receiveMessage, false);

    const width = 400;
    const height = 600;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;

    /*jshint camelcase:false*/
    const params = {
      client_id: OAuthConfig.clientId,
      redirect_uri: OAuthConfig.redirectUri,
      response_type: 'token'
    };

    if (options.scopes) {
      params.scope = options.scopes.join(' ');
    }

    authWindow = window.open(
      `https://accounts.spotify.com/authorize?${toQueryString(params)}`,
      'Spotify',
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );

    pollAuthWindowClosed = setInterval(() => {
      if (authWindow !== null) {
        if (authWindow.closed) {
          clearInterval(pollAuthWindowClosed);
          reject({ message: 'access_denied' });
        }
      }
    }, 1000);
  });

  return promise;
}

export default { obtainToken };
