jest.mock('./custom-fetch');

import fetch from './custom-fetch';
import SpotifyWebApi from './spotify-api';
import getMeJson from './fixtures/get-me';
import getMySavedTracksJson from './fixtures/get-my-saved-tracks';

describe('spotify api', () => {
  let api;
  const token = 'my token';

  beforeEach(() => {
    api = new SpotifyWebApi();
    api.setAccessToken(token);
  });

  test('getMe', async () => {
    fetch.mockImplementation((url, options) => {
      expect(url).toBe('https://api.spotify.com/v1/me');
      expect(options).toEqual({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return Promise.resolve({
        ok: true,
        json: () => getMeJson,
        text: () => JSON.stringify(getMeJson),
      });
    });
    const result = await api.getMe();
    expect(result).toEqual(getMeJson);
  });

  test('getMySavedTracks', async () => {
    fetch.mockImplementation((url, options) => {
      expect(url).toBe('https://api.spotify.com/v1/me/tracks');
      expect(options).toEqual({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return Promise.resolve({
        ok: true,
        json: () => getMySavedTracksJson,
        text: () => JSON.stringify(getMySavedTracksJson),
      });
    });
    const result = await api.getMySavedTracks();
    expect(result).toEqual(getMySavedTracksJson);
  });

  test('removeTracksFromPlaylist', async () => {
    const response = {
      snapshot_id:
        'JbtmHBDBAYu3/bt8BOXKjzKx3i0b6LCa/wVjyl6qQ2Yf6nFXkbmzuEa+ZI/U1yF+',
    };
    fetch.mockImplementation((url, options) => {
      expect(url).toBe(
        'https://api.spotify.com/v1/users/userid/playlists/playlistid/tracks'
      );
      expect(options).toEqual({
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tracks: [{ uri: 'spotify:track:1' }],
        }),
      });
      return Promise.resolve({
        ok: true,
        json: () => response,
        text: () => JSON.stringify(response),
      });
    });
    const result = await api.removeTracksFromPlaylist('userid', 'playlistid', [
      'spotify:track:1',
    ]);
    expect(result).toEqual(response);
  });

  test('removeTracksFromPlaylist with error', async () => {
    fetch.mockImplementation((url, options) => {
      expect(url).toBe(
        'https://api.spotify.com/v1/users/userid/playlists/playlistid/tracks'
      );
      expect(options).toEqual({
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tracks: [{ uri: 'spotify:track:1' }],
        }),
      });
      return Promise.resolve({
        ok: false,
        status: 400,
        text: () => '',
      });
    });
    try {
      await api.removeTracksFromPlaylist('userid', 'playlistid', [
        'spotify:track:1',
      ]);
    } catch (e) {
      expect(e).toEqual({
        body: null,
        status: 400,
        type: 'ApplicationError',
      });
    }
  });
});
