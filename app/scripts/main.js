import OAuthManager from './oauth-manager';
import { PlaylistDeduplicator, SavedTracksDeduplicator } from './deduplicator';
import SpotifyWebApi from './spotify-api';
import PlaylistCache from './playlist-cache';
import mainCss from '../styles/main.css';
import customCss from '../styles/custom.css';
import favicon from '../favicon.ico';
import { fetchUserOwnedPlaylists } from './library';

const playlistCache = new PlaylistCache();

let api;

const init = function() {
  let app = new Vue({
    el: '#app',
    data: {
      isLoggedIn: false,
      toProcess: 100,
      playlists: [],
      savedTracks: {
        duplicates: [],
        status: '',
      },
    },
    methods: {
      removeDuplicates: playlistModel =>
        (async () => {
          if (playlistModel.playlist.id === 'starred') {
            global.alert(
              'It is not possible to delete duplicates from your Starred playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
            );
          }
          if (playlistModel.playlist.collaborative) {
            global.alert(
              'It is not possible to delete duplicates from a collaborative playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
            );
          } else {
            try {
              const duplicates = await PlaylistDeduplicator.removeDuplicates(
                api,
                playlistModel
              );
              playlistModel.duplicates = [];
              playlistModel.status = 'Duplicates removed';
              if (global.ga) {
                ga(
                  'send',
                  'event',
                  'spotify-dedup',
                  'playlist-removed-duplicates'
                );
              }
            } catch (e) {
              global.Raven &&
                Raven.captureMessage(
                  `Exception trying to remove duplicates from playlist`,
                  {
                    extra: {
                      duplicates: playlistModel.duplicates,
                    },
                  }
                );
            }
          }
        })(),
      removeDuplicatesInSavedTracks: () =>
        (async () => {
          const duplicates = await SavedTracksDeduplicator.removeDuplicates(
            api,
            app.savedTracks
          );
          app.savedTracks.duplicates = [];
          app.savedTracks.status = 'Duplicates removed';
          if (global.ga) {
            ga(
              'send',
              'event',
              'spotify-dedup',
              'saved-tracks-removed-duplicates'
            );
          }
        })(),
    },
    computed: {
      duplicates: function() {
        return (
          this.playlists.reduce(
            (prev, current) => prev + current.duplicates.length,
            0
          ) + this.savedTracks.duplicates.length
        );
      },
    },
  });

  document.getElementById('login').addEventListener('click', async () => {
    const token = await OAuthManager.obtainToken({
      scopes: [
        /*
          the permission for reading public playlists is granted
          automatically when obtaining an access token through
          the user login form
          */
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-library-read',
        'user-library-modify',
      ],
    }).catch(function(error) {
      console.error('There was an error obtaining the token', error);
    });

    onTokenReceived(token);

    function onPlaylistProcessed(playlist) {
      playlist.processed = true;
      var remaining = app.toProcess - 1;
      app.toProcess -= 1;
      if (remaining === 0 && global.ga) {
        ga('send', 'event', 'spotify-dedup', 'library-processed');
      }
    }

    const playlistToPlaylistModel = playlist => ({
      playlist: playlist,
      duplicates: [],
      status: '',
      processed: false,
    });

    async function onUserDataFetched(data) {
      var user = data.id,
        playlistsToCheck = [];

      let ownedPlaylists;
      ownedPlaylists = await fetchUserOwnedPlaylists(api, user).catch(e => {
        if (global.ga) {
          ga('send', 'event', 'spotify-dedup', 'error-fetching-user-playlists');
        }
        console.error("There was an error fetching user's playlists", e);
      });

      if (ownedPlaylists) {
        playlistsToCheck = ownedPlaylists;
        app.playlists = playlistsToCheck.map(p => playlistToPlaylistModel(p));
        app.toProcess = app.playlists.length + 1 /* saved tracks */;
        const savedTracks = await SavedTracksDeduplicator.getTracks(
          api,
          api.getMySavedTracks({ limit: 50 })
        );
        app.savedTracks.duplicates = SavedTracksDeduplicator.findDuplicatedTracks(
          savedTracks
        );
        if (app.savedTracks.duplicates.length && global.ga) {
          ga('send', 'event', 'spotify-dedup', 'saved-tracks-found-duplicates');
        }
        app.toProcess--;

        for (const playlistModel of app.playlists) {
          if (playlistCache.needsCheckForDuplicates(playlistModel.playlist)) {
            let playlistTracks;
            try {
              playlistTracks = await PlaylistDeduplicator.getTracks(
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
              onPlaylistProcessed(playlistModel.playlist);
            } catch (e) {
              console.error(
                'There was an error fetching tracks for playlist',
                playlistModel.playlist,
                e
              );
              onPlaylistProcessed(playlistModel.playlist);
            }
          } else {
            onPlaylistProcessed(playlistModel.playlist);
          }
        }
      }
    }

    async function onTokenReceived(accessToken) {
      app.isLoggedIn = true;
      api = new SpotifyWebApi();
      api.setAccessToken(accessToken);

      const meData = await api.getMe();
      onUserDataFetched(meData);
    }
  });
};

global.Raven &&
  Raven.config(
    'https://22cbac299caf4962b74de18bc87a8d74@sentry.io/1239123'
  ).install();

if (global.Raven) {
  Raven.context(init);
} else {
  init();
}
