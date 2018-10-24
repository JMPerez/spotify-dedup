import PlaylistCache from './playlist-cache';
test('it works', () => {
  const playlist = {
    snapshot_id: 'id01',
  };
  const playlistCache = new PlaylistCache();
  expect(playlistCache.needsCheckForDuplicates(playlist)).toBe(true);
  playlistCache.storePlaylistWithoutDuplicates(playlist);
  expect(playlistCache.needsCheckForDuplicates(playlist)).toBe(false);
});
