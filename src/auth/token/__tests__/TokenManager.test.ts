import { TokenManager } from '../TokenManager';
import { TokenRefreshReason } from '../../types';
import { act } from '@testing-library/react';

describe('TokenManager', () => {
  let tokenManager: TokenManager;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch as any;
    global.window.dispatchEvent = jest.fn();

    tokenManager = TokenManager.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
    tokenManager.cleanup();
  });

  describe('exchangeCodeForTokens', () => {
    it('should exchange code for tokens successfully', async () => {
      const mockTokens = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTokens)
      });

      const result = await tokenManager.exchangeCodeForTokens('test-code');

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: 'test-code' })
      });
      expect(result).toBe(mockTokens.access_token);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh token and setup auto-refresh', async () => {
      jest.useFakeTimers();

      const mockTokens = {
        access_token: 'test-token',
        expires_in: 3600
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTokens)
      });

      await tokenManager.refreshAccessToken(TokenRefreshReason.Preemptive);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/auth/refresh?reason=preemptive',
        { method: 'POST' }
      );

      // Verify event dispatch
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.any(CustomEvent)
      );

      // Reset mocks for next token refresh
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockTokens, access_token: 'refreshed-token' })
      });

      // Advance time to trigger auto-refresh
      await act(async () => {
        jest.advanceTimersByTime(3540 * 1000); // 3600 - 60 seconds
      });

      // Verify auto-refresh was triggered
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
}); 