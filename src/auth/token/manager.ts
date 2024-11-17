import { TokenRefreshReason, TokenResponse } from '../types';

import { logEvent } from '@/utils/analytics';

const REFRESH_BUFFER = 60; // Refresh 1 minute before expiration

export async function refreshAccessToken(reason?: TokenRefreshReason): Promise<string> {
  const queryString = reason ? `?reason=${reason}` : '';
  const response = await fetch(`/api/auth/refresh${queryString}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh access token: ${response.status}`);
  }

  const tokens: TokenResponse = await response.json();

  setupTokenRefresh(tokens);
  logEvent('access_token_refreshed', { reason });
  notifyTokenRefresh(tokens.access_token, reason);

  return tokens.access_token;
}

function setupTokenRefresh(tokens: TokenResponse): void {
  const refreshTime = (tokens.expires_in - REFRESH_BUFFER) * 1000;
  setTimeout(
    () => refreshAccessToken(TokenRefreshReason.Preemptive),
    refreshTime
  );
}

function notifyTokenRefresh(accessToken: string, reason?: TokenRefreshReason): void {
  window.dispatchEvent(new CustomEvent('spotify_token_refreshed', {
    detail: { accessToken, reason }
  }));
}

export async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  const response = await fetch('/api/auth/exchange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code })
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  const tokens: TokenResponse = await response.json();
  setupTokenRefresh(tokens);
  return tokens;
}

export async function revokeToken(): Promise<void> {
  const response = await fetch('/api/auth/revoke', {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Failed to revoke token');
  }

  // Clear any scheduled token refreshes
  // Note: This is a simplified approach. In a real app, you might want to
  // keep track of the timeout ID from setupTokenRefresh to clear it properly
  logEvent('token_revoked');
}