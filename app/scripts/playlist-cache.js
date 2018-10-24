export default class PlaylistCache {
  needsCheckForDuplicates(playlist) {
    if ('snapshot_id' in playlist) {
      try {
        if (localStorage.getItem(playlist.snapshot_id) === '0') {
          return false;
        }
      } catch (e) {
        return true;
      }
    }
    return true;
  }

  storePlaylistWithoutDuplicates(playlist) {
    if ('snapshot_id' in playlist) {
      try {
        localStorage.setItem(playlist.snapshot_id, '0');
      } catch (e) {}
    }
  }
}
