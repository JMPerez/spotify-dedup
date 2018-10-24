import OAuthManager from './oauth-manager';
import { PlaylistDeduplicator, SavedTracksDeduplicator } from './deduplicator';
import fetch from './custom-fetch';
import promisesForPages from './promiseForPages';
import SpotifyWebApi from './spotify-api';
import PlaylistCache from './playlist-cache';
import mainCss from '../styles/main.css';
import customCss from '../styles/custom.css';
import favicon from '../favicon.ico';

const playlistCache = new PlaylistCache();

const init = function() {
  let playlistDeduplicator;
  let savedTracksDeduplicator;

  let token, api;

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
              const duplicates = await playlistDeduplicator.removeDuplicates(
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
          const duplicates = await savedTracksDeduplicator.removeDuplicates(
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

  document.getElementById('login').addEventListener('click', function() {
    OAuthManager.obtainToken({
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
    })
      .then(function(token) {
        onTokenReceived(token);
      })
      .catch(function(error) {
        console.error(error);
      });
    // });

    function fetchUserOwnedPlaylists(user) {
      return promisesForPages(
        api.getUserPlaylists(user, { limit: 50 }),
        api
      ).then(function(pages) {
        // combine and filter playlists
        var userOwnedPlaylists = [];
        pages.forEach(function(page) {
          userOwnedPlaylists = userOwnedPlaylists.concat(
            page.items.filter(function(playlist) {
              return playlist.owner.id === user;
            })
          );
        });
        return userOwnedPlaylists;
      });
    }

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
      try {
        ownedPlaylists = await fetchUserOwnedPlaylists(user);
      } catch (e) {
        ga('send', 'event', 'spotify-dedup', 'error-fetching-user-playlists');
        console.error("There was an error fetching user's playlists", e);
      }

      if (ownedPlaylists) {
        playlistsToCheck = ownedPlaylists;
        app.playlists = playlistsToCheck.map(p => playlistToPlaylistModel(p));
        app.toProcess = app.playlists.length + 1 /* saved tracks */;
        const savedTracks = await savedTracksDeduplicator.getTracks(
          api.getMySavedTracks({ limit: 50 })
        );
        app.savedTracks.duplicates = savedTracksDeduplicator.findDuplicatedTracks(
          savedTracks
        );
        if (app.savedTracks.duplicates.length && global.ga) {
          ga('send', 'event', 'spotify-dedup', 'saved-tracks-found-duplicates');
        }
        app.toProcess--;

        app.playlists.forEach(playlistModel =>
          (async () => {
            if (playlistCache.needsCheckForDuplicates(playlistModel.playlist)) {
              let playlistTracks;
              try {
                playlistTracks = await playlistDeduplicator.getTracks(
                  playlistModel.playlist
                );
                playlistModel.duplicates = playlistDeduplicator.findDuplicatedTracks(
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
                  playlistModel.playlist
                );
                onPlaylistProcessed(playlistModel.playlist);
              }
            }
          })()
        );
      }
    }

    function onTokenReceived(accessToken) {
      app.isLoggedIn = true;
      api = new SpotifyWebApi();
      api.setAccessToken(accessToken);

      playlistDeduplicator = new PlaylistDeduplicator(api);
      savedTracksDeduplicator = new SavedTracksDeduplicator(api);

      let attempts = 0;
      const loginFunction = () => {
        return api.getMe().then(data => {
          if (data === null) {
            attempts++;
            global.Raven &&
              Raven.captureMessage(`Retrying logging user in`, {
                extra: {
                  attempts: attempts,
                },
              });
            loginFunction();
          } else {
            (async () => {
              await onUserDataFetched(data);
            })();
          }
        });
      };
      loginFunction();
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
