import { AuthWindowConfig } from './types';

export const AUTH_TIMEOUT = 5 * 60 * 1000; // 5 minutes
export const POLL_INTERVAL = 1000; // 1 second

export const AUTH_WINDOW_CONFIG: AuthWindowConfig = {
  width: 400,
  height: 600,
  left: global?.window?.screen?.width / 2 - 200,
  top: global?.window?.screen?.height / 2 - 300
};

export const SPOTIFY_AUTH_SUCCESS_KEY = 'spotify_auth_success';
export const SPOTIFY_AUTH_CODE_KEY = 'spotify_auth_code';
