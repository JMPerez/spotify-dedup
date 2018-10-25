jest.mock('./custom-fetch');
import fetch from './custom-fetch';
import { PlaylistDeduplicator } from './deduplicator';
import SpotifyWebApi from './spotify-api';

describe('PlaylistDeduplicator', () => {
  test('it returns the tracks correctly', async () => {
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
    const deduplicator = new PlaylistDeduplicator(api);
    const playlist = {
      tracks: {
        href:
          'https://api.spotify.com/v1/playlists/777kAfwZNWjBOc9qu1Kvv8/tracks',
        total: 3,
      },
    };
    const tracks = await deduplicator.getTracks(playlist);
    expect(tracks).toEqual([
      { id: '5iufLITrEbQJRT7WR8Vrxl' },
      { id: '1iufLITrEbQJRT7WR8Vrxl' },
      { id: '2iufLITrEbQJRT7WR8Vrxl' },
    ]);
  });

  test('it finds duplicates with same id', async () => {
    const token = 'my token';
    const api = new SpotifyWebApi();
    api.setAccessToken(token);
    const deduplicator = new PlaylistDeduplicator(api);
    const tracks = deduplicator.findDuplicatedTracks([
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

  test('it finds duplicates with same track name, artist and similarduration', async () => {
    const token = 'my token';
    const api = new SpotifyWebApi();
    api.setAccessToken(token);
    const deduplicator = new PlaylistDeduplicator(api);
    const tracks = deduplicator.findDuplicatedTracks([
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
    const deduplicator = new PlaylistDeduplicator(api);
    const tracks = deduplicator.findDuplicatedTracks([
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

/*
   
     
    */
