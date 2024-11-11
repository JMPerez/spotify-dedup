import { PlaylistDeduplicator, SavedTracksDeduplicator } from './deduplicator';
import SpotifyWebApi, {
  SpotifyCurrentUser,
  SpotifyPlaylist
} from './spotifyApi';

import { logEvent } from '@/utils/analytics';
import { fetchUserOwnedPlaylists } from './library';
import PlaylistCache from './playlistCache';
import { PlaylistModel } from './types';

const playlistCache = new PlaylistCache();

const playlistToPlaylistModel = (
  playlist: SpotifyPlaylist
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

  process = async (api: SpotifyWebApi, user: SpotifyCurrentUser) => {
    let currentState: {
      playlists?: Array<PlaylistModel>;
      savedTracks?: {
        duplicates?: Array<any>;
      };
      toProcess?: number;
      progress: number;  // 0 to 100
      totalTracksToDownload: number;
      totalTracksDownloaded: number;
    } = {
      progress: 0,
      totalTracksToDownload: 0,
      totalTracksDownloaded: 0
    };

    const dispatch = this.dispatch.bind(this);
    function onPlaylistProcessed(playlist: PlaylistModel) {
      playlist.processed = true;

      currentState = {
        ...currentState,
        toProcess: currentState.toProcess ? currentState.toProcess - 1 : undefined,
        totalTracksDownloaded: currentState.totalTracksDownloaded + playlist.playlist.tracks.total,
        progress: 10 + 90 * ((currentState.totalTracksDownloaded + playlist.playlist.tracks.total) / currentState.totalTracksToDownload)
      }

      let remaining = currentState.toProcess;

      if (remaining === 0) {
        logEvent('library_processed');
      }
      dispatch('updateState', currentState);
    }

    let playlistsToCheck: Array<SpotifyPlaylist> = [];
    const ownedPlaylists: Array<SpotifyPlaylist> = await fetchUserOwnedPlaylists(
      api,
      user.id,
      (progress) => {
        currentState.progress = 10 * progress;
        this.dispatch('updateState', currentState);
      }
    ).catch((e) => {
      logEvent('error_fetching_user_playlists');
      console.error("There was an error fetching user's playlists", e);
    });

    currentState.progress = 10;
    this.dispatch('updateState', currentState);

    playlistsToCheck = ownedPlaylists;
    currentState.playlists = playlistsToCheck.map((p) =>
      playlistToPlaylistModel(p)
    );
    currentState.toProcess =
      currentState.playlists.length + 1 /* saved tracks */;
    currentState.savedTracks = {};
    const savedTracksFirstPage = await api.getMySavedTracks({ limit: 50 });

    currentState.totalTracksToDownload = savedTracksFirstPage.total
      + ownedPlaylists.reduce((acc, current) => acc + current.tracks.total, 0);
    currentState.totalTracksDownloaded = 0;

    const savedTracks = await SavedTracksDeduplicator.getTracks(
      api,
      api.getMySavedTracks({ limit: 50 }),
      (progress) => {
        currentState = {
          ...currentState,
          progress: 10 + 90 * savedTracksFirstPage.total * progress / currentState.totalTracksToDownload
        };
        this.dispatch('updateState', currentState);
      });

    currentState.savedTracks.duplicates = SavedTracksDeduplicator.findDuplicatedTracks(
      savedTracks
    );

    if (currentState.savedTracks?.duplicates?.length) {
      logEvent('saved_tracks_found_duplicates');
    }

    currentState = {
      ...currentState,
      toProcess: currentState.toProcess - 1,
      totalTracksDownloaded: savedTracksFirstPage.total,
      progress: 10 + 90 * (savedTracksFirstPage.total / currentState.totalTracksToDownload)
    }

    this.dispatch('updateState', currentState);

    for (const playlistModel of currentState.playlists || []) {
      if (playlistCache.needsCheckForDuplicates(playlistModel.playlist)) {
        try {
          let prevTotalTracksDownloaded = currentState.totalTracksDownloaded;
          const playlistTracks = await PlaylistDeduplicator.getTracks(
            api,
            playlistModel.playlist,
            (progress) => {
              currentState = {
                ...currentState,
                progress: 10 + 90 * (prevTotalTracksDownloaded + progress * playlistModel.playlist.tracks.total) / currentState.totalTracksToDownload
              };
              this.dispatch('updateState', currentState);
            });
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
    this.dispatch('updateState', currentState);

  };
}
