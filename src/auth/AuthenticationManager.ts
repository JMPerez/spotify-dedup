import { AUTH_TIMEOUT, AUTH_WINDOW_CONFIG, POLL_INTERVAL } from './oauth2window/constants';
import { generateRandomString, getAuthWindowFeatures, toQueryString } from './oauth2window/utils';

import { config } from './config';
import TokenManager from './token/TokenManager';

export type AuthState = 'none' | 'started' | 'got_code' | 'got_token';

export class AuthenticationManager {
  private static instance: AuthenticationManager;
  private authState: AuthState = 'none';
  private authWindow: Window | null = null;
  private timers: NodeJS.Timeout[] = [];

  private constructor(private tokenManager: typeof TokenManager) { }

  static getInstance(): AuthenticationManager {
    if (!AuthenticationManager.instance) {
      AuthenticationManager.instance = new AuthenticationManager(TokenManager);
    }
    return AuthenticationManager.instance;
  }

  async startAuthentication(options?: { scopes: string[] }): Promise<string> {
    this.authState = 'started';

    try {
      await this.openAuthWindow(options);
      return await Promise.race([
        this.waitForAuthentication(),
        this.setupTimeout()
      ]);
    } finally {
      this.cleanup();
    }
  }

  handleAuthCallback(code: string): void {
    localStorage.setItem('spotify_auth_code', code);
  }

  private async openAuthWindow(options: { scopes?: string[] } = {}): Promise<void> {
    const authParams = {
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      state: generateRandomString(16),
      scope: options.scopes?.join(' ') || '',
    };

    this.authWindow = window.open(
      `https://accounts.spotify.com/authorize?${toQueryString(authParams)}`,
      'Spotify',
      getAuthWindowFeatures(AUTH_WINDOW_CONFIG)
    );

    if (!this.authWindow) {
      throw new Error('Failed to open authentication window');
    }
  }

  private waitForAuthentication(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.timers.push(
        setInterval(async () => {
          const code = localStorage.getItem('spotify_auth_code');
          if (code) {
            this.authState = 'got_code';
            localStorage.removeItem('spotify_auth_code');
            try {
              const accessToken = await this.tokenManager.exchangeCodeForTokens(code);
              this.authState = 'got_token';
              resolve(accessToken);
            } catch (error) {
              reject(new Error('Failed to exchange authorization code for tokens'));
            }
          }
        }, POLL_INTERVAL)
      );

      this.timers.push(
        setInterval(() => {
          if (this.authWindow?.closed && this.authState === 'started') {
            reject(new Error('Authentication window closed by user'));
          }
        }, POLL_INTERVAL)
      );
    });
  }

  private setupTimeout(): Promise<never> {
    return new Promise((_, reject) => {
      this.timers.push(
        setTimeout(() => {
          reject(new Error('Authentication timeout'));
        }, AUTH_TIMEOUT)
      );
    });
  }

  private cleanup(): void {
    this.timers.forEach(timer => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    this.timers = [];

    if (this.authWindow && !this.authWindow.closed) {
      this.authWindow.close();
    }
    this.authWindow = null;
  }
}

export default AuthenticationManager.getInstance(); 