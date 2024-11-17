export enum TokenRefreshReason {
  Expired = 'expired',
  Preemptive = 'preemptive'
}

// Common types shared across auth modules
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
} 