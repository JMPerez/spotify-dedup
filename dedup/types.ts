import { SpotifyTrackType, SpotifyPlaylistType } from './spotify-api';

export type PlaylistModel = {
  playlist: SpotifyPlaylistType;
  duplicates: Array<{
    index: number;
    reason: string;
    track: SpotifyTrackType;
  }>;
  status: string;
  processed: boolean;
};
