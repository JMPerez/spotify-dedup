import { fetchUserOwnedPlaylists } from './library';
import { MultiPlaylistDeduplicator, PlaylistDeduplicator, SavedTracksDeduplicator } from './deduplicator';
import PlaylistCache from './playlistCache';
import { PlaylistModel } from './types';
import SpotifyWebApi, {
  SpotifyUserType,
  SpotifyPlaylistType,
  SpotifyTrackType,
} from './spotifyApi';

const playlistCache = new PlaylistCache();

const playlistToPlaylistModel = (
  playlist: SpotifyPlaylistType
): PlaylistModel => ({
  playlist: playlist,
  duplicates: [],
  status: '',
  processed: false,
});

export default class {
  listeners: {};
  constructor() {
    this.listeners = {};
  }

  on(event: string, fn) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(fn);
  }

  dispatch(event: string, params) {
    const callbacks = this.listeners[event];
    callbacks.forEach((callback) => callback(params));
  }

  process = async (api: SpotifyWebApi, user: SpotifyUserType, crossPlaylistDedup: boolean) => {
    const currentState: {
      playlists?: Array<PlaylistModel>;
      savedTracks?: {
        duplicates?: Array<any>;
      };
      toProcess?: number;
    } = {};

    const dispatch = this.dispatch.bind(this);
    function onMultiPlaylistProcessed() {
      if (global['ga']) {
        global['ga']('send', 'event', 'spotify-dedup', 'library-processed');
      }
      dispatch('updateState', currentState);
    }
    function onPlaylistProcessed(playlist: PlaylistModel) {
      playlist.processed = true;
      var remaining = currentState.toProcess - 1;
      currentState.toProcess -= 1;
      if (remaining === 0) {
        if (global['ga']) {
          global['ga']('send', 'event', 'spotify-dedup', 'library-processed');
        }
      }
      dispatch('updateState', currentState);
    }

    let playlistsToCheck = [];
    const ownedPlaylists: Array<SpotifyPlaylistType> = await fetchUserOwnedPlaylists(
      api,
      user.id
    ).catch((e) => {
      if (global['ga']) {
        global['ga'](
          'send',
          'event',
          'spotify-dedup',
          'error-fetching-user-playlists'
        );
      }
      console.error("There was an error fetching user's playlists", e);
    });

    if (ownedPlaylists) {
      playlistsToCheck = ownedPlaylists;
      currentState.playlists = playlistsToCheck.map((p) =>
        playlistToPlaylistModel(p)
      );
      if (crossPlaylistDedup) {
        const playlistTracks = await MultiPlaylistDeduplicator.getTracks(
          api,
          currentState.playlists.map(playlistModel => playlistModel.playlist)
        );
        const duplicates = MultiPlaylistDeduplicator.findDuplicatedTracks(playlistTracks.flat());
        duplicates.forEach(dup => {
          currentState.playlists.filter((pl) => pl.playlist.id === dup.newerPlaylist.id)[0].duplicates.push(dup);
        });
        onMultiPlaylistProcessed();
      } else {
        currentState.toProcess =
          currentState.playlists.length + 1 /* saved tracks */;
        currentState.savedTracks = {};
        const savedTracks = await SavedTracksDeduplicator.getTracks(
          api,
          api.getMySavedTracks({ limit: 50 })
        );
        currentState.savedTracks.duplicates = SavedTracksDeduplicator.findDuplicatedTracks(
          savedTracks
        );
        if (currentState.savedTracks.duplicates.length && global['ga']) {
          global['ga'](
            'send',
            'event',
            'spotify-dedup',
            'saved-tracks-found-duplicates'
          );
        }
        currentState.toProcess--;

        this.dispatch('updateState', currentState);
        for (const playlistModel of currentState.playlists) {
          if (playlistCache.needsCheckForDuplicates(playlistModel.playlist)) {
            try {
              const playlistTracks = await PlaylistDeduplicator.getTracks(
                api,
                playlistModel.playlist
              );
              playlistModel.duplicates = PlaylistDeduplicator.findDuplicatedTracks(
                playlistTracks
              );
              if (playlistModel.duplicates.length === 0) {
                playlistCache.storePlaylistWithoutDuplicates(
                  playlistModel.playlist
                );
              }
              onPlaylistProcessed(playlistModel);
            } catch (e) {
              console.error(
                'There was an error fetching tracks for playlist',
                playlistModel.playlist,
                e
              );
              onPlaylistProcessed(playlistModel);
            }
          } else {
            onPlaylistProcessed(playlistModel);
          }
        }
      }
    }
  };
}
