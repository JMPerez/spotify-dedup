import { logEvent } from '@/utils/analytics';
import OAuthConfig from './oauthConfig';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

function toQueryString(obj: { [key: string]: string }) {
  const parts: Array<string> = [];
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      parts.push(`${encodeURIComponent(i)}=${encodeURIComponent(obj[i])}`);
    }
  }
  return parts.join('&');
}

async function obtainToken(options?: { scopes: Array<string> }) {
  return new Promise((resolve, reject) => {
    let authWindow: Window | null = null;
    let pollTimer: NodeJS.Timeout;

    const checkAuth = () => {
      const code = localStorage.getItem('spotify_auth_code');
      if (code) {
        // Clear the code immediately
        localStorage.removeItem('spotify_auth_code');
        clearInterval(pollTimer);

        if (authWindow !== null) {
          authWindow.close();
          authWindow = null;
        }

        // Call server action to exchange code
        fetch('/api/auth/exchange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to exchange code for tokens');
            }
            return response.json();
          })
          .then(tokens => {
            setupTokenRefresh(tokens);
            resolve(tokens.access_token);
          })
          .catch(reject);
      }
    };

    const width = 400;
    const height = 600;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;

    const params = {
      client_id: OAuthConfig.clientId,
      redirect_uri: OAuthConfig.redirectUri,
      response_type: 'code',
      state: generateRandomString(16),
      scope: options?.scopes?.join(' ') || '',
    };

    authWindow = window.open(
      `https://accounts.spotify.com/authorize?${toQueryString(params)}`,
      'Spotify',
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );

    // Start polling for the auth code in localStorage
    pollTimer = setInterval(checkAuth, 1000);

    // Also check for closed window
    const pollClosed = setInterval(() => {
      if (authWindow !== null && authWindow.closed) {
        clearInterval(pollTimer);
        clearInterval(pollClosed);
        reject({ message: 'Window closed by user' });
      }
    }, 1000);

    // Set a timeout to prevent infinite polling
    setTimeout(() => {
      clearInterval(pollTimer);
      clearInterval(pollClosed);
      if (authWindow !== null) {
        authWindow.close();
        reject({ message: 'Authentication timeout' });
      }
    }, 5 * 60 * 1000); // 5 minutes timeout
  });
}

async function refreshAccessToken(): Promise<string> {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  // Log token refresh to Simple Analytics
  logEvent('access_token_refreshed');

  const tokens = await response.json();
  setupTokenRefresh(tokens);

  // Dispatch event only during actual token refresh
  window.dispatchEvent(new CustomEvent('spotify_token_refreshed', {
    detail: { accessToken: tokens.access_token }
  }));

  return tokens.access_token;
}

function setupTokenRefresh(tokens: TokenResponse) {
  // Refresh 1 minute before expiration
  const refreshTime = (tokens.expires_in - 60) * 1000;
  setTimeout(() => refreshAccessToken(), refreshTime);
}

function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export default { obtainToken, refreshAccessToken };
