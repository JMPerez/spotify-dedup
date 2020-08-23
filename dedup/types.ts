import { SpotifyTrackType, SpotifyPlaylistType } from './spotifyApi';
import { ReactElement } from 'react';

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
