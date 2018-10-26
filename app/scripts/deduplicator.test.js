jest.mock('./custom-fetch');
import fetch from './custom-fetch';
import { PlaylistDeduplicator } from './deduplicator';
import SpotifyWebApi from './spotify-api';

describe('PlaylistDeduplicator', () => {
  test('it returns the tracks correctly (single page)', async () => {
    const token = 'my token';

    const response = {
      href:
        'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks?offset=0&limit=100',
      items: [
        {
          track: {
            id: '5iufLITrEbQJRT7WR8Vrxl',
          },
        },
        {
          track: {
            id: '1iufLITrEbQJRT7WR8Vrxl',
          },
        },
        {
          track: {
            id: '2iufLITrEbQJRT7WR8Vrxl',
          },
        },
      ],
      offset: 0,
      limit: 100,
      total: 3,
    };

    fetch.mockImplementation((url, options) => {
      expect(url).toBe(
        'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks'
      );
      expect(options).toEqual({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return Promise.resolve({
        ok: true,
        json: () => response,
        text: () => JSON.stringify(response),
      });
    });

    const api = new SpotifyWebApi();
    api.setAccessToken(token);
    const playlist = {
      tracks: {
        href:
          'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks',
        total: 3,
      },
    };
    const tracks = await PlaylistDeduplicator.getTracks(api, playlist);
    expect(tracks).toEqual([
      { id: '5iufLITrEbQJRT7WR8Vrxl' },
      { id: '1iufLITrEbQJRT7WR8Vrxl' },
      { id: '2iufLITrEbQJRT7WR8Vrxl' },
    ]);
  });

  test('it returns the tracks correctly (multiple pages)', async () => {
    const token = 'my token';

    const responses = [
      {
        href:
          'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks?offset=0&limit=3',
        items: [
          {
            track: {
              id: '0',
            },
          },
          {
            track: {
              id: '1',
            },
          },
          {
            track: {
              id: '2',
            },
          },
        ],
        offset: 0,
        limit: 3,
        total: 7,
      },
      {
        href:
          'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks?offset=3&limit=3',
        items: [
          {
            track: {
              id: '3',
            },
          },
          {
            track: {
              id: '4',
            },
          },
          {
            track: {
              id: '5',
            },
          },
        ],
        offset: 3,
        limit: 3,
        total: 7,
      },
      {
        href:
          'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks?offset=6&limit=3',
        items: [
          {
            track: {
              id: '6',
            },
          },
        ],
        offset: 6,
        limit: 3,
        total: 7,
      },
    ];

    let responseIndex = 0;
    fetch.mockImplementation((url, options) => {
      switch (responseIndex) {
        case 0:
          expect(url).toEqual(
            'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks'
          );
          break;
        case 1:
          expect(url).toEqual(
            'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks?offset=3&limit=3'
          );
          break;
        case 2:
          expect(url).toEqual(
            'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks?offset=6&limit=3'
          );
          break;
      }
      expect(options).toEqual({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = responses[responseIndex];
      responseIndex++;
      return Promise.resolve({
        ok: true,
        json: () => response,
        text: () => JSON.stringify(response),
      });
    });

    const api = new SpotifyWebApi();
    api.setAccessToken(token);
    const playlist = {
      tracks: {
        href:
          'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks',
        total: 7,
      },
    };
    const tracks = await PlaylistDeduplicator.getTracks(api, playlist);
    expect(tracks).toEqual([
      { id: '0' },
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '4' },
      { id: '5' },
      { id: '6' },
    ]);
  });

  test('it handles failing request for page in between when fetching tracks', async () => {
    const token = 'my token';

    const responses = [
      {
        href:
          'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks?offset=0&limit=3',
        items: [
          {
            track: {
              id: '0',
            },
          },
          {
            track: {
              id: '1',
            },
          },
          {
            track: {
              id: '2',
            },
          },
        ],
        offset: 0,
        limit: 3,
        total: 7,
      },
      null,
      {
        href:
          'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks?offset=6&limit=3',
        items: [
          {
            track: {
              id: '6',
            },
          },
        ],
        offset: 6,
        limit: 3,
        total: 7,
      },
    ];

    let responseIndex = 0;
    fetch.mockImplementation((url, options) => {
      switch (responseIndex) {
        case 0:
          expect(url).toEqual(
            'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks'
          );
          break;
        case 1:
          expect(url).toEqual(
            'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks?offset=3&limit=3'
          );
          break;
        case 2:
          expect(url).toEqual(
            'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks?offset=6&limit=3'
          );
          break;
      }
      expect(options).toEqual({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = responses[responseIndex];
      responseIndex++;
      if (response === null) {
        return Promise.reject();
      } else {
        return Promise.resolve({
          ok: true,
          json: () => response,
          text: () => JSON.stringify(response),
        });
      }
    });

    const api = new SpotifyWebApi();
    api.setAccessToken(token);
    const playlist = {
      tracks: {
        href:
          'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks',
        total: 7,
      },
    };
    const tracks = await PlaylistDeduplicator.getTracks(api, playlist);
    expect(tracks).toEqual([
      { id: '0' },
      { id: '1' },
      { id: '2' },
      null,
      null,
      null,
      { id: '6' },
    ]);
  });

  test('it finds duplicates with same id', async () => {
    const token = 'my token';
    const api = new SpotifyWebApi();
    api.setAccessToken(token);
    const tracks = PlaylistDeduplicator.findDuplicatedTracks([
      {
        id: '5iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 1',
      },
      {
        id: '1iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 2',
      },
      {
        id: '1iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 2',
      },
    ]);
    expect(tracks).toEqual([
      {
        index: 2,
        reason: 'same-id',
        track: {
          artists: [{ name: 'Madonna' }],
          id: '1iufLITrEbQJRT7WR8Vrxl',
          name: 'Track 2',
        },
      },
    ]);
  });

  test('it finds duplicates with same track name, artist and similar duration', async () => {
    const token = 'my token';
    const api = new SpotifyWebApi();
    api.setAccessToken(token);
    const tracks = PlaylistDeduplicator.findDuplicatedTracks([
      {
        id: '5iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 1',
        duration_ms: 1000,
      },
      {
        id: '2iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 2',
        duration_ms: 1000,
      },
      {
        id: '3iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 2',
        duration_ms: 1000,
      },
    ]);
    expect(tracks).toEqual([
      {
        index: 2,
        reason: 'same-name-artist',
        track: {
          artists: [{ name: 'Madonna' }],
          duration_ms: 1000,
          id: '3iufLITrEbQJRT7WR8Vrxl',
          name: 'Track 2',
        },
      },
    ]);
  });

  test('it finds duplicates with same track name and artist, and similar duration', async () => {
    const token = 'my token';
    const api = new SpotifyWebApi();
    api.setAccessToken(token);
    const tracks = PlaylistDeduplicator.findDuplicatedTracks([
      {
        id: '5iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 1',
        duration_ms: 1000,
      },
      {
        id: '2iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 2',
        duration_ms: 1000,
      },
      {
        id: '3iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 2',
        duration_ms: 2000,
      },
    ]);
    expect(tracks).toEqual([
      {
        index: 2,
        reason: 'same-name-artist',
        track: {
          artists: [{ name: 'Madonna' }],
          duration_ms: 2000,
          id: '3iufLITrEbQJRT7WR8Vrxl',
          name: 'Track 2',
        },
      },
    ]);
  });
});
