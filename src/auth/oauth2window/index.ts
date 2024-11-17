import AuthenticationManager from '../AuthenticationManager';

export async function obtainToken(options?: { scopes: string[] }): Promise<string> {
  return AuthenticationManager.startAuthentication(options);
}
