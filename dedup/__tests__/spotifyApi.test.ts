import SpotifyWebApi from '../spotifyApi';
import fetch from '../customFetch';

// Mock the customFetch module
jest.mock('../customFetch');
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('SpotifyWebApi', () => {
  let api: SpotifyWebApi;
  const mockToken = 'mock-token';
  const mockResponse = { ok: true, status: 200, text: jest.fn() };

  beforeEach(() => {
    api = new SpotifyWebApi();
    api.setAccessToken(mockToken);
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('should fetch current user profile', async () => {
      const mockUser = { id: '123', display_name: 'Test User' };
      mockResponse.text.mockResolvedValueOnce(JSON.stringify(mockUser));
      mockedFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await api.getMe();

      expect(mockedFetch).toHaveBeenCalledWith('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserPlaylists', () => {
    it('should fetch the current user playlists', async () => {
      const mockPlaylists = { items: [] };
      mockResponse.text.mockResolvedValueOnce(JSON.stringify(mockPlaylists));
      mockedFetch.mockResolvedValueOnce(mockResponse as any);

      await api.getCurrentUserPlaylists();

      expect(mockedFetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/me/playlists',
        expect.any(Object)
      );
    });
  });

  describe('removeTracksFromPlaylist', () => {
    it('should remove tracks from playlist', async () => {
      mockResponse.text.mockResolvedValueOnce(JSON.stringify({ snapshot_id: 'xyz' }));
      mockedFetch.mockResolvedValueOnce(mockResponse as any);

      await api.removeTracksFromPlaylist('playlistId', [0, 1, 2]);

      expect(mockedFetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/playlists/playlistId/tracks',
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${mockToken}` },
          body: JSON.stringify({ positions: [0, 1, 2] }),
        }
      );
    });
  });

  describe('addTracksToPlaylist', () => {
    it('should add tracks to playlist', async () => {
      mockResponse.text.mockResolvedValueOnce(JSON.stringify({ snapshot_id: 'xyz' }));
      mockedFetch.mockResolvedValueOnce(mockResponse as any);

      const uris = ['spotify:track:1', 'spotify:track:2'];
      await api.addTracksToPlaylist('playlistId', uris, 0);

      expect(mockedFetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/playlists/playlistId/tracks',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${mockToken}` },
          body: JSON.stringify({ uris, position: 0 }),
        }
      );
    });
  });

  describe('getMySavedTracks', () => {
    it('should fetch saved tracks', async () => {
      const mockTracks = { items: [], total: 0 };
      mockResponse.text.mockResolvedValueOnce(JSON.stringify(mockTracks));
      mockedFetch.mockResolvedValueOnce(mockResponse as any);

      await api.getMySavedTracks({ limit: 50 });

      expect(mockedFetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/me/tracks?limit=50',
        expect.any(Object)
      );
    });
  });

  describe('removeFromMySavedTracks', () => {
    it('should remove tracks from saved tracks', async () => {
      mockResponse.text.mockResolvedValueOnce(JSON.stringify({}));
      mockedFetch.mockResolvedValueOnce(mockResponse as any);

      const trackIds = ['1', '2', '3'];
      await api.removeFromMySavedTracks(trackIds);

      expect(mockedFetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/me/tracks',
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${mockToken}` },
          body: JSON.stringify({ ids: trackIds }),
        }
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockedFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.getMe()).rejects.toThrow('Network error');
    });

    it('should handle server errors', async () => {
      const errorResponse = {
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValueOnce(JSON.stringify({ error: 'Server error' })),
      };
      mockedFetch.mockResolvedValueOnce(errorResponse as any);

      await expect(api.getMe()).rejects.toMatchObject({
        name: 'ServerException',
        status: 500,
      });
    });

    it('should handle application errors', async () => {
      const errorResponse = {
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValueOnce(JSON.stringify({ error: 'Bad request' })),
      };
      mockedFetch.mockResolvedValueOnce(errorResponse as any);

      await expect(api.getMe()).rejects.toMatchObject({
        name: 'ApplicationException',
        status: 400,
      });
    });

    it('should handle invalid JSON responses', async () => {
      const invalidResponse = {
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValueOnce('invalid json'),
      };
      mockedFetch.mockResolvedValueOnce(invalidResponse as any);

      await expect(api.getMe()).rejects.toMatchObject({
        name: 'InvalidJSONException',
      });
    });
  });
}); 