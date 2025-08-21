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

// Duplicate matching configuration interface
// 重复匹配配置接口
export interface DuplicateMatchingConfig {
  // Whether to match by track name and artist / 是否根据歌曲名和艺术家匹配
  enableNameAndArtistMatching: boolean;
  // Duration difference threshold in milliseconds / 持续时间差异阈值（毫秒）
  durationThresholdMs: number;
}