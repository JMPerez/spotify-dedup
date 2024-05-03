import OAuthConfig from './oauthConfig';

function toQueryString(obj: { [key: string]: string }) {
  const parts: Array<string> = [];
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      parts.push(`${encodeURIComponent(i)}=${encodeURIComponent(obj[i])}`);
    }
  }
  return parts.join('&');
}

function obtainToken(options?: { scopes: Array<string> }) {
  const promise = new Promise((resolve, reject) => {
    let authWindow: Window | null = null;
    let pollAuthWindowClosed: NodeJS.Timeout;

    function receiveMessage(event: { origin: string; data: string }) {
      try {
        const message = JSON.parse(event.data);
        if (message.token) {
          clearInterval(pollAuthWindowClosed);
          if (event.origin !== OAuthConfig.host) {
            reject({
              message: `Origin ${event.origin} does not match ${OAuthConfig.host}`,
            });
            return;
          }
          if (authWindow !== null) {
            authWindow.close();
            authWindow = null;
          }

          window.removeEventListener('message', receiveMessage, false);

          // todo: manage case when the user rejects the oauth
          // or the oauth fails to obtain a token
          resolve(message.token);
        }
      } catch (e) { }
    }

    window.addEventListener('message', receiveMessage, false);

    const width = 400;
    const height = 600;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;

    type Parameters = {
      client_id: string;
      redirect_uri: string;
      response_type: string;
      scope?: string;
    };

    const params: Parameters = {
      client_id: OAuthConfig.clientId,
      redirect_uri: OAuthConfig.redirectUri,
      response_type: 'token',
    };

    if (options?.scopes) {
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
