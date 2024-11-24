import { TokenManager } from '@/src/auth/token/TokenManager';
import { TokenRefreshReason } from '@/src/auth/types';
import { logEvent } from '@/utils/analytics';
import { Response } from 'node-fetch';
import retryFetch from '../customFetch';

// Mock dependencies
jest.mock('@/src/auth/token/TokenManager');
jest.mock('@/utils/analytics');

// Add this mock before your tests
const mockResponse = (body: string, options: any = {}) => {
  return new Response(body, options) as Response;
};

describe('retryFetch', () => {
  let originalFetch: typeof global.fetch;
  let mockFetch: jest.Mock;

  beforeAll(() => {
    originalFetch = global.fetch;
    // Mock window.alert
    window.alert = jest.fn();
  });

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    jest.clearAllMocks();
    // Clear alert mock calls
    (window.alert as jest.Mock).mockClear();
    jest.spyOn(console, 'warn').mockImplementation(() => { });
    jest.spyOn(console, 'debug').mockImplementation(() => { });
  });

  afterAll(() => {
    global.fetch = originalFetch;
    // Clean up alert mock
    delete (window as any).alert;
  });

  it('should succeed on first attempt', async () => {
    const response = mockResponse('{"success": true}', { status: 200 });
    mockFetch.mockResolvedValueOnce(response);

    const result = await retryFetch('https://api.spotify.com/v1/test');

    expect(result).toBe(response);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  describe('Rate Limiting', () => {
    it('should handle rate limiting with Retry-After header', async () => {
      const rateLimitResponse = mockResponse('Rate limited', {
        status: 429,
        headers: { 'Retry-After': '2' }
      });
      const successResponse = mockResponse('{"success": true}', { status: 200 });

      mockFetch
        .mockResolvedValueOnce(rateLimitResponse)
        .mockResolvedValueOnce(successResponse);

      const result = await retryFetch('https://api.spotify.com/v1/test');

      expect(result).toBe(successResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Token Refresh', () => {
    it('should refresh token on 401 expired token error', async () => {
      const expiredResponse = mockResponse(
        JSON.stringify({
          error: {
            status: 401,
            message: 'The access token expired'
          }
        }),
        {
          status: 401,
          headers: { 'content-type': 'application/json' }
        }
      );
      const successResponse = mockResponse('{"success": true}', { status: 200 });

      mockFetch
        .mockResolvedValueOnce(expiredResponse)
        .mockResolvedValueOnce(successResponse);

      const mockTokenManager = {
        refreshAccessToken: jest.fn().mockResolvedValue('new-token')
      };
      (TokenManager.getInstance as jest.Mock).mockReturnValue(mockTokenManager);

      await retryFetch('https://api.spotify.com/v1/test', {
        headers: { 'Authorization': 'Bearer old-token' }
      });

      expect(mockTokenManager.refreshAccessToken)
        .toHaveBeenCalledWith(TokenRefreshReason.Expired);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls[1][0]).toBe('https://api.spotify.com/v1/test');
      expect(mockFetch.mock.calls[1][1].headers).toEqual({
        'Authorization': 'Bearer new-token'
      });
    });
  });

  describe('Error Handling', () => {
    it('should not retry on 400 bad request', async () => {
      const badRequestResponse = mockResponse(
        JSON.stringify({
          error: {
            status: 400,
            message: 'Bad Request'
          }
        }),
        {
          status: 400,
          headers: { 'content-type': 'application/json' }
        }
      );

      mockFetch.mockResolvedValueOnce(badRequestResponse);

      await expect(retryFetch('https://api.spotify.com/v1/test', {
        showDefaultAlert: false,
        times: 1
      }))
        .rejects.toThrow('Bad Request');
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(window.alert).not.toHaveBeenCalled();
    });

    it('should show alert on error when showDefaultAlert is true', async () => {
      const badRequestResponse = mockResponse(
        JSON.stringify({
          error: {
            status: 400,
            message: 'Bad Request'
          }
        }),
        {
          status: 400,
          headers: { 'content-type': 'application/json' }
        }
      );

      mockFetch.mockResolvedValueOnce(badRequestResponse);

      await expect(retryFetch('https://api.spotify.com/v1/test', {
        showDefaultAlert: true,
        times: 1
      }))
        .rejects.toThrow('Bad Request');

      expect(window.alert).toHaveBeenCalledWith(
        'There was an error accessing the Spotify API. Please try again later. If the problem persists, please report this issue.'
      );
    });

    it('should retry on network errors', async () => {
      const networkError = new Error('Network error');
      const successResponse = mockResponse('{"success": true}', { status: 200 });

      mockFetch
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(successResponse);

      const result = await retryFetch('https://api.spotify.com/v1/test');

      expect(result).toBe(successResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should log error after max retries', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(retryFetch('https://api.spotify.com/v1/test', { times: 2 }))
        .rejects.toThrow('Network error');

      expect(logEvent).toHaveBeenCalledWith('error_api_max_retries', {
        message: 'Network error'
      });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Retry Options', () => {
    it('should respect custom retry options', async () => {
      const networkError = new Error('Network error');
      const successResponse = mockResponse('{"success": true}', { status: 200 });
      const onError = jest.fn();

      mockFetch
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(successResponse);

      const result = await retryFetch('https://api.spotify.com/v1/test', {
        times: 2,
        delay: 100,
        backoff: 2,
        onError,
        showDefaultAlert: false
      });

      expect(result).toBe(successResponse);
      expect(onError).toHaveBeenCalledWith(networkError, 1);
    });

    it('should use exponential backoff', async () => {
      jest.useFakeTimers();
      const networkError = new Error('Network error');
      const successResponse = mockResponse('{"success": true}', { status: 200 });

      mockFetch
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(successResponse);

      const fetchPromise = retryFetch('https://api.spotify.com/v1/test', {
        delay: 1000,
        backoff: 2
      });

      // First retry should wait 1000ms
      await jest.advanceTimersByTimeAsync(1000);
      // Second retry should wait 2000ms
      await jest.advanceTimersByTimeAsync(2000);

      const result = await fetchPromise;
      expect(result).toBe(successResponse);
      expect(mockFetch).toHaveBeenCalledTimes(3);

      jest.useRealTimers();
    });
  });

  describe('Response Parsing', () => {
    it('should handle non-JSON error responses', async () => {
      const htmlResponse = mockResponse(
        '<html>Error</html>',
        {
          status: 500,
          headers: { 'content-type': 'text/html' }
        }
      );

      mockFetch.mockResolvedValue(htmlResponse);

      await expect(retryFetch('https://api.spotify.com/v1/test'))
        .rejects.toThrow('Failed fetch');
    });

    it('should handle malformed JSON responses', async () => {
      const invalidJsonResponse = mockResponse(
        'Invalid JSON',
        {
          status: 500,
          headers: { 'content-type': 'application/json' }
        }
      );

      mockFetch.mockResolvedValue(invalidJsonResponse);

      await expect(retryFetch('https://api.spotify.com/v1/test'))
        .rejects.toThrow('Failed fetch');
    });
  });
}); 