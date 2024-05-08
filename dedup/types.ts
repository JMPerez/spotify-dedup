import { SpotifyPlaylistType, SpotifyTrackType } from './spotifyApi';

export type PlaylistModel = {
  playlist: SpotifyPlaylistType;
  duplicates: Array<Duplicate>;
  status: string;
  processed: boolean;
};

export type DuplicateReason = 'same-id' | 'same-name-artist';
export type Duplicate = {
  index: number;
  reason: DuplicateReason;
  track: SpotifyTrackType;
}