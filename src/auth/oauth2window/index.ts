import { AUTH_TIMEOUT, AUTH_WINDOW_CONFIG, POLL_INTERVAL } from './constants';
import { generateRandomString, getAuthWindowFeatures, toQueryString } from './utils';

import { AuthWindowState } from './types';
import { config } from '../config';
import { exchangeCodeForTokens } from '../token';

export const SPOTIFY_AUTH_CODE_KEY = 'spotify_auth_code';
export const SPOTIFY_AUTH_SUCCESS_KEY = 'spotify_auth_success';

export async function obtainToken(options?: { scopes: string[] }): Promise<string> {
  const state: AuthWindowState = {
    window: null,
    timers: []
  };

  try {
    await setupAuthWindow(state, options);
    const token = await Promise.race([
      setupPolling(state),
      setupTimeout(state)
    ]);
    return token;
  } finally {
    cleanup(state);
  }
}

async function setupAuthWindow(
  state: AuthWindowState,
  options: { scopes?: string[] } = {}
): Promise<void> {
  const authParams = {
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    state: generateRandomString(16),
    scope: options.scopes?.join(' ') || '',
  };

  state.window = window.open(
    `https://accounts.spotify.com/authorize?${toQueryString(authParams)}`,
    'Spotify',
    getAuthWindowFeatures(AUTH_WINDOW_CONFIG)
  );

  if (!state.window) {
    throw new Error('Failed to open authentication window');
  }
}

function setupPolling(state: AuthWindowState): Promise<string> {
  return new Promise((resolve, reject) => {
    let windowCheckTimer: NodeJS.Timeout;

    // Poll for auth code
    state.timers.push(
      setInterval(async () => {
        const code = localStorage.getItem(SPOTIFY_AUTH_CODE_KEY);
        if (code) {
          localStorage.removeItem(SPOTIFY_AUTH_CODE_KEY);
          localStorage.removeItem(SPOTIFY_AUTH_SUCCESS_KEY);
          // Clear the window check timer as we've found a valid code
          if (windowCheckTimer) {
            clearInterval(windowCheckTimer);
          }
          try {
            const tokens = await exchangeCodeForTokens(code);
            resolve(tokens.access_token);
          } catch (error) {
            reject(new Error('Failed to exchange authorization code for tokens'));
          }
        }
      }, POLL_INTERVAL)
    );

    // Check if window was closed
    windowCheckTimer = setInterval(() => {
      if (state.window?.closed) {
        const wasSuccessful = localStorage.getItem(SPOTIFY_AUTH_SUCCESS_KEY);
        const code = localStorage.getItem(SPOTIFY_AUTH_CODE_KEY);
        if (!code && !wasSuccessful) {
          reject(new Error('Authentication window closed by user'));
        }
      }
    }, POLL_INTERVAL);
    state.timers.push(windowCheckTimer);
  });
}

function setupTimeout(state: AuthWindowState): Promise<never> {
  return new Promise((_, reject) => {
    state.timers.push(
      setTimeout(() => {
        reject(new Error('Authentication timeout'));
      }, AUTH_TIMEOUT)
    );
  });
}

function cleanup(state: AuthWindowState): void {
  // Clear all timers
  state.timers.forEach(timer => {
    clearTimeout(timer);
    clearInterval(timer);
  });
  state.timers = [];

  // Close the auth window if it's still open
  if (state.window && !state.window.closed) {
    state.window.close();
  }
  state.window = null;
}
