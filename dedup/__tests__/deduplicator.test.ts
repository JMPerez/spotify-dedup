import { PlaylistDeduplicator, SavedTracksDeduplicator } from '../deduplicator';
import SpotifyWebApi, { SpotifyPlaylist, SpotifyTrack } from '../spotifyApi';

import { PlaylistModel, DuplicateMatchingConfig } from '../types';

// Mock SpotifyWebApi
jest.mock('../spotifyApi');

describe('BaseDeduplicator', () => {
  describe('findDuplicatedTracks', () => {
    it('should identify duplicates with same ID', () => {
      const tracks = [
        createTrack({ id: '1', name: 'Track 1', duration_ms: 1000 }),
        createTrack({ id: '2', name: 'Track 2', duration_ms: 2000 }),
        createTrack({ id: '1', name: 'Track 1', duration_ms: 1000 }), // Duplicate
      ];

      const duplicates = PlaylistDeduplicator.findDuplicatedTracks(tracks);

      expect(duplicates).toHaveLength(1);
      expect(duplicates[0].reason).toBe('same-id');
      expect(duplicates[0].index).toBe(2);
    });

    it('should identify duplicates with same name and artist', () => {
      const tracks = [
        createTrack({ id: '1', name: 'Track 1', duration_ms: 1000 }),
        createTrack({ id: '2', name: 'Track 1', duration_ms: 1001 }), // Similar duration
      ];

      const duplicates = PlaylistDeduplicator.findDuplicatedTracks(tracks);

      expect(duplicates).toHaveLength(1);
      expect(duplicates[0].reason).toBe('same-name-artist');
    });

    it('should respect custom duration threshold', () => {
      const tracks = [
        createTrack({ id: '1', name: 'Track 1', duration_ms: 1000 }),
        createTrack({ id: '2', name: 'Track 1', duration_ms: 1500 }), // 500ms difference
      ];

      // With default threshold (2000ms), should find duplicates
      // 使用默认阈值（2000毫秒），应该找到重复项
      let duplicates = PlaylistDeduplicator.findDuplicatedTracks(tracks);
      expect(duplicates).toHaveLength(1);

      // With custom threshold (200ms), should not find duplicates
      // 使用自定义阈值（200毫秒），不应该找到重复项
      const customConfig: DuplicateMatchingConfig = {
        enableNameAndArtistMatching: true,
        durationThresholdMs: 200
      };
      duplicates = PlaylistDeduplicator.findDuplicatedTracks(tracks, customConfig);
      expect(duplicates).toHaveLength(0);
    });

    it('should disable name and artist matching when configured', () => {
      const tracks = [
        createTrack({ id: '1', name: 'Track 1', duration_ms: 1000 }),
        createTrack({ id: '2', name: 'Track 1', duration_ms: 1001 }), // Same name, similar duration
      ];

      const config: DuplicateMatchingConfig = {
        enableNameAndArtistMatching: false,
        durationThresholdMs: 2000
      };

      const duplicates = PlaylistDeduplicator.findDuplicatedTracks(tracks, config);

      expect(duplicates).toHaveLength(0);
    });

    it('should ignore null tracks', () => {
      const tracks = [
        createTrack({ id: '1' }),
        null,
        createTrack({ id: '1' }),
      ];

      const duplicates = PlaylistDeduplicator.findDuplicatedTracks(tracks as any);

      expect(duplicates).toHaveLength(1);
    });
  });
});

