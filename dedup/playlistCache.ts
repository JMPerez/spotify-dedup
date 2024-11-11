import { SpotifyPlaylist } from './spotifyApi';
const SNAPSHOT_VERSION = 'v1';
export default class PlaylistCache {
  needsCheckForDuplicates(playlist: SpotifyPlaylist) {
    if (playlist.snapshot_id) {
      try {
        if (localStorage.getItem(playlist.snapshot_id) === SNAPSHOT_VERSION) {
          return false;
        }
      } catch (e) {
        return true;
      }
    }
    return true;
  }

  storePlaylistWithoutDuplicates(playlist: SpotifyPlaylist) {
    if (playlist.snapshot_id) {
      try {
        localStorage.setItem(playlist.snapshot_id, SNAPSHOT_VERSION);
      } catch (e) { }
    }
  }
}
