import { AuthenticationManager } from '../AuthenticationManager';
import { act } from '@testing-library/react';

// Add global fetch mock
global.fetch = jest.fn();

describe('AuthenticationManager', () => {
  let authManager: AuthenticationManager;
  let mockTokenManager: { getInstance: () => { exchangeCodeForTokens: jest.Mock } };
  let mockWindow: Window;

  beforeEach(() => {
    // Clear all mocks including fetch
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();

    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600
      })
    });

    // Mock localStorage with proper typing
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true
    });

    // Mock TokenManager as a static class
    const mockTokenInstance = {
      exchangeCodeForTokens: jest.fn(),
      refreshAccessToken: jest.fn(),
      cleanup: jest.fn()
    };

    mockTokenManager = {
      getInstance: jest.fn().mockReturnValue(mockTokenInstance)
    };

    // Mock window with correct type
    mockWindow = {
      get closed() { return false; },
      close: jest.fn(),
    } as unknown as Window;

    jest.spyOn(window, 'open').mockReturnValue(mockWindow);

    // Create new instance for each test
    authManager = AuthenticationManager.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('startAuthentication', () => {
    it('should open auth window and resolve with token on successful authentication', async () => {
      const expectedToken = 'mock-token';
      mockTokenManager.getInstance().exchangeCodeForTokens.mockResolvedValue(expectedToken);

      const authPromise = authManager.startAuthentication();

      // Simulate code being stored in localStorage
      await act(async () => {
        (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-code');
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      const token = await authPromise;

      expect(window.open).toHaveBeenCalled();
      expect(token).toBe(expectedToken);
    });

    it('should reject if auth window is closed before code is received', async () => {
      Object.defineProperty(mockWindow, 'closed', {
        get: () => true
      });

      await expect(authManager.startAuthentication()).rejects.toThrow(
        'Authentication window closed by user'
      );
    });

    it('should reject on timeout', async () => {
      const authPromise = authManager.startAuthentication({ timeout: 0 });
      await expect(authPromise).rejects.toThrow('Authentication timeout');
    });
  });

  describe('handleAuthCallback', () => {
    it('should store code in localStorage', () => {
      const mockCode = 'test-code';
      authManager.handleAuthCallback(mockCode);

      expect(window.localStorage.setItem)
        .toHaveBeenCalledWith('spotify_auth_code', mockCode);
    });
  });
}); 