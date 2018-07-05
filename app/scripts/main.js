import OAuthManager from './oauth-manager';

import { PlaylistDeduplicator, SavedTracksDeduplicator } from './deduplicator';
import PromiseThrottle from 'promise-throttle';

import mainCss from '../styles/main.css';
import customCss from '../styles/custom.css';

const apiPrefix = 'https://api.spotify.com/v1';
class SpotifyWebApi {
  constructor() {
    this.token = null;
  }

  setAccessToken(token) {
    this.token = token;
  }

  async getMe() {
    return await this.getGeneric(`${apiPrefix}/me`);
  }

  async getGeneric(url, options) {
    const optionsString =
      options === undefined
        ? ''
        : `?${Object.keys(options)
            .map(k => `${k}=${options[k]}`)
            .join('&')}`;

    const res = await fetch(`${url}${optionsString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
    const json = await res.json();
    if (res.ok) return json;
    return null;
  }

  async getUserPlaylists(userId, options) {
    const url =
      typeof userId === 'string'
        ? `${apiPrefix}/users/${encodeURIComponent(userId)}/playlists`
        : `${apiPrefix}/me/playlists`;
    return await this.getGeneric(url, options);
  }

  async removeTracksFromPlaylist(userId, playlistId, uris) {
    const dataToBeSent = {
      tracks: uris.map(uri => (typeof uri === 'string' ? { uri: uri } : uri))
    };

    const res = await fetch(
      `${apiPrefix}/users/${encodeURIComponent(
        userId
      )}/playlists/${playlistId}/tracks`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        body: JSON.stringify(dataToBeSent)
      }
    );

    const json = await res.json();
    if (res.ok) return json;
    return null;
  }

  async getMySavedTracks() {
    const res = await fetch(`${apiPrefix}/me/tracks`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    const json = await res.json();
    if (res.ok) return json;
    return null;
  }

  async removeFromMySavedTracks(trackIds) {
    const res = await fetch(`${apiPrefix}/me/tracks`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      body: JSON.stringify(trackIds)
    });

    if (res.ok) return true;
    return false;
  }
}

const promiseThrottle = new PromiseThrottle({ requestsPerSecond: 5 });

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
      status: null
    }
  },
  methods: {
    removeDuplicates: playlistModel =>
      (async () => {
        if (playlistModel.playlist.id === 'starred') {
          window.alert(
            'It is not possible to delete duplicates from your Starred playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
          );
        }
        if (playlistModel.playlist.collaborative) {
          window.alert(
            'It is not possible to delete duplicates from a collaborative playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
          );
        } else {
          const duplicates = await playlistDeduplicator.removeDuplicates(
            playlistModel
          );
          playlistModel.duplicates = [];
          playlistModel.status = 'Duplicates removed';
          if (window.ga) {
            ga('send', 'event', 'spotify-dedup', 'playlist-removed-duplicates');
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
        if (window.ga) {
          ga(
            'send',
            'event',
            'spotify-dedup',
            'saved-tracks-removed-duplicates'
          );
        }
      })()
  },
  computed: {
    duplicates: function() {
      return (
        this.playlists.reduce(
          (prev, current) => prev + current.duplicates.length,
          0
        ) + this.savedTracks.duplicates.length
      );
    }
  }
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
      'user-library-modify'
    ]
  })
    .then(function(token) {
      onTokenReceived(token);
    })
    .catch(function(error) {
      console.error(error);
    });
});

function fetchUserOwnedPlaylists(user) {
  return promisesForPages(
    promiseThrottle.add(function() {
      // fetch user's playlists, 50 at a time
      return api.getUserPlaylists(user, { limit: 50 });
    })
  )
    .then(function(pagePromises) {
      // wait for all promises to be finished
      return Promise.all(pagePromises);
    })
    .then(function(pages) {
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
  if (remaining === 0 && window.ga) {
    ga('send', 'event', 'spotify-dedup', 'library-processed');
  }
}

const playlistToPlaylistModel = playlist => ({
  playlist: playlist,
  duplicates: [],
  status: '',
  processed: false
});

async function onUserDataFetched(data) {
  var user = data.id,
    playlistsToCheck = [];

  const ownedPlaylists = await fetchUserOwnedPlaylists(user);
  playlistsToCheck = ownedPlaylists;
  app.playlists = playlistsToCheck.map(p => playlistToPlaylistModel(p));
  app.toProcess = app.playlists.length + 1 /* saved tracks */;
  const savedTracksInitial = await api.getMySavedTracks();
  const savedTracks = await savedTracksDeduplicator.getTracks(
    savedTracksInitial
  );
  app.savedTracks.duplicates = savedTracksDeduplicator.findDuplicatedTracks(
    savedTracks
  );
  if (app.savedTracks.duplicates.length && window.ga) {
    ga('send', 'event', 'spotify-dedup', 'saved-tracks-found-duplicates');
  }
  app.toProcess--;

  app.playlists.forEach(playlistModel =>
    (async () => {
      const playlistTracks = await playlistDeduplicator.getTracks(
        playlistModel.playlist
      );
      playlistModel.duplicates = playlistDeduplicator.findDuplicatedTracks(
        playlistTracks
      );
      onPlaylistProcessed(playlistModel.playlist);
    })()
  );
}

function onTokenReceived(accessToken) {
  app.isLoggedIn = true;
  api = new SpotifyWebApi();
  api.setAccessToken(accessToken);

  playlistDeduplicator = new PlaylistDeduplicator(api, promiseThrottle);
  savedTracksDeduplicator = new SavedTracksDeduplicator(api, promiseThrottle);

  promiseThrottle.add(function() {
    return api.getMe().then(data =>
      (async () => {
        await onUserDataFetched(data);
      })()
    );
  });
}

function promisesForPages(promise) {
  function stripParameters(href) {
    var u = new URL(href);
    return u.origin + u.pathname;
  }

  function fetchGeneric(results, offset, limit) {
    return api.getGeneric(
      stripParameters(results.href) + '?offset=' + offset + '&limit=' + limit
    );
  }

  return new Promise(function(resolve, reject) {
    promise
      .then(function(results) {
        const promises = [promise]; // add the initial page
        let offset = results.limit + results.offset; // start from the second page
        const limit = results.limit;
        while (results.total > offset) {
          const q = promiseThrottle.add(
            fetchGeneric.bind(this, results, offset, limit)
          );
          promises.push(q);
          offset += limit;
        }
        resolve(promises);
      })
      .catch(function() {
        reject([]);
      });
  });
}
