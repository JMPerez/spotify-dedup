import { SpotifyPlaylist, SpotifyTrack } from './spotifyApi';

export type PlaylistModel = {
  playlist: SpotifyPlaylist;
  duplicates: Array<Duplicate>;
  status: string;
  processed: boolean;
};

export type DuplicateReason = 'same-id' | 'same-name-artist';
export type Duplicate = {
  index: number;
  reason: DuplicateReason;
  track: SpotifyTrack;
}