describe('PlaylistDeduplicator', () => {
  let api: jest.Mocked<SpotifyWebApi>;

  beforeEach(() => {
    api = new SpotifyWebApi() as jest.Mocked<SpotifyWebApi>;
  });

  describe('getTracks', () => {
    it('should fetch all tracks from playlist', async () => {
      const playlist = createPlaylist();
      const mockTracks = {
        items: [{ track: createTrack({ id: '1' }) }],
        limit: 25,
        offset: 0,
        total: 1
      };

      api.getGeneric.mockResolvedValueOnce(mockTracks);

      const tracks = await PlaylistDeduplicator.getTracks(
        api,
        playlist,
        jest.fn()
      );

      expect(tracks).toHaveLength(1);
      expect(api.getGeneric).toHaveBeenCalledWith(playlist.tracks.href);
    });
  });

  describe('removeDuplicates', () => {
    it('should reject for starred playlist', async () => {
      const playlistModel = createPlaylistModel({ id: 'starred' });

      await expect(
        PlaylistDeduplicator.removeDuplicates(api, playlistModel)
      ).rejects.toMatch(/not possible.*Starred playlist/);
    });

    it('should remove duplicates in chunks', async () => {
      const duplicates = Array(150).fill(null).map((_, i) => ({
        index: i,
        track: createTrack({ id: `${i}` }),
        reason: 'same-id' as const,
      }));

      const playlistModel = createPlaylistModel({
        id: 'playlist1',
        duplicates
      });

      api.removeTracksFromPlaylist.mockResolvedValue({} as any);

      await PlaylistDeduplicator.removeDuplicates(api, playlistModel);

      expect(api.removeTracksFromPlaylist).toHaveBeenCalledTimes(2);
      expect(playlistModel.duplicates).toHaveLength(0);
    });
  });
});

describe('SavedTracksDeduplicator', () => {
  let api: jest.Mocked<SpotifyWebApi>;

  beforeEach(() => {
    api = new SpotifyWebApi() as jest.Mocked<SpotifyWebApi>;
  });

  describe('getTracks', () => {
    it('should fetch all saved tracks', async () => {
      const mockTracks = {
        items: [{ track: createTrack({ id: '1' }) }],
        total: 1,
        href: 'saved-tracks',
        limit: 20,
        offset: 0,
        next: null,
        previous: null
      };

      api.getGeneric.mockResolvedValueOnce(mockTracks);

      const tracks = await SavedTracksDeduplicator.getTracks(
        api,
        Promise.resolve(mockTracks),
        jest.fn()
      );

      expect(tracks).toHaveLength(1);
    });

    it('should handle errors when fetching tracks', async () => {
      const initialRequest = Promise.resolve({
        href: 'saved-tracks-error',
        items: [],
        limit: 20,
        total: 100,
        offset: 0,
        next: 'next-url',
        previous: null
      });

      api.getGeneric
        .mockRejectedValueOnce(new Error('API Error'))
        .mockRejectedValue(new Error('API Error'));

      await expect(
        SavedTracksDeduplicator.getTracks(
          api,
          initialRequest,
          jest.fn()
        )
      ).rejects.toThrow('API Error');
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicates in chunks', async () => {
      const duplicates = Array(75).fill(null).map((_, i) => ({
        index: i,
        track: createTrack({ id: `${i}` }),
        reason: 'same-id' as const,
      }));

      api.removeFromMySavedTracks.mockResolvedValue({} as any);

      await SavedTracksDeduplicator.removeDuplicates(api, { duplicates });

      expect(api.removeFromMySavedTracks).toHaveBeenCalledTimes(2);
    });
  });
});

// Helper functions to create test data
function createTrack(overrides = {}): SpotifyTrack {
  return {
    id: '1',
    name: 'Track 1',
    uri: 'spotify:track:1',
    duration_ms: 1000,
    artists: [{ name: 'Artist 1' }],
    ...overrides,
  } as SpotifyTrack;
}

function createPlaylist(overrides = {}): SpotifyPlaylist {
  return {
    id: 'playlist1',
    tracks: {
      href: 'tracks-href',
    },
    ...overrides,
  } as SpotifyPlaylist;
}
function createPlaylistModel(overrides = {}): PlaylistModel {
  return {
    playlist: createPlaylist(overrides),
    duplicates: [],
    status: 'not-started',
    processed: false,
    ...overrides,
  };
} 