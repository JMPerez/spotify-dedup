import { SpotifyTrackType, SpotifyPlaylistType } from './spotify-api';
import { ReactElement } from 'react';

export type PlaylistModel = {
  playlist: SpotifyPlaylistType;
  duplicates: Array<{
    index: number;
    reason: string;
    track: SpotifyTrackType;
  }>;
  status: string | ReactElement;
  processed: boolean;
};
