import { TokenRefreshReason, TokenResponse } from '../types';

import { logEvent } from '@/utils/analytics';

export class TokenManager {
  private static instance: TokenManager;
  private refreshTimer?: NodeJS.Timeout;
  private REFRESH_BUFFER = 60; // Refresh 1 minute before expiration

  private constructor() { }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async exchangeCodeForTokens(code: string): Promise<string> {
    const tokens = await this.fetchTokens(code);
    this.setupTokenRefresh(tokens);
    return tokens.access_token;
  }

  private async fetchTokens(code: string): Promise<TokenResponse> {
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

    return response.json();
  }

  async refreshAccessToken(reason?: TokenRefreshReason): Promise<string> {
    const queryString = reason ? `?reason=${reason}` : '';
    const response = await fetch(`/api/auth/refresh${queryString}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh access token: ${response.status}`);
    }

    const tokens: TokenResponse = await response.json();
    this.setupTokenRefresh(tokens);
    this.notifyTokenRefresh(tokens.access_token, reason);
    logEvent('access_token_refreshed', { reason });

    return tokens.access_token;
  }

  private setupTokenRefresh(tokens: TokenResponse): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const refreshTime = (tokens.expires_in - this.REFRESH_BUFFER) * 1000;
    this.refreshTimer = setTimeout(
      () => this.refreshAccessToken(TokenRefreshReason.Preemptive),
      refreshTime
    );
  }

  private notifyTokenRefresh(accessToken: string, reason?: TokenRefreshReason): void {
    window.dispatchEvent(new CustomEvent('spotify_token_refreshed', {
      detail: { accessToken, reason }
    }));
  }

  cleanup(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  }
}

export default TokenManager.getInstance(); 